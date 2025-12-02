/**
 * Migration: Create settings table
 * EDULIFE Platform - System settings
 */
exports.up = async function(knex) {
  await knex.schema.createTable('settings', (table) => {
    table.string('id', 36).primary();
    table.string('key_name', 100).notNullable().unique();
    table.text('value_text').nullable();
    table.json('value_json').nullable();
    table.enum('type', ['string', 'number', 'boolean', 'json']).defaultTo('string');
    table.string('group_name', 50).nullable();
    table.string('description', 255).nullable();
    table.boolean('is_public').defaultTo(false);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Indexes
    table.index('key_name');
    table.index('group_name');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('settings');
};
