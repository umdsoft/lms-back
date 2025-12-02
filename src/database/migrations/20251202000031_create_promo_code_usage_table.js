/**
 * Migration: Create promo_code_usage table
 * EDULIFE Platform - Promo code usage tracking
 */
exports.up = async function(knex) {
  await knex.schema.createTable('promo_code_usage', (table) => {
    table.string('id', 36).primary();
    table.string('promo_code_id', 36).notNullable();
    table.string('user_id', 36).notNullable();
    table.string('payment_id', 36).nullable();
    table.bigInteger('discount_amount').unsigned().notNullable();
    table.timestamp('used_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('promo_code_id').references('id').inTable('promo_codes');
    table.foreign('user_id').references('id').inTable('users');
    table.foreign('payment_id').references('id').inTable('payments');

    // Indexes
    table.index(['promo_code_id', 'user_id']);
    table.index('user_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('promo_code_usage');
};
