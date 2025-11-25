/**
 * Migration: Update lessons table structure for new model
 * - Rename 'title' to 'name' if exists
 * - Add video_type, video_embed_url columns
 * - Make video_url nullable
 * - Remove deprecated columns (content, is_free, status, type, deleted_at, duration_minutes)
 */
exports.up = async function (knex) {
  // Check existing columns
  const hasTitle = await knex.schema.hasColumn('lessons', 'title');
  const hasName = await knex.schema.hasColumn('lessons', 'name');
  const hasVideoType = await knex.schema.hasColumn('lessons', 'video_type');
  const hasVideoEmbedUrl = await knex.schema.hasColumn('lessons', 'video_embed_url');
  const hasVideoUrl = await knex.schema.hasColumn('lessons', 'video_url');
  const hasDuration = await knex.schema.hasColumn('lessons', 'duration');
  const hasDurationMinutes = await knex.schema.hasColumn('lessons', 'duration_minutes');

  // Deprecated columns to remove
  const hasContent = await knex.schema.hasColumn('lessons', 'content');
  const hasIsFree = await knex.schema.hasColumn('lessons', 'is_free');
  const hasStatus = await knex.schema.hasColumn('lessons', 'status');
  const hasType = await knex.schema.hasColumn('lessons', 'type');
  const hasDeletedAt = await knex.schema.hasColumn('lessons', 'deleted_at');

  await knex.schema.alterTable('lessons', (table) => {
    // Rename title to name if title exists and name doesn't
    if (hasTitle && !hasName) {
      table.renameColumn('title', 'name');
    }

    // Add name column if neither exists
    if (!hasTitle && !hasName) {
      table.string('name', 200).notNullable().after('module_id');
    }

    // Add video_type column if not exists
    if (!hasVideoType) {
      table
        .enum('video_type', ['youtube', 'direct'])
        .notNullable()
        .defaultTo('youtube')
        .after('description');
    }

    // Add video_embed_url column if not exists
    if (!hasVideoEmbedUrl) {
      table.string('video_embed_url', 500).nullable().after('video_url');
    }

    // Add duration column if not exists (in seconds)
    if (!hasDuration) {
      table.integer('duration').unsigned().notNullable().defaultTo(0).after('video_embed_url');
    }

    // Remove deprecated columns
    if (hasDurationMinutes) {
      table.dropColumn('duration_minutes');
    }
    if (hasContent) {
      table.dropColumn('content');
    }
    if (hasIsFree) {
      table.dropColumn('is_free');
    }
    if (hasStatus) {
      table.dropColumn('status');
    }
    if (hasType) {
      table.dropColumn('type');
    }
    if (hasDeletedAt) {
      table.dropColumn('deleted_at');
    }
  });

  // Make video_url nullable (separate alter to avoid issues)
  if (hasVideoUrl) {
    await knex.schema.alterTable('lessons', (table) => {
      table.string('video_url', 500).nullable().alter();
    });
  } else {
    await knex.schema.alterTable('lessons', (table) => {
      table.string('video_url', 500).nullable().after('video_type');
    });
  }
};

exports.down = async function (knex) {
  const hasName = await knex.schema.hasColumn('lessons', 'name');
  const hasVideoType = await knex.schema.hasColumn('lessons', 'video_type');
  const hasVideoEmbedUrl = await knex.schema.hasColumn('lessons', 'video_embed_url');
  const hasDuration = await knex.schema.hasColumn('lessons', 'duration');

  await knex.schema.alterTable('lessons', (table) => {
    // Rename name back to title
    if (hasName) {
      table.renameColumn('name', 'title');
    }

    // Drop new columns
    if (hasVideoType) {
      table.dropColumn('video_type');
    }
    if (hasVideoEmbedUrl) {
      table.dropColumn('video_embed_url');
    }
    if (hasDuration) {
      table.dropColumn('duration');
    }

    // Add back deprecated columns
    table.text('content').nullable();
    table.boolean('is_free').defaultTo(false);
    table.enum('status', ['DRAFT', 'PUBLISHED']).defaultTo('DRAFT').notNullable();
    table.enum('type', ['VIDEO', 'TEXT', 'INTERACTIVE', 'QUIZ']).notNullable();
    table.timestamp('deleted_at').nullable();
    table.integer('duration_minutes').unsigned().nullable();
  });

  // Make video_url not nullable again
  await knex.schema.alterTable('lessons', (table) => {
    table.string('video_url', 500).notNullable().alter();
  });
};
