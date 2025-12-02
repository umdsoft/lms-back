/**
 * Migration: Create teacher_payouts table
 * EDULIFE Platform - Teacher payout records
 */
exports.up = async function(knex) {
  await knex.schema.createTable('teacher_payouts', (table) => {
    table.string('id', 36).primary();
    table.string('teacher_id', 36).notNullable();
    table.string('bank_account_id', 36).notNullable();
    table.date('period_start').notNullable();
    table.date('period_end').notNullable();
    table.bigInteger('gross_amount').unsigned().notNullable();
    table.bigInteger('deductions').unsigned().defaultTo(0);
    table.bigInteger('net_amount').unsigned().notNullable();
    table.enum('status', ['pending', 'processing', 'completed', 'failed', 'cancelled']).defaultTo('pending');
    table.string('transaction_id', 100).nullable();
    table.timestamp('transaction_date').nullable();
    table.text('notes').nullable();
    table.text('failure_reason').nullable();
    table.string('processed_by', 36).nullable();
    table.timestamp('processed_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('teacher_id').references('id').inTable('teacher_profiles');
    table.foreign('bank_account_id').references('id').inTable('teacher_bank_accounts');
    table.foreign('processed_by').references('id').inTable('users');

    // Indexes
    table.index('teacher_id');
    table.index('status');
    table.index(['period_start', 'period_end']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('teacher_payouts');
};
