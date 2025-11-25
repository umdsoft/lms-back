/**
 * Migration: Create quiz_attempts table
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('quiz_attempts');

  if (!exists) {
    return knex.schema.createTable('quiz_attempts', (table) => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .integer('quiz_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('quizzes')
        .onDelete('CASCADE');
      table.integer('attempt_number').unsigned().notNullable();
      table.decimal('score', 5, 2).nullable();
      table.integer('points_earned').unsigned().defaultTo(0);
      table.integer('total_points').unsigned().notNullable();
      table.boolean('is_passed').defaultTo(false);
      table.timestamp('started_at').notNullable().defaultTo(knex.fn.now());
      table.timestamp('submitted_at').nullable();
      table.json('answers'); // User's answers
      table.timestamps(true, true);

      // Indexes
      table.index('user_id');
      table.index('quiz_id');
      table.index(['user_id', 'quiz_id']);
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('quiz_attempts');
};
