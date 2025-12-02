/**
 * Migration: Create token_blacklist table
 * EDULIFE Platform - Revoked JWT tokens
 */
exports.up = async function(knex) {
  await knex.schema.createTable('token_blacklist', (table) => {
    table.string('id', 36).primary();
    table.string('token_hash', 255).notNullable();
    table.string('reason', 100).nullable();
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('token_hash');
    table.index('expires_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('token_blacklist');
};
