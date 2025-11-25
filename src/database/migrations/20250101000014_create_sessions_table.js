/**
 * Migration: Create sessions table for express-session
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('sessions');

  if (!exists) {
    return knex.schema.createTable('sessions', (table) => {
      table.string('sid', 255).primary();
      table.json('sess').notNullable();
      table.timestamp('expired').notNullable();

      // Index for cleanup queries
      table.index('expired');
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('sessions');
};
