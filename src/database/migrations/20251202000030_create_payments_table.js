/**
 * Migration: Create payments table
 * EDULIFE Platform - Payment transactions
 */
exports.up = async function(knex) {
  await knex.schema.createTable('payments', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).notNullable();
    table.enum('type', ['course_purchase', 'subscription', 'renewal']).notNullable();
    table.string('course_id', 36).nullable();
    table.string('subscription_id', 36).nullable();
    table.bigInteger('amount').unsigned().notNullable();
    table.string('currency', 3).defaultTo('UZS');
    table.bigInteger('original_amount').unsigned().nullable();
    table.bigInteger('discount_amount').unsigned().defaultTo(0);
    table.string('promo_code_id', 36).nullable();
    table.enum('provider', ['payme', 'click', 'uzcard', 'manual']).notNullable();
    table.string('provider_transaction_id', 100).nullable();
    table.json('provider_response').nullable();
    table.enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled']).defaultTo('pending');
    table.bigInteger('refund_amount').unsigned().defaultTo(0);
    table.timestamp('refunded_at').nullable();
    table.text('refund_reason').nullable();
    table.timestamp('paid_at').nullable();
    table.timestamp('expires_at').nullable();
    table.string('ip_address', 45).nullable();
    table.text('user_agent').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users');
    table.foreign('course_id').references('id').inTable('courses');
    table.foreign('subscription_id').references('id').inTable('subscriptions');

    // Indexes
    table.index('user_id');
    table.index('status');
    table.index(['provider', 'provider_transaction_id']);
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('payments');
};
