/**
 * Migration: Add status and blocking fields to users table
 * Adds: status, blocked_at, blocked_reason, last_login_at
 */
exports.up = function (knex) {
  return knex.schema.table('users', (table) => {
    table
      .enum('status', ['active', 'inactive', 'blocked'])
      .defaultTo('active')
      .notNullable()
      .after('avatar');
    table.timestamp('blocked_at').nullable().after('status');
    table.text('blocked_reason').nullable().after('blocked_at');
    table.timestamp('last_login_at').nullable().after('blocked_reason');

    // Add index on status for faster filtering
    table.index('status');
  });
};

exports.down = function (knex) {
  return knex.schema.table('users', (table) => {
    table.dropColumn('status');
    table.dropColumn('blocked_at');
    table.dropColumn('blocked_reason');
    table.dropColumn('last_login_at');
  });
};
