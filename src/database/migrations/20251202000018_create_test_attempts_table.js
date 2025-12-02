/**
 * Migration: Create test_attempts table
 * EDULIFE Platform - User test attempts
 */
exports.up = async function(knex) {
  await knex.schema.createTable('test_attempts', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).notNullable();
    table.string('course_id', 36).notNullable();
    table.enum('test_type', ['lesson', 'module', 'final']).notNullable();
    table.string('target_id', 36).notNullable();
    table.json('questions').notNullable();
    table.tinyint('question_count').unsigned().notNullable();
    table.integer('total_points').unsigned().notNullable();
    table.integer('earned_points').unsigned().defaultTo(0);
    table.decimal('score', 5, 2).defaultTo(0.00);
    table.decimal('passing_score', 5, 2).notNullable();
    table.boolean('passed').defaultTo(false);
    table.tinyint('correct_count').unsigned().defaultTo(0);
    table.tinyint('wrong_count').unsigned().defaultTo(0);
    table.tinyint('skipped_count').unsigned().defaultTo(0);
    table.integer('time_limit').unsigned().notNullable();
    table.integer('time_taken').unsigned().nullable();
    table.tinyint('violations_count').unsigned().defaultTo(0);
    table.json('violation_log').nullable();
    table.enum('status', ['in_progress', 'completed', 'expired', 'cancelled']).defaultTo('in_progress');
    table.timestamp('started_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at').notNullable();
    table.timestamp('completed_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE');

    // Indexes
    table.index('user_id');
    table.index(['user_id', 'test_type', 'target_id']);
    table.index('status');
    table.index('expires_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('test_attempts');
};
