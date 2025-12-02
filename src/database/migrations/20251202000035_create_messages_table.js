/**
 * Migration: Create messages table
 * EDULIFE Platform - Conversation messages
 */
exports.up = async function(knex) {
  await knex.schema.createTable('messages', (table) => {
    table.string('id', 36).primary();
    table.string('conversation_id', 36).notNullable();
    table.string('sender_id', 36).notNullable();
    table.text('message_text').notNullable();
    table.string('attachment_url', 500).nullable();
    table.string('attachment_type', 50).nullable();
    table.string('attachment_name', 255).nullable();
    table.boolean('is_read').defaultTo(false);
    table.timestamp('read_at').nullable();
    table.boolean('is_edited').defaultTo(false);
    table.timestamp('edited_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Foreign keys
    table.foreign('conversation_id').references('id').inTable('conversations').onDelete('CASCADE');
    table.foreign('sender_id').references('id').inTable('users');

    // Indexes
    table.index(['conversation_id', 'created_at']);
    table.index('sender_id');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('messages');
};
