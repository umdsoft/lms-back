/**
 * Migration: Create review_votes table
 * EDULIFE Platform - Review helpfulness votes
 */
exports.up = async function(knex) {
  await knex.schema.createTable('review_votes', (table) => {
    table.string('id', 36).primary();
    table.string('review_id', 36).notNullable();
    table.string('user_id', 36).notNullable();
    table.enum('vote', ['helpful', 'not_helpful']).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('review_id').references('id').inTable('reviews').onDelete('CASCADE');
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    // Unique constraint
    table.unique(['review_id', 'user_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('review_votes');
};
