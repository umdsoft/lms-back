/**
 * Migration: Create modules table
 * EDULIFE Platform - Course modules
 */
exports.up = async function(knex) {
  await knex.schema.createTable('modules', (table) => {
    table.string('id', 36).primary();
    table.string('course_id', 36).notNullable();
    table.string('title', 255).notNullable();
    table.text('description').nullable();
    table.integer('lessons_count').unsigned().defaultTo(0);
    table.integer('total_duration').unsigned().defaultTo(0);
    table.integer('order_index').unsigned().defaultTo(0);
    table.boolean('is_published').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Foreign keys
    table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE');

    // Indexes
    table.index(['course_id', 'order_index']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('modules');
};
