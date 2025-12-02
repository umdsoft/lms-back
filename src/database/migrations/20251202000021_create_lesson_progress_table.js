/**
 * Migration: Create lesson_progress table
 * EDULIFE Platform - User lesson progress tracking
 */
exports.up = async function(knex) {
  await knex.schema.createTable('lesson_progress', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).notNullable();
    table.string('lesson_id', 36).notNullable();
    table.string('enrollment_id', 36).notNullable();
    table.integer('video_watched_seconds').unsigned().defaultTo(0);
    table.integer('video_last_position').unsigned().defaultTo(0);
    table.boolean('video_completed').defaultTo(false);
    table.timestamp('video_completed_at').nullable();
    table.boolean('test_passed').defaultTo(false);
    table.decimal('test_best_score', 5, 2).defaultTo(0.00);
    table.tinyint('test_attempts_count').unsigned().defaultTo(0);
    table.timestamp('test_passed_at').nullable();
    table.decimal('progress', 5, 2).defaultTo(0.00);
    table.boolean('is_completed').defaultTo(false);
    table.timestamp('completed_at').nullable();
    table.integer('total_time_spent').unsigned().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('lesson_id').references('id').inTable('lessons').onDelete('CASCADE');
    table.foreign('enrollment_id').references('id').inTable('enrollments').onDelete('CASCADE');

    // Unique constraint
    table.unique(['user_id', 'lesson_id']);

    // Indexes
    table.index('enrollment_id');
    table.index('is_completed');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('lesson_progress');
};
