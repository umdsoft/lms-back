/**
 * Migration: Create certificates table
 * EDULIFE Platform - Course completion certificates
 */
exports.up = async function(knex) {
  await knex.schema.createTable('certificates', (table) => {
    table.string('id', 36).primary();
    table.string('user_id', 36).notNullable();
    table.string('course_id', 36).notNullable();
    table.string('enrollment_id', 36).notNullable();
    table.string('certificate_number', 50).notNullable().unique();
    table.string('recipient_name', 200).notNullable();
    table.string('course_title', 255).notNullable();
    table.string('instructor_name', 200).nullable();
    table.decimal('final_score', 5, 2).nullable();
    table.integer('total_hours').unsigned().nullable();
    table.string('pdf_url', 500).nullable();
    table.string('image_url', 500).nullable();
    table.string('verification_url', 500).nullable();
    table.string('qr_code_url', 500).nullable();
    table.timestamp('issued_at').defaultTo(knex.fn.now());
    table.timestamp('expires_at').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());

    // Foreign keys
    table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE');
    table.foreign('enrollment_id').references('id').inTable('enrollments').onDelete('CASCADE');

    // Unique constraint
    table.unique(['user_id', 'course_id']);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('certificates');
};
