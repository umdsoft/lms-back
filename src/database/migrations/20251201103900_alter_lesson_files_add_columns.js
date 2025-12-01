/**
 * Migration: Alter lesson_files table - add new columns for file upload
 * Adds: original_name, file_name, file_path, file_extension, display_order
 */
exports.up = async function(knex) {
  const hasOriginalName = await knex.schema.hasColumn('lesson_files', 'original_name');

  if (!hasOriginalName) {
    await knex.schema.alterTable('lesson_files', (table) => {
      // Original file name (user's file name)
      table.string('original_name', 255).nullable().after('name');
      // Server-side file name (UUID based)
      table.string('file_name', 255).nullable().after('original_name');
      // Full file path on server
      table.string('file_path', 500).nullable().after('file_name');
      // File extension (.pdf, .docx, etc)
      table.string('file_extension', 20).nullable().after('file_type');
      // Display order for sorting
      table.integer('display_order').defaultTo(0).after('file_size');
    });
  }
};

exports.down = async function(knex) {
  const hasOriginalName = await knex.schema.hasColumn('lesson_files', 'original_name');

  if (hasOriginalName) {
    await knex.schema.alterTable('lesson_files', (table) => {
      table.dropColumn('original_name');
      table.dropColumn('file_name');
      table.dropColumn('file_path');
      table.dropColumn('file_extension');
      table.dropColumn('display_order');
    });
  }
};
