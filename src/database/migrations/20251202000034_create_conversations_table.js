/**
 * Migration: Create conversations table
 * EDULIFE Platform - User messaging conversations
 */
exports.up = async function(knex) {
  await knex.schema.createTable('conversations', (table) => {
    table.string('id', 36).primary();
    table.string('participant1_id', 36).notNullable();
    table.string('participant2_id', 36).notNullable();
    table.string('course_id', 36).nullable();
    table.string('last_message_id', 36).nullable();
    table.timestamp('last_message_at').nullable();
    table.integer('participant1_unread').unsigned().defaultTo(0);
    table.integer('participant2_unread').unsigned().defaultTo(0);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('participant1_id').references('id').inTable('users');
    table.foreign('participant2_id').references('id').inTable('users');
    table.foreign('course_id').references('id').inTable('courses');

    // Unique constraint
    table.unique(['participant1_id', 'participant2_id']);

    // Indexes
    table.index(['participant1_id', 'last_message_at']);
    table.index(['participant2_id', 'last_message_at']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('conversations');
};
