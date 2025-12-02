/**
 * Migration: Create teacher_profiles table
 * EDULIFE Platform - Teacher profile information
 */
exports.up = async function(knex) {
  await knex.schema.createTable('teacher_profiles', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).notNullable().unique();
    table.string('username', 50).notNullable().unique();
    table.text('bio').nullable();
    table.string('headline', 255).nullable();
    table.json('specializations').nullable();
    table.string('website_url', 500).nullable();
    table.string('youtube_url', 500).nullable();
    table.string('telegram_url', 500).nullable();
    table.string('linkedin_url', 500).nullable();
    table.enum('level', ['new', 'verified', 'featured', 'top']).defaultTo('new');
    table.decimal('commission_rate', 4, 2).defaultTo(30.00);
    table.integer('total_students').unsigned().defaultTo(0);
    table.integer('total_courses').unsigned().defaultTo(0);
    table.integer('total_reviews').unsigned().defaultTo(0);
    table.decimal('avg_rating', 3, 2).defaultTo(0.00);
    table.bigInteger('total_earnings').unsigned().defaultTo(0);
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('verified_at').nullable();
    table.string('verified_by', 36).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');

    // Indexes
    table.index('level');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('teacher_profiles');
};
