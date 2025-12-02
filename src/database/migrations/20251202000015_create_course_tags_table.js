/**
 * Migration: Create course_tags table
 * EDULIFE Platform - Course-Tag pivot table
 */
exports.up = async function(knex) {
  await knex.schema.createTable('course_tags', (table) => {
    table.string('id', 36).primary();
    table.string('course_id', 36).notNullable();
    table.string('tag_id', 36).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE');
    table.foreign('tag_id').references('id').inTable('tags').onDelete('CASCADE');

    // Unique constraint
    table.unique(['course_id', 'tag_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('course_tags');
};
