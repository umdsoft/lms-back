/**
 * Migration: Create olympiads table
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('olympiads');
  if (exists) return;

  return knex.schema.createTable('olympiads', (table) => {
    table.increments('id').primary();
    table.string('title', 255).notNullable();
    table.text('description');
    table.enum('subject', ['MATHEMATICS', 'ENGLISH']).notNullable();
    table
      .enum('level', ['REGIONAL', 'NATIONAL', 'INTERNATIONAL'])
      .notNullable();
    table.dateTime('start_date').notNullable();
    table.dateTime('end_date').notNullable();
    table.dateTime('registration_deadline').notNullable();
    table.integer('max_participants').unsigned();
    table.integer('duration_minutes').unsigned().notNullable();
    table
      .enum('status', [
        'UPCOMING',
        'REGISTRATION_OPEN',
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED',
      ])
      .defaultTo('UPCOMING')
      .notNullable();
    table.timestamps(true, true);

    // Indexes
    table.index('subject');
    table.index('level');
    table.index('status');
    table.index('start_date');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('olympiads');
};
