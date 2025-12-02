/**
 * Migration: Create video_processing_jobs table
 * EDULIFE Platform - Video processing queue
 */
exports.up = async function(knex) {
  await knex.schema.createTable('video_processing_jobs', (table) => {
    table.string('id', 36).primary();
    table.string('lesson_id', 36).notNullable();
    table.string('source_key', 500).notNullable();
    table.bigInteger('source_size').unsigned().nullable();
    table.integer('source_duration').unsigned().nullable();
    table.string('output_key', 500).nullable();
    table.json('output_qualities').nullable();
    table.enum('status', ['pending', 'downloading', 'transcoding', 'uploading', 'completed', 'failed']).defaultTo('pending');
    table.tinyint('progress').unsigned().defaultTo(0);
    table.string('current_step', 100).nullable();
    table.text('error_message').nullable();
    table.tinyint('attempts').unsigned().defaultTo(0);
    table.tinyint('max_attempts').unsigned().defaultTo(3);
    table.timestamp('started_at').nullable();
    table.timestamp('completed_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('lesson_id').references('id').inTable('lessons').onDelete('CASCADE');

    // Indexes
    table.index('status');
    table.index('lesson_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('video_processing_jobs');
};
