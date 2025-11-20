/**
 * Migration: Create lessons table
 */
exports.up = function (knex) {
  return knex.schema.createTable('lessons', (table) => {
    table.increments('id').primary();
    table
      .integer('course_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('courses')
      .onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.text('description');
    table
      .enum('type', ['VIDEO', 'TEXT', 'INTERACTIVE', 'QUIZ'])
      .notNullable();
    table.text('content'); // For text lessons
    table.string('video_url', 500); // For video lessons
    table.integer('duration_minutes').unsigned();
    table.integer('order').unsigned().notNullable();
    table.boolean('is_free').defaultTo(false);
    table
      .enum('status', ['DRAFT', 'PUBLISHED'])
      .defaultTo('DRAFT')
      .notNullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();

    // Indexes
    table.index('course_id');
    table.index(['course_id', 'order']);
    table.index('status');
    table.index('deleted_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('lessons');
};
