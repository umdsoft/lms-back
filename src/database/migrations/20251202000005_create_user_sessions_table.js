/**
 * Migration: Create user_sessions table
 * EDULIFE Platform - User session management
 */
exports.up = async function(knex) {
  await knex.schema.createTable('user_sessions', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).notNullable();
    table.string('device_id', 255).nullable();
    table.enum('device_type', ['web', 'mobile_android', 'mobile_ios', 'desktop']).defaultTo('web');
    table.string('device_name', 255).nullable();
    table.string('browser', 100).nullable();
    table.string('os', 100).nullable();
    table.string('ip_address', 45).nullable();
    table.string('country', 100).nullable();
    table.string('city', 100).nullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('last_active_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    // Indexes
    table.index(['user_id', 'is_active']);
    table.index('expires_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_sessions');
};
