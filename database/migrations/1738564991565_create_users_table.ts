import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('email', 255).notNullable()
      table.string('first_name', 80).notNullable()
      table.string('last_name', 80).notNullable()
      table.date('birthday').notNullable()
      table.string('location', 255).notNullable()
      table.string('timezone', 255).notNullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
