import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Service from '#models/service'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Deployment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare isSuccess: boolean

  @column()
  declare step: string

  @column()
  declare errorLogs: string | null

  @column()
  declare serviceId: string

  @belongsTo(() => Service)
  declare service: BelongsTo<typeof Service>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
