/**
 * Migration: Create role_permissions table
 * EDULIFE Platform - Role-Permission pivot table
 */
exports.up = async function(knex) {
  await knex.schema.createTable('role_permissions', (table) => {
    table.string('id', 36).primary();
    table.string('role_id', 36).notNullable();
    table.string('permission_id', 36).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('role_id').references('id').inTable('roles').onDelete('CASCADE');
    table.foreign('permission_id').references('id').inTable('permissions').onDelete('CASCADE');

    // Unique constraint
    table.unique(['role_id', 'permission_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('role_permissions');
};
