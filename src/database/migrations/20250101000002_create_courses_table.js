/**
 * Migration: Create courses table
 */
exports.up = function (knex) {
  return knex.schema.createTable('courses', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('description').notNullable();
    table
      .enum('subject', ['MATHEMATICS', 'ENGLISH'])
      .notNullable();
    table
      .enum('level', ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
      .notNullable();
    table.string('cover_image_url', 500);
    table.integer('duration_weeks').unsigned();
    table.decimal('price', 10, 2).defaultTo(0);
    table
      .enum('status', ['DRAFT', 'PUBLISHED', 'ARCHIVED'])
      .defaultTo('DRAFT')
      .notNullable();
    table
      .integer('teacher_id')
      .unsigned()
      .references('id')
      .inTable('users')
      .onDelete('SET NULL');
    table.integer('order').unsigned().defaultTo(0);
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();

    // Indexes
    table.index('subject');
    table.index('level');
    table.index('status');
    table.index('teacher_id');
    table.index('deleted_at');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('courses');
};
