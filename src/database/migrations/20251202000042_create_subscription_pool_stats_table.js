/**
 * Migration: Create subscription_pool_stats table
 * EDULIFE Platform - Subscription revenue pool statistics
 */
exports.up = async function(knex) {
  await knex.schema.createTable('subscription_pool_stats', (table) => {
    table.string('id', 36).primary();
    table.string('period', 7).notNullable().unique();
    table.bigInteger('total_pool_amount').unsigned().notNullable();
    table.bigInteger('total_watch_minutes').unsigned().defaultTo(0);
    table.bigInteger('distributed_amount').unsigned().defaultTo(0);
    table.integer('teachers_count').unsigned().defaultTo(0);
    table.enum('status', ['collecting', 'calculating', 'distributed']).defaultTo('collecting');
    table.timestamp('calculated_at').nullable();
    table.timestamp('distributed_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('period');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('subscription_pool_stats');
};
