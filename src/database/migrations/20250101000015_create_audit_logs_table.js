/**
 * Migration: Create audit_logs table
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('audit_logs', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.string('action', 100).notNullable();
    table.string('entity_type', 50);
    table.integer('entity_id').unsigned().nullable();
    table.json('old_values').nullable();
    table.json('new_values').nullable();
    table.string('ip_address', 45);
    table.string('user_agent', 500);
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    // Indexes
    table.index('user_id');
    table.index('action');
    table.index('entity_type');
    table.index('created_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('audit_logs');
};
