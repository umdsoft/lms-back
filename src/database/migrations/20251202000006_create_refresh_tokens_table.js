/**
 * Migration: Create refresh_tokens table
 * EDULIFE Platform - JWT refresh token management
 */
exports.up = async function(knex) {
  await knex.schema.createTable('refresh_tokens', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).notNullable();
    table.string('session_id', 36).nullable();
    table.string('token_hash', 255).notNullable();
    table.boolean('is_active').defaultTo(true);
    table.timestamp('expires_at').notNullable();
    table.timestamp('revoked_at').nullable();
    table.string('revoked_reason', 100).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('session_id').references('id').inTable('user_sessions').onDelete('SET NULL');

    // Indexes
    table.index(['user_id', 'is_active']);
    table.index('expires_at');
    table.index('token_hash');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('refresh_tokens');
};
