import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import TypeApp from '#models/type_app'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Service from '#models/service'

export default class App extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare typeAppId: number

  @belongsTo(() => TypeApp)
  declare typeApp: BelongsTo<typeof TypeApp>

  @hasMany(() => Service)
  declare services: HasMany<typeof Service>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
