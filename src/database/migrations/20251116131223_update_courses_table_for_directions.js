/**
 * Migration: Update courses table for directions integration
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Helper function to check if column exists
  const columnExists = async (tableName, columnName) => {
    const result = await knex.raw(`
      SELECT COUNT(*) as count
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
    `, [tableName, columnName]);
    return result[0][0].count > 0;
  };

  // Step 1: Drop old columns if they exist
  if (await columnExists('courses', 'subject')) {
    await knex.raw('ALTER TABLE courses DROP COLUMN subject');
  }

  if (await columnExists('courses', 'duration_weeks')) {
    await knex.raw('ALTER TABLE courses DROP COLUMN duration_weeks');
  }

  // Step 2: Rename columns if old names exist
  if (await columnExists('courses', 'title')) {
    await knex.raw('ALTER TABLE courses CHANGE COLUMN title name VARCHAR(255) NOT NULL');
  }

  if (await columnExists('courses', 'cover_image_url')) {
    await knex.raw('ALTER TABLE courses CHANGE COLUMN cover_image_url thumbnail VARCHAR(500)');
  }

  // Step 3: Add new columns if they don't exist
  if (!(await columnExists('courses', 'slug'))) {
    await knex.raw('ALTER TABLE courses ADD COLUMN slug VARCHAR(200) NULL');
  }

  if (!(await columnExists('courses', 'direction_id'))) {
    await knex.raw('ALTER TABLE courses ADD COLUMN direction_id INT UNSIGNED NULL');
  }

  if (!(await columnExists('courses', 'pricing_type'))) {
    await knex.raw(`ALTER TABLE courses ADD COLUMN pricing_type ENUM('subscription', 'individual') NOT NULL DEFAULT 'subscription'`);
  }

  // Helper function to check if index exists
  const indexExists = async (tableName, indexName) => {
    const result = await knex.raw(`
      SELECT COUNT(*) as count
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND INDEX_NAME = ?
    `, [tableName, indexName]);
    return result[0][0].count > 0;
  };

  // Helper function to check if constraint exists
  const constraintExists = async (tableName, constraintName) => {
    const result = await knex.raw(`
      SELECT COUNT(*) as count
      FROM information_schema.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND CONSTRAINT_NAME = ?
    `, [tableName, constraintName]);
    return result[0][0].count > 0;
  };

  // Step 4: Generate slugs for existing courses that don't have slugs
  const coursesWithoutSlug = await knex('courses')
    .whereNull('slug')
    .orWhere('slug', '')
    .select('id', 'name');

  for (const course of coursesWithoutSlug) {
    const slug = course.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    await knex('courses')
      .where('id', course.id)
      .update({ slug: slug + '-' + course.id });
  }

  // Step 5: Set default direction_id for courses that don't have one
  const coursesWithoutDirection = await knex('courses')
    .whereNull('direction_id')
    .count('id as count')
    .first();

  if (coursesWithoutDirection && coursesWithoutDirection.count > 0) {
    const firstDirection = await knex('directions').first('id');
    if (firstDirection) {
      await knex('courses')
        .whereNull('direction_id')
        .update({ direction_id: firstDirection.id });
    } else {
      // Create a default direction if none exists
      const [directionId] = await knex('directions').insert({
        name: 'General',
        slug: 'general',
        description: 'General courses',
        color: 'blue',
        status: 'active',
        display_order: 0,
      });
      await knex('courses')
        .whereNull('direction_id')
        .update({ direction_id: directionId });
    }
  }

  // Step 6: Make slug and direction_id NOT NULL if they aren't already
  const slugColumn = await knex.raw(`
    SELECT IS_NULLABLE
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'courses'
      AND COLUMN_NAME = 'slug'
  `);

  if (slugColumn[0][0] && slugColumn[0][0].IS_NULLABLE === 'YES') {
    await knex.raw(`
      ALTER TABLE courses
      MODIFY COLUMN slug VARCHAR(200) NOT NULL UNIQUE
    `);
  }

  const directionIdColumn = await knex.raw(`
    SELECT IS_NULLABLE
    FROM information_schema.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'courses'
      AND COLUMN_NAME = 'direction_id'
  `);

  if (directionIdColumn[0][0] && directionIdColumn[0][0].IS_NULLABLE === 'YES') {
    await knex.raw(`
      ALTER TABLE courses
      MODIFY COLUMN direction_id INT UNSIGNED NOT NULL
    `);
  }

  // Step 7: Add foreign key constraint if it doesn't exist
  if (!(await constraintExists('courses', 'courses_direction_id_foreign'))) {
    await knex.raw(`
      ALTER TABLE courses
      ADD CONSTRAINT courses_direction_id_foreign
      FOREIGN KEY (direction_id) REFERENCES directions(id) ON DELETE CASCADE
    `);
  }

  // Step 8: Update level enum values (this is safe to run multiple times)
  await knex.raw(`
    ALTER TABLE courses
    MODIFY COLUMN level ENUM('beginner', 'elementary', 'intermediate', 'upper-intermediate', 'advanced', 'proficiency') NOT NULL
  `);

  // Step 9: Update status enum values (this is safe to run multiple times)
  await knex.raw(`
    ALTER TABLE courses
    MODIFY COLUMN status ENUM('draft', 'active', 'inactive') NOT NULL DEFAULT 'draft'
  `);

  // Step 10: Add indexes if they don't exist
  if (!(await indexExists('courses', 'courses_direction_id_index'))) {
    await knex.raw('CREATE INDEX courses_direction_id_index ON courses(direction_id)');
  }

  if (!(await indexExists('courses', 'courses_pricing_type_index'))) {
    await knex.raw('CREATE INDEX courses_pricing_type_index ON courses(pricing_type)');
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  // Helper function to check if column exists
  const columnExists = async (tableName, columnName) => {
    const result = await knex.raw(`
      SELECT COUNT(*) as count
      FROM information_schema.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND COLUMN_NAME = ?
    `, [tableName, columnName]);
    return result[0][0].count > 0;
  };

  // Helper function to check if constraint exists
  const constraintExists = async (tableName, constraintName) => {
    const result = await knex.raw(`
      SELECT COUNT(*) as count
      FROM information_schema.TABLE_CONSTRAINTS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND CONSTRAINT_NAME = ?
    `, [tableName, constraintName]);
    return result[0][0].count > 0;
  };

  // Helper function to check if index exists
  const indexExists = async (tableName, indexName) => {
    const result = await knex.raw(`
      SELECT COUNT(*) as count
      FROM information_schema.STATISTICS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = ?
        AND INDEX_NAME = ?
    `, [tableName, indexName]);
    return result[0][0].count > 0;
  };

  // Check if courses table exists
  const hasCoursesTable = await knex.schema.hasTable('courses');
  if (!hasCoursesTable) return;

  // Step 1: Drop indexes first
  if (await indexExists('courses', 'courses_direction_id_index')) {
    await knex.raw('DROP INDEX courses_direction_id_index ON courses');
  }
  if (await indexExists('courses', 'courses_pricing_type_index')) {
    await knex.raw('DROP INDEX courses_pricing_type_index ON courses');
  }

  // Step 2: Drop foreign key constraint BEFORE dropping the column
  if (await constraintExists('courses', 'courses_direction_id_foreign')) {
    await knex.raw('ALTER TABLE courses DROP FOREIGN KEY courses_direction_id_foreign');
  }

  // Step 3: Rename columns back (if they exist with new names)
  const hasName = await columnExists('courses', 'name');
  const hasTitle = await columnExists('courses', 'title');
  if (hasName && !hasTitle) {
    await knex.raw('ALTER TABLE courses CHANGE COLUMN name title VARCHAR(255) NOT NULL');
  }

  const hasThumbnail = await columnExists('courses', 'thumbnail');
  const hasCoverImageUrl = await columnExists('courses', 'cover_image_url');
  if (hasThumbnail && !hasCoverImageUrl) {
    await knex.raw('ALTER TABLE courses CHANGE COLUMN thumbnail cover_image_url VARCHAR(500)');
  }

  // Step 4: Drop new columns if they exist
  if (await columnExists('courses', 'slug')) {
    await knex.raw('ALTER TABLE courses DROP COLUMN slug');
  }
  if (await columnExists('courses', 'direction_id')) {
    await knex.raw('ALTER TABLE courses DROP COLUMN direction_id');
  }
  if (await columnExists('courses', 'pricing_type')) {
    await knex.raw('ALTER TABLE courses DROP COLUMN pricing_type');
  }

  // Step 5: Restore old columns if they don't exist
  if (!(await columnExists('courses', 'subject'))) {
    await knex.raw(`ALTER TABLE courses ADD COLUMN subject ENUM('MATHEMATICS', 'ENGLISH') NOT NULL DEFAULT 'MATHEMATICS'`);
  }
  if (!(await columnExists('courses', 'duration_weeks'))) {
    await knex.raw('ALTER TABLE courses ADD COLUMN duration_weeks INT UNSIGNED NULL');
  }

  // Step 6: Restore old enum values
  await knex.raw(`
    ALTER TABLE courses
    MODIFY COLUMN level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL
  `);

  await knex.raw(`
    ALTER TABLE courses
    MODIFY COLUMN status ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT'
  `);
};
