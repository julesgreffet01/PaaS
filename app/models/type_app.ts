import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import App from '#models/app'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class TypeApp extends BaseModel {
  public static table = 'types_apps'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @hasMany(() => App)
  declare apps: HasMany<typeof App>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
