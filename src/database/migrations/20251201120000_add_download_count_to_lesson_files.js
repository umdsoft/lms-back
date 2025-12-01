/**
 * Migration: Add download_count column to lesson_files table
 * Tracks the number of times each file has been downloaded
 */

exports.up = async function (knex) {
  const hasDownloadCount = await knex.schema.hasColumn('lesson_files', 'download_count');

  if (!hasDownloadCount) {
    await knex.schema.alterTable('lesson_files', (table) => {
      table.integer('download_count').unsigned().defaultTo(0).comment('Number of downloads');
    });
  }
};

exports.down = async function (knex) {
  const hasDownloadCount = await knex.schema.hasColumn('lesson_files', 'download_count');

  if (hasDownloadCount) {
    await knex.schema.alterTable('lesson_files', (table) => {
      table.dropColumn('download_count');
    });
  }
};
