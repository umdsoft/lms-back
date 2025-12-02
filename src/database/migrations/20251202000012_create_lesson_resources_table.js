/**
 * Migration: Create lesson_resources table
 * EDULIFE Platform - Lesson resources (files, links, code)
 */
exports.up = async function(knex) {
  await knex.schema.createTable('lesson_resources', (table) => {
    table.string('id', 36).primary();
    table.string('lesson_id', 36).notNullable();
    table.string('title', 255).notNullable();
    table.enum('type', ['file', 'link', 'code']).notNullable();
    table.string('file_url', 500).nullable();
    table.string('file_name', 255).nullable();
    table.integer('file_size').unsigned().nullable();
    table.string('file_type', 50).nullable();
    table.string('link_url', 500).nullable();
    table.text('code_content').nullable();
    table.string('code_language', 50).nullable();
    table.integer('order_index').unsigned().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Foreign keys
    table.foreign('lesson_id').references('id').inTable('lessons').onDelete('CASCADE');

    // Indexes
    table.index('lesson_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('lesson_resources');
};
