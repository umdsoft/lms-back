/**
 * Migration: Create notifications table
 * EDULIFE Platform - User notifications
 */
exports.up = async function(knex) {
  await knex.schema.createTable('notifications', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).notNullable();
    table.string('type', 50).notNullable();
    table.string('title', 255).notNullable();
    table.text('body').nullable();
    table.string('action_url', 500).nullable();
    table.string('action_type', 50).nullable();
    table.string('reference_type', 50).nullable();
    table.string('reference_id', 36).nullable();
    table.json('data').nullable();
    table.boolean('is_read').defaultTo(false);
    table.timestamp('read_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    // Indexes
    table.index(['user_id', 'is_read', 'created_at']);
    table.index('type');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('notifications');
};
