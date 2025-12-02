/**
 * Migration: Create video_watch_logs table
 * EDULIFE Platform - Video watching analytics
 */
exports.up = async function(knex) {
  await knex.schema.createTable('video_watch_logs', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).notNullable();
    table.string('lesson_id', 36).notNullable();
    table.string('session_id', 100).nullable();
    table.integer('start_position').unsigned().defaultTo(0);
    table.integer('end_position').unsigned().defaultTo(0);
    table.integer('watch_duration').unsigned().defaultTo(0);
    table.string('quality', 10).nullable();
    table.decimal('playback_rate', 2, 1).defaultTo(1.0);
    table.string('device_type', 20).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('lesson_id').references('id').inTable('lessons').onDelete('CASCADE');

    // Indexes
    table.index(['user_id', 'lesson_id']);
    table.index('lesson_id');
    table.index('created_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('video_watch_logs');
};
