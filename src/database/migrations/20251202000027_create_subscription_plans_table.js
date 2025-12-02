/**
 * Migration: Create subscription_plans table
 * EDULIFE Platform - Subscription plan definitions
 */
exports.up = async function(knex) {
  await knex.schema.createTable('subscription_plans', (table) => {
    table.string('id', 36).primary();
    table.string('name', 100).notNullable();
    table.string('slug', 50).notNullable().unique();
    table.text('description').nullable();
    table.bigInteger('price').unsigned().notNullable();
    table.string('currency', 3).defaultTo('UZS');
    table.integer('duration_days').unsigned().notNullable();
    table.enum('duration_type', ['monthly', 'quarterly', 'yearly']).notNullable();
    table.json('features').nullable();
    table.integer('max_courses').unsigned().nullable();
    table.integer('max_downloads').unsigned().nullable();
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_featured').defaultTo(false);
    table.integer('trial_days').unsigned().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Indexes
    table.index('slug');
    table.index('is_active');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('subscription_plans');
};
