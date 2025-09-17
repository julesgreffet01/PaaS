import type { HttpContext } from '@adonisjs/core/http'
import App from '#models/app'
import TypeApp from '#models/type_app'
import { appValidator } from '#validators/app'
import { inject } from '@adonisjs/core'
import DirManager from '#managers/dir_manager'
import { serviceValidator } from '#validators/service'
import { promises as fs } from 'node:fs'
import { ServiceService } from '#services/service_service'

@inject()
export default class AppController {
  constructor(
    private readonly dirManager: DirManager,
    private readonly serviceService: ServiceService
  ) {}

  async home({ inertia }: HttpContext) {
    const apps: App[] = await App.query().preload('typeApp').preload('services').orderBy('id')
    return inertia.render('app/Home', { apps })
  }

  async publication({ inertia }: HttpContext) {
    const types = await TypeApp.all()
    return inertia.render('app/Publication', { types })
  }

  async handlePublication({ request, response, session }: HttpContext) {
    const appData = request.only(['appName', 'typeAppId'])
    const appDataVerified = await appValidator.validate(appData)
    const app = await App.create({
      name: appDataVerified.appName,
      typeAppId: appDataVerified.typeAppId,
    })
    const url = `/projects`
    await this.dirManager.createDir(url, app.name)
    if (app.typeAppId === 2) {
      const serviceData = request.only([
        'dns',
        'migrations',
        'repoURL',
        'port',
        'webhook',
        'branch',
      ])
      const serviceName = app.name + '_app'
      const serviceDataVerified = await serviceValidator.validate({
        serviceName,
        repoURL: serviceData.repoURL,
        migrations: serviceData.migrations,
        webhook: serviceData.webhook,
        branch: serviceData.webhook ? serviceData.branch : '',
        dns: serviceData.dns,
        port: serviceData.port,
        appId: app.id,
        typeServiceId: 1,
      })

      const env = request.file('env')
      const envText = env ? await fs.readFile(env.tmpPath as string, 'utf8') : null

      await this.serviceService.create(app, serviceDataVerified, envText)
    }
    session.flash('success', 'Application créé avec succes')
    response.redirect().toRoute('app.home')
  }

  async show({ request, inertia }: HttpContext) {
    const appId = Number(request.param('appId'))
    const showData = await this.serviceService.show(appId)
    return inertia.render('app/Show', {
      app: showData.app,
      containers: showData.containers,
      deployLogs: showData.deployLogs,
    })
  }
}
