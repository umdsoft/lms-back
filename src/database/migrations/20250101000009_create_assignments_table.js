/**
 * Migration: Create assignments table
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('assignments');

  if (!exists) {
    return knex.schema.createTable('assignments', (table) => {
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
      table.text('description').notNullable();
      table.text('instructions');
      table.integer('max_score').unsigned().notNullable();
      table.timestamp('due_date').nullable();
      table.boolean('allow_late_submission').defaultTo(false);
      table
        .enum('status', ['DRAFT', 'PUBLISHED', 'CLOSED'])
        .defaultTo('DRAFT')
        .notNullable();
      table.timestamps(true, true);
      table.timestamp('deleted_at').nullable();

      // Indexes
      table.index('course_id');
      table.index('lesson_id');
      table.index('status');
      table.index('due_date');
      table.index('deleted_at');
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('assignments');
};
