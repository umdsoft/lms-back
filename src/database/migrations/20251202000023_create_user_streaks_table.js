/**
 * Migration: Create user_streaks table
 * EDULIFE Platform - User learning streaks
 */
exports.up = async function(knex) {
  await knex.schema.createTable('user_streaks', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).notNullable().unique();
    table.integer('current_streak').unsigned().defaultTo(0);
    table.integer('longest_streak').unsigned().defaultTo(0);
    table.date('last_activity_date').nullable();
    table.tinyint('freeze_available').unsigned().defaultTo(2);
    table.tinyint('freeze_used_this_month').unsigned().defaultTo(0);
    table.integer('total_active_days').unsigned().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('user_streaks');
};
