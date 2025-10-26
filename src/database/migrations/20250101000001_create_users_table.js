/**
 * Migration: Create users table
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 255).notNullable().unique();
    table.string('password', 255).notNullable();
    table.string('full_name', 255).notNullable();
    table.string('phone', 20);
    table.string('avatar_url', 500);
    table
      .enum('role', ['STUDENT', 'TEACHER', 'ADMIN'])
      .defaultTo('STUDENT')
      .notNullable();
    table
      .enum('status', ['ACTIVE', 'INACTIVE', 'SUSPENDED'])
      .defaultTo('ACTIVE')
      .notNullable();
    table.string('preferred_language', 5).defaultTo('uz');
    table.timestamp('last_login_at').nullable();
    table.timestamps(true, true); // created_at, updated_at
    table.timestamp('deleted_at').nullable(); // Soft delete

    // Indexes
    table.index('email');
    table.index('role');
    table.index('status');
    table.index('deleted_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users');
};
