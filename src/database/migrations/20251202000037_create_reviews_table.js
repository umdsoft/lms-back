/**
 * Migration: Create reviews table
 * EDULIFE Platform - Course reviews
 */
exports.up = async function(knex) {
  await knex.schema.createTable('reviews', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).notNullable();
    table.string('course_id', 36).notNullable();
    table.string('enrollment_id', 36).notNullable();
    table.tinyint('rating').unsigned().notNullable();
    table.string('title', 255).nullable();
    table.text('content').nullable();
    table.json('pros').nullable();
    table.json('cons').nullable();
    table.text('teacher_response').nullable();
    table.timestamp('teacher_responded_at').nullable();
    table.integer('helpful_count').unsigned().defaultTo(0);
    table.integer('not_helpful_count').unsigned().defaultTo(0);
    table.enum('status', ['pending', 'approved', 'rejected', 'hidden']).defaultTo('pending');
    table.text('rejection_reason').nullable();
    table.boolean('is_verified_purchase').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users');
    table.foreign('course_id').references('id').inTable('courses');
    table.foreign('enrollment_id').references('id').inTable('enrollments');

    // Unique constraint
    table.unique(['user_id', 'course_id']);

    // Indexes
    table.index(['course_id', 'status']);
    table.index('rating');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('reviews');
};
