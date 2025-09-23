import type { HttpContext } from '@adonisjs/core/http'
import TypeService from '#models/type_service'
import App from '#models/app'
import { serviceAppValidator, serviceDatabaseValidator } from '#validators/service'
import { promises as fs } from 'node:fs'
import { ServiceService } from '#services/service_service'
import { inject } from '@adonisjs/core'

@inject()
export default class ServicesController {
  constructor(private serviceService: ServiceService) {}

  async create({ inertia }: HttpContext) {
    const types = await TypeService.all()
    console.log(JSON.stringify(types, null, 2))
    return inertia.render('service/create', { types })
  }

  async handleCreate({ request, response, session }: HttpContext) {
    const appId = Number(request.param('appId'))
    const app = await App.findOrFail(appId)
    const typeServiceId = Number(request.only(['typeServiceId']).typeServiceId)
    if (typeServiceId === 1 || typeServiceId === 3) {
      const serviceData = request.only([
        'serviceName',
        'dns',
        'migrations',
        'repoURL',
        'port',
        'webhook',
        'branch',
      ])
      const serviceDataVerified = await serviceAppValidator.validate({
        serviceName: serviceData.serviceName,
        repoURL: serviceData.repoURL,
        migrations: serviceData.migrations,
        webhook: serviceData.webhook,
        branch: serviceData.webhook ? serviceData.branch : '',
        dns: serviceData.dns,
        port: serviceData.port,
        appId: app.id,
        typeServiceId: 1,
      })
      serviceDataVerified.serviceName = app.name + '_' + serviceDataVerified.serviceName

      const env = request.file('env')
      const envText = env ? await fs.readFile(env.tmpPath as string, 'utf8') : null

      await this.serviceService.create(app, serviceDataVerified, envText)
    } else if (typeServiceId === 2) {
      const dockerfile = request.file('dockerfile')
      const dockerfileText = dockerfile
        ? await fs.readFile(dockerfile.tmpPath as string, 'utf8')
        : null
      const compose = request.file('compose')
      const composeText = compose ? await fs.readFile(compose.tmpPath as string, 'utf8') : null
      const serviceData = await serviceDatabaseValidator.validate({
        serviceName: app.name + '_' + request.only(['serviceName']).serviceName,
        dockerfile: dockerfileText,
        compose: composeText,
        typeServiceId: typeServiceId,
      })
      await this.serviceService.createDatabase(app, serviceData)
    } else {
    }
    session.flash('success', 'Service créé avec succes')
    response.redirect().toRoute('app.show', { appId })
  }
}
