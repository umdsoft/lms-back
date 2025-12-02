/**
 * Migration: Create questions table
 * EDULIFE Platform - Test questions
 */
exports.up = async function(knex) {
  await knex.schema.createTable('questions', (table) => {
    table.string('id', 36).primary();
    table.string('course_id', 36).notNullable();
    table.string('module_id', 36).nullable();
    table.string('lesson_id', 36).nullable();
    table.enum('test_type', ['lesson', 'module', 'final']).notNullable();
    table.enum('type', ['single_choice', 'multiple_choice', 'true_false', 'fill_blank', 'matching', 'ordering']).notNullable();
    table.enum('difficulty', ['easy', 'medium', 'hard']).defaultTo('medium');
    table.tinyint('points').unsigned().defaultTo(10);
    table.text('question_text').notNullable();
    table.string('question_image', 500).nullable();
    table.json('correct_answers').nullable();
    table.boolean('case_sensitive').defaultTo(false);
    table.text('explanation').nullable();
    table.integer('attempts_count').unsigned().defaultTo(0);
    table.integer('correct_count').unsigned().defaultTo(0);
    table.integer('avg_time_seconds').unsigned().defaultTo(0);
    table.integer('order_index').unsigned().defaultTo(0);
    table.boolean('is_active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Foreign keys
    table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE');
    table.foreign('module_id').references('id').inTable('modules').onDelete('CASCADE');
    table.foreign('lesson_id').references('id').inTable('lessons').onDelete('CASCADE');

    // Indexes
    table.index('lesson_id');
    table.index('module_id');
    table.index(['course_id', 'test_type']);
    table.index('difficulty');
  });

  // Add fulltext index for search
  await knex.raw('ALTER TABLE questions ADD FULLTEXT INDEX idx_questions_search (question_text)');
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('questions');
};
