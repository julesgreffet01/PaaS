import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'services'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.uuid('id').primary()
      table.string('name').notNullable().unique()
      table.text('repo_url').notNullable()
      table.text('env_encrypted').notNullable()
      table.boolean('is_running').notNullable()
      table.string('migrations').nullable()
      table.boolean('webhook').notNullable().defaultTo(false)
      table.string('branch').nullable()
      table.string('dns_address').unique().nullable()
      table.integer('port').nullable()
      table
        .integer('app_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('apps')
        .onDelete('CASCADE')
      table
        .integer('type_service_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('types_services')
        .onDelete('RESTRICT')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
