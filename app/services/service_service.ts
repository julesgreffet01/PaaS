import App from '#models/app'
import GithubManager from '#managers/github_manager'
import DockerManager from '#managers/docker_manager'
import MigrationsManager from '#managers/migrations_manager'
import CaddyManager from '#managers/caddy_manager'
import ServiceModel from '#models/service'
import encryption from '@adonisjs/core/services/encryption'
import Deployment from '#models/deployment'
import { environnement } from '../utils/functions.js'
import { inject } from '@adonisjs/core'

@inject()
export class ServiceService {
  constructor(
    private readonly githubManager: GithubManager,
    private readonly dockerManager: DockerManager,
    private readonly migrationManager: MigrationsManager,
    private readonly caddyManager: CaddyManager
  ) {}
  async create(
    app: App,
    serviceDataVerified: {
      serviceName: string
      repoURL: string
      migrations: string | null
      webhook: boolean
      branch: string | null
      dns: string
      port: number | null
      appId: number
      typeServiceId: number
    },
    envText: string | null
  ) {
    const service = await ServiceModel.create({
      name: serviceDataVerified.serviceName,
      repoUrl: serviceDataVerified.repoURL,
      envEncrypted: encryption.encrypt(envText),
      isRunning: false,
      dnsAddress: serviceDataVerified.dns,
      port: serviceDataVerified.port,
      migrations: serviceDataVerified.migrations,
      webhook: serviceDataVerified.webhook,
      branch: serviceDataVerified.branch,
      appId: serviceDataVerified.appId,
      typeServiceId: serviceDataVerified.typeServiceId,
    })

    const url = `/projects/${app.name}/${service.name}/`

    //repo
    try {
      await this.githubManager.gitClone(service.repoUrl, url)
      await Deployment.create({
        isSuccess: true,
        step: 'git clone repo',
        serviceId: service.id,
      })
    } catch (error) {
      await Deployment.create({
        isSuccess: false,
        step: 'git clone repo',
        errorLogs: error.message,
        serviceId: service.id,
      })
      throw error
    }

    //verif dockerfile
    try {
      await this.dockerManager.verifyFiles(url)
      await Deployment.create({
        isSuccess: true,
        step: 'verification du dockerfile et compose',
        serviceId: service.id,
      })
    } catch (error) {
      await Deployment.create({
        isSuccess: false,
        step: 'verification du dockerfile et compose',
        errorLogs: error.message,
        serviceId: service.id,
      })
      throw error
    }

    //environnement
    if (envText) {
      try {
        await environnement(envText, url)
        await Deployment.create({
          isSuccess: true,
          step: 'environnement',
          serviceId: service.id,
        })
      } catch (error) {
        await Deployment.create({
          isSuccess: false,
          step: 'environnement',
          errorLogs: error.message,
          serviceId: service.id,
        })
        throw error
      }
    }

    //docker
    try {
      await this.dockerManager.createContainersService(url)
      await Deployment.create({
        isSuccess: true,
        step: 'lancement docker',
        serviceId: service.id,
      })
    } catch (error) {
      await Deployment.create({
        isSuccess: false,
        step: 'lancement docker',
        errorLogs: error.message,
        serviceId: service.id,
      })
      throw error
    }

    //migrations
    if (service.migrations && service.migrations !== '' && service.migrations.trim()) {
      try {
        await this.migrationManager.makeMigration(url, service.migrations)
        await Deployment.create({
          isSuccess: true,
          step: 'lancement des migrations',
          serviceId: service.id,
        })
      } catch (error) {
        await Deployment.create({
          isSuccess: false,
          step: 'lancement des migrations',
          errorLogs: error.message,
          serviceId: service.id,
        })
        throw error
      }
    }

    // caddy
    if (service.dnsAddress && service.dnsAddress.length > 0 && service.port) {
      try {
        await this.caddyManager.createRoute(service.dnsAddress, service.port, service)
        await Deployment.create({
          isSuccess: true,
          step: 'changement caddy',
          serviceId: service.id,
        })
      } catch (error) {
        await Deployment.create({
          isSuccess: false,
          step: 'changement caddy',
          errorLogs: error.message,
          serviceId: service.id,
        })
        throw error
      }
    }
    service.merge({
      isRunning: true,
    })
    await service.save()
  }

  async show(appId: number) {
    const app = await App.query()
      .where('id', appId)
      .preload('typeApp')
      .preload('services', (sq) => {
        sq.preload('deployments').orderBy('id', 'desc')
        sq.preload('typeService')
      })
      .firstOrFail()
    const containers = await this.dockerManager.getContainersByService(app.services[0].name)
    const deployLogs = await Deployment.query().where('service_id', app.services[0].id)
    return {
      app,
      containers,
      deployLogs,
    }
  }
}
