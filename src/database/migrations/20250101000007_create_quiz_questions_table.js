/**
 * Migration: Create quiz_questions table
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('quiz_questions');

  if (!exists) {
    return knex.schema.createTable('quiz_questions', (table) => {
      table.increments('id').primary();
      table
        .integer('quiz_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('quizzes')
        .onDelete('CASCADE');
      table.text('question_text').notNullable();
      table
        .enum('question_type', ['MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'])
        .notNullable();
      table.json('options'); // For multiple choice questions
      table.text('correct_answer').notNullable();
      table.text('explanation').nullable();
      table.integer('points').unsigned().defaultTo(1);
      table.integer('order').unsigned().notNullable();
      table.timestamps(true, true);

      // Indexes
      table.index('quiz_id');
      table.index(['quiz_id', 'order']);
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('quiz_questions');
};
