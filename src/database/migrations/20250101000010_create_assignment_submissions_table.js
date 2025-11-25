/**
 * Migration: Create assignment_submissions table
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('assignment_submissions');
  if (exists) return;

  return knex.schema.createTable('assignment_submissions', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('assignment_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('assignments')
      .onDelete('CASCADE');
    table.text('submission_text').nullable();
    table.json('file_urls'); // Array of uploaded files
    table
      .enum('status', ['SUBMITTED', 'GRADED', 'RETURNED'])
      .defaultTo('SUBMITTED')
      .notNullable();
    table.integer('score').unsigned().nullable();
    table.text('teacher_feedback').nullable();
    table.timestamp('submitted_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('graded_at').nullable();
    table.timestamps(true, true);

    // Composite unique index
    table.unique(['user_id', 'assignment_id']);

    // Indexes
    table.index('user_id');
    table.index('assignment_id');
    table.index('status');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('assignment_submissions');
};
