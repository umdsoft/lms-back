/**
 * Migration: Update lessons table to use module_id instead of course_id
 */
exports.up = async function (knex) {
  const hasModuleId = await knex.schema.hasColumn('lessons', 'module_id');
  const hasCourseId = await knex.schema.hasColumn('lessons', 'course_id');

  if (!hasModuleId) {
    await knex.schema.table('lessons', (table) => {
      // Add module_id column
      table
        .integer('module_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('modules')
        .onDelete('CASCADE')
        .after('id');
    });
  }

  if (hasCourseId) {
    // Drop old course_id indexes if they exist
    try {
      await knex.schema.table('lessons', (table) => {
        table.dropIndex('course_id');
      });
    } catch (e) {
      // Index might not exist, continue
    }

    try {
      await knex.schema.table('lessons', (table) => {
        table.dropIndex(['course_id', 'order']);
      });
    } catch (e) {
      // Index might not exist, continue
    }

    // Drop course_id column
    await knex.schema.alterTable('lessons', (table) => {
      table.dropColumn('course_id');
    });
  }

  if (!hasModuleId) {
    // Make module_id NOT NULL and add indexes
    await knex.schema.alterTable('lessons', (table) => {
      table.integer('module_id').unsigned().notNullable().alter();

      // Add new indexes for module_id
      table.index('module_id');
      table.index(['module_id', 'order']);
    });
  }
};

exports.down = async function (knex) {
  // Check if lessons table exists
  const hasLessonsTable = await knex.schema.hasTable('lessons');
  if (!hasLessonsTable) return;

  const hasModuleId = await knex.schema.hasColumn('lessons', 'module_id');
  const hasCourseId = await knex.schema.hasColumn('lessons', 'course_id');

  // Helper to check if index exists
  const indexExists = async (tableName, indexName) => {
    try {
      const result = await knex.raw(`
        SELECT COUNT(*) as count
        FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
          AND INDEX_NAME = ?
      `, [tableName, indexName]);
      return result[0][0].count > 0;
    } catch (e) {
      return false;
    }
  };

  // Helper to check if FK constraint exists
  const constraintExists = async (tableName, constraintName) => {
    try {
      const result = await knex.raw(`
        SELECT COUNT(*) as count
        FROM information_schema.TABLE_CONSTRAINTS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
          AND CONSTRAINT_NAME = ?
      `, [tableName, constraintName]);
      return result[0][0].count > 0;
    } catch (e) {
      return false;
    }
  };

  // Step 1: Re-add course_id column if it doesn't exist
  if (!hasCourseId) {
    await knex.schema.table('lessons', (table) => {
      table
        .integer('course_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('courses')
        .onDelete('CASCADE')
        .after('id');
    });
  }

  // Step 2: Drop module_id indexes if they exist
  if (await indexExists('lessons', 'lessons_module_id_index')) {
    try {
      await knex.raw('DROP INDEX lessons_module_id_index ON lessons');
    } catch (e) {
      // Ignore if index doesn't exist
    }
  }
  if (await indexExists('lessons', 'lessons_module_id_order_index')) {
    try {
      await knex.raw('DROP INDEX lessons_module_id_order_index ON lessons');
    } catch (e) {
      // Ignore if index doesn't exist
    }
  }

  // Step 3: Drop FK constraint for module_id before dropping the column
  if (await constraintExists('lessons', 'lessons_module_id_foreign')) {
    await knex.raw('ALTER TABLE lessons DROP FOREIGN KEY lessons_module_id_foreign');
  }

  // Step 4: Drop module_id column if it exists
  if (hasModuleId) {
    await knex.schema.alterTable('lessons', (table) => {
      table.dropColumn('module_id');
    });
  }

  // Step 5: Make course_id NOT NULL and add indexes
  if (!hasCourseId) {
    await knex.schema.alterTable('lessons', (table) => {
      table.integer('course_id').unsigned().notNullable().alter();
      table.index('course_id');
      table.index(['course_id', 'order']);
    });
  }
};
