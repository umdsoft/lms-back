/**
 * Migration: Create directions table
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('directions');
  
  if (!exists) {
    return knex.schema.createTable('directions', (table) => {
      table.increments('id').primary();
      table.string('name', 100).notNullable().unique();
      table.string('slug', 100).notNullable().unique();
      table.text('description').nullable();
      table.enum('color', ['blue', 'purple', 'orange', 'green', 'red', 'indigo', 'pink', 'yellow', 'teal', 'cyan']).notNullable();
      table.string('icon', 50).nullable();
      table.enum('status', ['active', 'inactive']).notNullable().defaultTo('active');
      table.integer('display_order').unsigned().notNullable().defaultTo(0);
      table.timestamps(true, true);

      // Indexes
      table.index('status');
      table.index('slug');
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('directions');
};