/**
 * Migration: Create promo_codes table
 * EDULIFE Platform - Promotional codes
 */
exports.up = async function(knex) {
  await knex.schema.createTable('promo_codes', (table) => {
    table.string('id', 36).primary();
    table.string('code', 50).notNullable().unique();
    table.enum('type', ['percentage', 'fixed_amount', 'free_course', 'trial_extension']).notNullable();
    table.bigInteger('value').unsigned().notNullable();
    table.bigInteger('max_discount').unsigned().nullable();
    table.bigInteger('min_purchase').unsigned().defaultTo(0);
    table.integer('usage_limit').unsigned().nullable();
    table.tinyint('usage_per_user').unsigned().defaultTo(1);
    table.integer('used_count').unsigned().defaultTo(0);
    table.enum('applicable_to', ['all', 'courses', 'subscriptions', 'specific']).defaultTo('all');
    table.json('applicable_ids').nullable();
    table.timestamp('valid_from').notNullable();
    table.timestamp('valid_until').notNullable();
    table.boolean('is_active').defaultTo(true);
    table.string('created_by', 36).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Foreign keys
    table.foreign('created_by').references('id').inTable('users');

    // Indexes
    table.index('code');
    table.index(['valid_from', 'valid_until', 'is_active']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('promo_codes');
};
