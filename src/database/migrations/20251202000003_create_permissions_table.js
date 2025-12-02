/**
 * Migration: Create permissions table
 * EDULIFE Platform - Permission management
 */
exports.up = async function(knex) {
  await knex.schema.createTable('permissions', (table) => {
    table.string('id', 36).primary();
    table.string('name', 100).notNullable();
    table.string('slug', 100).notNullable().unique();
    table.string('group_name', 50).nullable();
    table.string('description', 255).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('slug');
    table.index('group_name');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('permissions');
};
