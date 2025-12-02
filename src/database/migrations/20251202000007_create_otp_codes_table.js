/**
 * Migration: Create otp_codes table
 * EDULIFE Platform - OTP verification codes
 */
exports.up = async function(knex) {
  await knex.schema.createTable('otp_codes', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).nullable();
    table.string('identifier', 255).notNullable();
    table.string('code', 10).notNullable();
    table.enum('type', ['sms', 'email']).notNullable();
    table.enum('purpose', ['registration', 'login', 'password_reset', 'phone_verify', 'email_verify', 'bank_change']).notNullable();
    table.tinyint('attempts_left').unsigned().defaultTo(3);
    table.boolean('is_used').defaultTo(false);
    table.timestamp('used_at').nullable();
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    // Indexes
    table.index(['identifier', 'purpose']);
    table.index('expires_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('otp_codes');
};
