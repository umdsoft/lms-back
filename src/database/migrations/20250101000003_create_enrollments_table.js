/**
 * Migration: Create enrollments table
 */
exports.up = function (knex) {
  return knex.schema.createTable('enrollments', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('course_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('courses')
      .onDelete('CASCADE');
    table
      .enum('status', ['ENROLLED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED'])
      .defaultTo('ENROLLED')
      .notNullable();
    table.integer('progress_percentage').unsigned().defaultTo(0);
    table.decimal('grade', 5, 2).nullable();
    table.timestamp('enrolled_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('completed_at').nullable();
    table.timestamps(true, true);

    // Composite unique index
    table.unique(['user_id', 'course_id']);

    // Indexes
    table.index('user_id');
    table.index('course_id');
    table.index('status');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('enrollments');
};
