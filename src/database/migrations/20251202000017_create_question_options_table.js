/**
 * Migration: Create question_options table
 * EDULIFE Platform - Question answer options
 */
exports.up = async function(knex) {
  await knex.schema.createTable('question_options', (table) => {
    table.string('id', 36).primary();
    table.string('question_id', 36).notNullable();
    table.text('option_text').notNullable();
    table.string('option_image', 500).nullable();
    table.boolean('is_correct').defaultTo(false);
    table.integer('order_index').unsigned().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('question_id').references('id').inTable('questions').onDelete('CASCADE');

    // Indexes
    table.index('question_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('question_options');
};
