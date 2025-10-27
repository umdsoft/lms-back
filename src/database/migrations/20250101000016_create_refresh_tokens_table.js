/**
 * Migration: Create refresh_tokens table
 * This migration matches the Sequelize RefreshToken model schema
 */
exports.up = function (knex) {
  return knex.schema.createTable('refresh_tokens', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('token', 500).notNullable().unique();
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('user_id');
    table.index('token');
    table.index('expires_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('refresh_tokens');
};
