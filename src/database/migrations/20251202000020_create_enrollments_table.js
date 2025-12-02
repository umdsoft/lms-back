/**
 * Migration: Create enrollments table
 * EDULIFE Platform - User course enrollments
 */
exports.up = async function(knex) {
  await knex.schema.createTable('enrollments', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).notNullable();
    table.string('course_id', 36).notNullable();
    table.enum('enrollment_type', ['purchase', 'subscription', 'free', 'gift', 'promo']).notNullable();
    table.string('payment_id', 36).nullable();
    table.string('subscription_id', 36).nullable();
    table.bigInteger('price_paid').unsigned().defaultTo(0);
    table.string('currency', 3).defaultTo('UZS');
    table.decimal('progress', 5, 2).defaultTo(0.00);
    table.integer('completed_lessons').unsigned().defaultTo(0);
    table.integer('total_watch_time').unsigned().defaultTo(0);
    table.enum('status', ['active', 'completed', 'expired', 'refunded']).defaultTo('active');
    table.timestamp('started_at').nullable();
    table.timestamp('last_accessed_at').nullable();
    table.timestamp('completed_at').nullable();
    table.timestamp('expires_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE');

    // Unique constraint
    table.unique(['user_id', 'course_id']);

    // Indexes
    table.index(['user_id', 'status']);
    table.index('course_id');
    table.index('progress');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('enrollments');
};
