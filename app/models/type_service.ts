import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Service from '#models/service'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class TypeService extends BaseModel {
  public static table = 'types_services'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasMany(() => Service)
  declare services: HasMany<typeof Service>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
