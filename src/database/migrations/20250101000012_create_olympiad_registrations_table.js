/**
 * Migration: Create olympiad_registrations table
 */
exports.up = function (knex) {
  return knex.schema.createTableIfNotExists('olympiad_registrations', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table
      .integer('olympiad_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('olympiads')
      .onDelete('CASCADE');
    table
      .enum('status', ['REGISTERED', 'CONFIRMED', 'PARTICIPATED', 'DISQUALIFIED'])
      .defaultTo('REGISTERED')
      .notNullable();
    table.decimal('score', 5, 2).nullable();
    table.integer('rank').unsigned().nullable();
    table.dateTime('registered_at').notNullable().defaultTo(knex.fn.now());
    table.timestamps(true, true);

    // Composite unique index
    table.unique(['user_id', 'olympiad_id']);

    // Indexes
    table.index('user_id');
    table.index('olympiad_id');
    table.index('status');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('olympiad_registrations');
};
