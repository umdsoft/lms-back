/**
 * Migration: Create modules table
 * Modules are containers for lessons within a course
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('modules');
  
  if (!exists) {
    return knex.schema.createTable('modules', (table) => {
      table.increments('id').primary();
      table
        .integer('course_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('courses')
        .onDelete('CASCADE');
      table.string('name', 200).notNullable();
      table.text('description').nullable();
      table.integer('order').unsigned().notNullable().defaultTo(0);
      table.timestamps(true, true);

      // Indexes
      table.index('course_id');
      table.index(['course_id', 'order']);
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('modules');
};