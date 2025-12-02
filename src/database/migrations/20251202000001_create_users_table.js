/**
 * Migration: Create users table
 * EDULIFE Platform - Core user table with UUID
 */
exports.up = async function(knex) {
  await knex.schema.createTable('users', (table) => {
    table.string('id', 36).primary();
    table.string('email', 255).nullable().unique();
    table.string('phone', 20).nullable().unique();
    table.string('password_hash', 255).notNullable();
    table.string('first_name', 100).notNullable();
    table.string('last_name', 100).notNullable();
    table.string('avatar_url', 500).nullable();
    table.date('date_of_birth').nullable();
    table.enum('gender', ['male', 'female', 'other']).nullable();
    table.string('region', 100).nullable();
    table.string('district', 100).nullable();
    table.enum('role', ['student', 'teacher', 'admin', 'super_admin']).defaultTo('student');
    table.enum('status', ['pending', 'active', 'blocked', 'deleted']).defaultTo('pending');
    table.timestamp('email_verified_at').nullable();
    table.timestamp('phone_verified_at').nullable();
    table.timestamp('last_login_at').nullable();
    table.string('last_login_ip', 45).nullable();
    table.integer('login_count').unsigned().defaultTo(0);
    table.tinyint('failed_login_attempts').unsigned().defaultTo(0);
    table.timestamp('locked_until').nullable();
    table.enum('language', ['uz', 'ru', 'en']).defaultTo('uz');
    table.string('timezone', 50).defaultTo('Asia/Tashkent');
    table.json('notification_settings').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Indexes
    table.index('email');
    table.index('phone');
    table.index(['role', 'status']);
    table.index(['status', 'created_at']);
    table.index('deleted_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
