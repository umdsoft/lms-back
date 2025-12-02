/**
 * Migration: Create roles table
 * EDULIFE Platform - Role management
 */
exports.up = async function(knex) {
  await knex.schema.createTable('roles', (table) => {
    table.string('id', 36).primary();
    table.string('name', 50).notNullable();
    table.string('slug', 50).notNullable().unique();
    table.string('description', 255).nullable();
    table.boolean('is_system').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Indexes
    table.index('slug');
    table.index('is_system');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('roles');
};
