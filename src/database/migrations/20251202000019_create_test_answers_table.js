/**
 * Migration: Create test_answers table
 * EDULIFE Platform - User answers to test questions
 */
exports.up = async function(knex) {
  await knex.schema.createTable('test_answers', (table) => {
    table.string('id', 36).primary();
    table.string('attempt_id', 36).notNullable();
    table.string('question_id', 36).notNullable();
    table.json('user_answer').notNullable();
    table.boolean('is_correct').nullable();
    table.decimal('partial_credit', 3, 2).defaultTo(0.00);
    table.integer('earned_points').unsigned().defaultTo(0);
    table.integer('time_spent').unsigned().defaultTo(0);
    table.timestamp('answered_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('attempt_id').references('id').inTable('test_attempts').onDelete('CASCADE');
    table.foreign('question_id').references('id').inTable('questions');

    // Unique constraint
    table.unique(['attempt_id', 'question_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('test_answers');
};
