import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'deployments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.boolean('is_success').notNullable()
      table.string('step').notNullable()
      table.text('error_logs').nullable()
      table
        .uuid('service_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE')
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
