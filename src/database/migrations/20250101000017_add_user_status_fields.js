/**
 * Migration: Add status and blocking fields to users table
 * Adds: status, blocked_at, blocked_reason, last_login_at
 */
exports.up = async function (knex) {
  const hasStatusColumn = await knex.schema.hasColumn('users', 'status');

  if (!hasStatusColumn) {
    await knex.schema.table('users', (table) => {
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
  }
};

exports.down = async function (knex) {
  const hasUsersTable = await knex.schema.hasTable('users');
  if (!hasUsersTable) return;

  const hasStatus = await knex.schema.hasColumn('users', 'status');
  const hasBlockedAt = await knex.schema.hasColumn('users', 'blocked_at');
  const hasBlockedReason = await knex.schema.hasColumn('users', 'blocked_reason');
  const hasLastLoginAt = await knex.schema.hasColumn('users', 'last_login_at');

  await knex.schema.table('users', (table) => {
    if (hasLastLoginAt) table.dropColumn('last_login_at');
    if (hasBlockedReason) table.dropColumn('blocked_reason');
    if (hasBlockedAt) table.dropColumn('blocked_at');
    if (hasStatus) table.dropColumn('status');
  });
};
