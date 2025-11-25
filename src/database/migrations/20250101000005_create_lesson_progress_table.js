/**
 * Migration: Create lesson_progress table
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('lesson_progress');

  if (!exists) {
    return knex.schema.createTable('lesson_progress', (table) => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table
        .integer('lesson_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('lessons')
        .onDelete('CASCADE');
      table.boolean('is_completed').defaultTo(false);
      table.integer('watch_time_seconds').unsigned().defaultTo(0);
      table.timestamp('completed_at').nullable();
      table.timestamps(true, true);

      // Composite unique index
      table.unique(['user_id', 'lesson_id']);

      // Indexes
      table.index('user_id');
      table.index('lesson_id');
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('lesson_progress');
};
