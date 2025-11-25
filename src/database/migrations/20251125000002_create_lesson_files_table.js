/**
 * Migration: Create lesson_files table
 * Stores additional files (PDF, DOCX, etc.) attached to lessons
 */
exports.up = async function (knex) {
  const exists = await knex.schema.hasTable('lesson_files');

  if (!exists) {
    await knex.schema.createTable('lesson_files', (table) => {
      table.increments('id').primary();
      table
        .integer('lesson_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('lessons')
        .onDelete('CASCADE');
      table.string('name', 255).notNullable();
      table.string('url', 500).notNullable();
      table.string('file_type', 50).nullable().comment('pdf, docx, xlsx, pptx, etc');
      table.bigInteger('file_size').unsigned().nullable().comment('File size in bytes');
      table.timestamps(true, true);

      // Indexes
      table.index('lesson_id');
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('lesson_files');
};
