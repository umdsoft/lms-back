/**
 * Migration: Create notifications table
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('notifications');

  if (!exists) {
    return knex.schema.createTable('notifications', (table) => {
      table.increments('id').primary();
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE');
      table.string('title', 255).notNullable();
      table.text('message').notNullable();
      table
        .enum('type', ['INFO', 'SUCCESS', 'WARNING', 'ERROR'])
        .defaultTo('INFO')
        .notNullable();
      table
        .enum('category', ['COURSE', 'ASSIGNMENT', 'QUIZ', 'OLYMPIAD', 'SYSTEM'])
        .notNullable();
      table.boolean('is_read').defaultTo(false);
      table.json('metadata'); // Additional data
      table.timestamps(true, true);

      // Indexes
      table.index('user_id');
      table.index(['user_id', 'is_read']);
      table.index('created_at');
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('notifications');
};
