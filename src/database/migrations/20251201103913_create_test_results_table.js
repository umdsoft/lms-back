/**
 * Migration: Create test_results table
 * Stores user answers and results for lesson tests
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('test_results');

  if (!exists) {
    await knex.schema.createTable('test_results', (table) => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .integer('lesson_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('lessons')
        .onDelete('CASCADE');
      table
        .integer('test_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('lesson_tests')
        .onDelete('CASCADE');

      // Selected answer option
      table.integer('selected_option').notNullable();
      // Whether answer is correct
      table.boolean('is_correct').notNullable();
      // Points earned for this answer
      table.integer('points_earned').defaultTo(0);
      // Time spent in seconds
      table.integer('time_spent').nullable();

      // When the answer was submitted
      table.timestamp('answered_at').defaultTo(knex.fn.now());

      // Indexes
      table.index(['user_id', 'lesson_id']);
      table.index('test_id');
    });
  }
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('test_results');
};
