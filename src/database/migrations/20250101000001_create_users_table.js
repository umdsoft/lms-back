/**
 * Migration: Create users table
 * This migration matches the Sequelize User model schema
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).nullable().unique();
    table.string('phone', 20).nullable().unique();
    table.string('password', 255).notNullable();
    table.string('first_name', 50).notNullable();
    table.string('last_name', 50).notNullable();
    table
      .enum('role', ['student', 'teacher', 'admin'])
      .defaultTo('student')
      .notNullable();
    table.string('avatar', 255).nullable();
    table.boolean('is_active').defaultTo(true).notNullable();
    table.boolean('is_email_verified').defaultTo(false).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('email');
    table.index('phone');
    table.index('role');
    table.index('is_active');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
