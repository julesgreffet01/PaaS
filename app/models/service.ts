import { DateTime } from 'luxon'
import { BaseModel, beforeSave, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import App from '#models/app'
import TypeService from '#models/type_service'
import { v7 as uuidv7 } from 'uuid'
import Deployment from '#models/deployment'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @column()
  declare repoUrl: string

  @column()
  declare envEncrypted: string

  @column()
  declare isRunning: boolean

  @column()
  declare dnsAddress: string | null

  @column()
  declare port: number | null

  @column()
  declare migrations: string | null

  @column()
  declare webhook: boolean

  @column()
  declare branch: string | null

  @column()
  declare appId: number

  @belongsTo(() => App)
  declare app: BelongsTo<typeof App>

  @column()
  declare typeServiceId: number

  @belongsTo(() => TypeService)
  declare typeService: BelongsTo<typeof TypeService>

  @hasMany(() => Deployment)
  declare deployments: HasMany<typeof Deployment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @beforeSave()
  public static async assignId(service: Service) {
    if (!service.id) {
      service.id = uuidv7()
    }
  }
}
