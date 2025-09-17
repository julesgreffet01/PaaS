import { BaseSeeder } from '@adonisjs/lucid/seeders'
import TypeApp from '#models/type_app'
import TypeService from '#models/type_service'

export default class extends BaseSeeder {
  async run() {
    await TypeApp.createMany([
      {
        name: 'microservice',
      },
      {
        name: 'monolith',
      },
      {
        name: 'front',
      },
    ])
    await TypeService.createMany([
      {
        name: 'app',
      },
      {
        name: 'database',
      },
      {
        name: 'worker',
      },
      {
        name: 'front',
      },
    ])
  }
}
