import { BaseSeeder } from '@adonisjs/lucid/seeders'
import App from '#models/app'
import Service from '#models/service'

export default class extends BaseSeeder {
  async run() {
    await App.create({
      name: 'test-app',
      typeAppId: 1,
    })
    await Service.create({
      name: 'test-service',
      appId: 1,
      typeServiceId: 1,
      repoUrl: 'test-repo-url',
      envEncrypted: 'test-env',
      isRunning: true,
      webhook: false,
      dnsAddress: 'test-app.local',
      port: 1000,
    })
    await Service.create({
      name: 'test-service-2',
      appId: 1,
      typeServiceId: 1,
      repoUrl: 'test-repo-url',
      envEncrypted: 'test-env',
      isRunning: true,
      webhook: false,
      dnsAddress: 'test2.com',
      port: 2000,
    })
    await Service.create({
      name: 'test-service-3',
      appId: 1,
      typeServiceId: 2,
      repoUrl: 'test-repo-url',
      envEncrypted: 'test-env',
      isRunning: true,
      webhook: false,
      dnsAddress: '',
      port: 3000,
    })
  }
}
