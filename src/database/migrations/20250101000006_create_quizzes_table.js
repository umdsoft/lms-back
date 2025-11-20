/**
 * Migration: Create quizzes table
 */
exports.up = function (knex) {
  return knex.schema.createTable('quizzes', (table) => {
    table.increments('id').primary();
    table
      .integer('course_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('courses')
      .onDelete('CASCADE');
    table
      .integer('lesson_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('lessons')
      .onDelete('SET NULL');
    table.string('title', 255).notNullable();
    table.text('description');
    table.integer('duration_minutes').unsigned();
    table.integer('passing_score').unsigned().notNullable();
    table.integer('max_attempts').unsigned().defaultTo(3);
    table
      .enum('status', ['DRAFT', 'PUBLISHED'])
      .defaultTo('DRAFT')
      .notNullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();

    // Indexes
    table.index('course_id');
    table.index('lesson_id');
    table.index('status');
    table.index('deleted_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('quizzes');
};
