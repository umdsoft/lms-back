/**
 * Migration: Create directions table
 * EDULIFE Platform - Course directions/categories
 */
exports.up = async function(knex) {
  await knex.schema.createTable('directions', (table) => {
    table.string('id', 36).primary();
    table.string('name', 100).notNullable();
    table.string('slug', 100).notNullable().unique();
    table.text('description').nullable();
    table.string('icon', 100).nullable();
    table.string('color', 20).nullable();
    table.string('image_url', 500).nullable();
    table.integer('courses_count').unsigned().defaultTo(0);
    table.integer('students_count').unsigned().defaultTo(0);
    table.integer('order_index').unsigned().defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.boolean('is_featured').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Indexes
    table.index('slug');
    table.index(['is_active', 'order_index']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('directions');
};
