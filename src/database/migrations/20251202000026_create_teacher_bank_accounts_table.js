/**
 * Migration: Create teacher_bank_accounts table
 * EDULIFE Platform - Teacher bank account information
 */
exports.up = async function(knex) {
  await knex.schema.createTable('teacher_bank_accounts', (table) => {
    table.string('id', 36).primary();
    table.string('teacher_id', 36).notNullable();
    table.string('bank_name', 100).notNullable();
    table.string('account_number_encrypted', 500).notNullable();
    table.string('account_number_last4', 4).nullable();
    table.string('card_holder_name', 200).notNullable();
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('verified_at').nullable();
    table.boolean('is_primary').defaultTo(false);
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Foreign keys
    table.foreign('teacher_id').references('id').inTable('teacher_profiles').onDelete('CASCADE');

    // Indexes
    table.index('teacher_id');
    table.index(['teacher_id', 'is_primary']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('teacher_bank_accounts');
};
