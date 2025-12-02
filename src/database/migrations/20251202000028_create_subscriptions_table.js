/**
 * Migration: Create subscriptions table
 * EDULIFE Platform - User subscriptions
 */
exports.up = async function(knex) {
  await knex.schema.createTable('subscriptions', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).notNullable();
    table.string('plan_id', 36).notNullable();
    table.enum('status', ['trial', 'active', 'past_due', 'cancelled', 'expired']).defaultTo('active');
    table.timestamp('trial_ends_at').nullable();
    table.timestamp('starts_at').notNullable();
    table.timestamp('ends_at').notNullable();
    table.timestamp('cancelled_at').nullable();
    table.boolean('auto_renew').defaultTo(true);
    table.string('last_payment_id', 36).nullable();
    table.date('next_payment_date').nullable();
    table.timestamp('grace_period_ends_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('plan_id').references('id').inTable('subscription_plans');

    // Indexes
    table.index('user_id');
    table.index('status');
    table.index('ends_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('subscriptions');
};
