/**
 * Migration: Create teacher_earnings table
 * EDULIFE Platform - Teacher earnings tracking
 */
exports.up = async function(knex) {
  await knex.schema.createTable('teacher_earnings', (table) => {
    table.string('id', 36).primary();
    table.string('teacher_id', 36).notNullable();
    table.enum('type', ['course_sale', 'subscription_pool']).notNullable();
    table.string('course_id', 36).nullable();
    table.string('enrollment_id', 36).nullable();
    table.string('period', 7).nullable();
    table.bigInteger('gross_amount').unsigned().notNullable();
    table.decimal('commission_rate', 4, 2).notNullable();
    table.bigInteger('commission_amount').unsigned().notNullable();
    table.bigInteger('net_amount').unsigned().notNullable();
    table.integer('watch_minutes').unsigned().nullable();
    table.decimal('pool_percentage', 10, 6).nullable();
    table.enum('status', ['pending', 'confirmed', 'paid', 'cancelled']).defaultTo('pending');
    table.string('payout_id', 36).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('teacher_id').references('id').inTable('teacher_profiles');
    table.foreign('course_id').references('id').inTable('courses');
    table.foreign('enrollment_id').references('id').inTable('enrollments');

    // Indexes
    table.index(['teacher_id', 'period']);
    table.index(['teacher_id', 'status']);
    table.index('payout_id');
    table.index('type');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('teacher_earnings');
};
