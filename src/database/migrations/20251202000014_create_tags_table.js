/**
 * Migration: Create tags table
 * EDULIFE Platform - Course tags
 */
exports.up = async function(knex) {
  await knex.schema.createTable('tags', (table) => {
    table.string('id', 36).primary();
    table.string('name', 50).notNullable();
    table.string('slug', 50).notNullable().unique();
    table.integer('courses_count').unsigned().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('slug');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('tags');
};
