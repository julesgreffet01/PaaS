import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class extends BaseSeeder {
  async run() {
    await User.create({
      fullName: 'Jules Greffet',
      email: 'julesgreffet@gmail.com',
      password: 'aze',
    })
  }
}
