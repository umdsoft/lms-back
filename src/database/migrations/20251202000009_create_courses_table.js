/**
 * Migration: Create courses table
 * EDULIFE Platform - Main courses table
 */
exports.up = async function(knex) {
  await knex.schema.createTable('courses', (table) => {
    table.string('id', 36).primary();
    table.string('direction_id', 36).notNullable();
    table.string('teacher_id', 36).notNullable();
    table.string('title', 255).notNullable();
    table.string('slug', 255).notNullable().unique();
    table.string('short_description', 500).nullable();
    table.text('description').nullable();
    table.string('thumbnail_url', 500).nullable();
    table.string('preview_video_url', 500).nullable();
    table.bigInteger('price').unsigned().defaultTo(0);
    table.bigInteger('original_price').unsigned().nullable();
    table.boolean('is_free').defaultTo(false);
    table.enum('difficulty', ['beginner', 'intermediate', 'advanced']).defaultTo('beginner');
    table.enum('language', ['uz', 'ru', 'en']).defaultTo('uz');
    table.json('requirements').nullable();
    table.json('what_you_learn').nullable();
    table.json('target_audience').nullable();
    table.integer('modules_count').unsigned().defaultTo(0);
    table.integer('lessons_count').unsigned().defaultTo(0);
    table.integer('total_duration').unsigned().defaultTo(0);
    table.integer('students_count').unsigned().defaultTo(0);
    table.integer('reviews_count').unsigned().defaultTo(0);
    table.decimal('rating', 3, 2).defaultTo(0.00);
    table.decimal('completion_rate', 5, 2).defaultTo(0.00);
    table.enum('status', ['draft', 'pending', 'revision', 'approved', 'published', 'unpublished', 'rejected']).defaultTo('draft');
    table.text('rejection_reason').nullable();
    table.timestamp('submitted_at').nullable();
    table.timestamp('reviewed_at').nullable();
    table.string('reviewed_by', 36).nullable();
    table.timestamp('published_at').nullable();
    table.boolean('is_featured').defaultTo(false);
    table.boolean('is_bestseller').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Foreign keys
    table.foreign('direction_id').references('id').inTable('directions');
    table.foreign('teacher_id').references('id').inTable('users');
    table.foreign('reviewed_by').references('id').inTable('users');

    // Indexes
    table.index(['direction_id', 'status']);
    table.index('teacher_id');
    table.index('status');
    table.index(['is_featured', 'is_bestseller']);
    table.index('deleted_at');
  });

  // Add fulltext index for search
  await knex.raw('ALTER TABLE courses ADD FULLTEXT INDEX idx_courses_search (title, short_description)');
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('courses');
};
