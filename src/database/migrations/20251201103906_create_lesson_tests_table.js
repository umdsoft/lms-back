/**
 * Migration: Create lesson_tests table
 * Stores individual test questions for lessons
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('lesson_tests');

  if (!exists) {
    await knex.schema.createTable('lesson_tests', (table) => {
      table.increments('id').primary();
      table
        .integer('lesson_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('lessons')
        .onDelete('CASCADE');

      // Question content
      table.string('question', 1000).notNullable();
      // Answer options as JSON array ["A", "B", "C", "D"]
      table.json('options').notNullable();
      // Correct answer index (0-3)
      table.integer('correct_option').notNullable();
      // Explanation for the answer (optional)
      table.text('explanation').nullable();
      // Difficulty level
      table.enum('difficulty', ['easy', 'medium', 'hard']).defaultTo('medium');
      // Points for correct answer
      table.integer('points').defaultTo(10);
      // Time limit in seconds (optional)
      table.integer('time_limit').nullable();
      // Display order
      table.integer('display_order').defaultTo(0);
      // Active status
      table.boolean('is_active').defaultTo(true);

      table.timestamps(true, true);

      // Indexes
      table.index('lesson_id');
      table.index('difficulty');
      table.index('is_active');
    });
  }
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('lesson_tests');
};
