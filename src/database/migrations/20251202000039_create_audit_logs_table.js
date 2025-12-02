/**
 * Migration: Create audit_logs table
 * EDULIFE Platform - System audit logs
 */
exports.up = async function(knex) {
  await knex.schema.createTable('audit_logs', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).nullable();
    table.string('event_type', 100).notNullable();
    table.string('event_category', 50).nullable();
    table.string('target_type', 50).nullable();
    table.string('target_id', 36).nullable();
    table.json('old_values').nullable();
    table.json('new_values').nullable();
    table.string('ip_address', 45).nullable();
    table.text('user_agent').nullable();
    table.json('metadata').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('SET NULL');

    // Indexes
    table.index('user_id');
    table.index(['event_type', 'event_category']);
    table.index(['target_type', 'target_id']);
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('audit_logs');
};
