/**
 * Migration: Create lessons table
 * EDULIFE Platform - Course lessons
 */
exports.up = async function(knex) {
  await knex.schema.createTable('lessons', (table) => {
    table.string('id', 36).primary();
    table.string('module_id', 36).notNullable();
    table.string('course_id', 36).notNullable();
    table.string('title', 255).notNullable();
    table.text('description').nullable();
    table.enum('content_type', ['video', 'text', 'quiz', 'assignment']).defaultTo('video');
    table.string('video_id', 36).nullable();
    table.string('video_url', 500).nullable();
    table.integer('video_duration').unsigned().defaultTo(0);
    table.enum('video_status', ['pending', 'uploading', 'processing', 'ready', 'failed']).defaultTo('pending');
    table.json('video_qualities').nullable();
    table.string('video_thumbnail_url', 500).nullable();
    table.text('text_content').nullable();
    table.boolean('is_free_preview').defaultTo(false);
    table.boolean('is_published').defaultTo(true);
    table.integer('views_count').unsigned().defaultTo(0);
    table.integer('order_index').unsigned().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Foreign keys
    table.foreign('module_id').references('id').inTable('modules').onDelete('CASCADE');
    table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE');

    // Indexes
    table.index(['module_id', 'order_index']);
    table.index('course_id');
    table.index('video_status');
    table.index('is_free_preview');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('lessons');
};
