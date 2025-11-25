/**
 * Migration: Create lessons table
 */
exports.up = function (knex) {
  return knex.schema.createTable('lessons', (table) => {
    table.increments('id').primary();
    table
      .integer('course_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('courses')
      .onDelete('CASCADE');
    table.string('title', 255).notNullable();
    table.text('description');
    table
      .enum('type', ['VIDEO', 'TEXT', 'INTERACTIVE', 'QUIZ'])
      .notNullable();
    table.text('content'); // For text lessons
    table.string('video_url', 500); // For video lessons
    table.integer('duration_minutes').unsigned();
    table.integer('order').unsigned().notNullable();
    table.boolean('is_free').defaultTo(false);
    table
      .enum('status', ['DRAFT', 'PUBLISHED'])
      .defaultTo('DRAFT')
      .notNullable();
    table.timestamps(true, true);
    table.timestamp('deleted_at').nullable();

    // Indexes
    table.index('course_id');
    table.index(['course_id', 'order']);
    table.index('status');
    table.index('deleted_at');
  });
};

exports.down = async function (knex) {
  // Foreign key constraint'larni o'chirish kerak, chunki boshqa jadvallar lessons ga bog'langan
  // Avval bog'langan jadvallarni o'chiramiz yoki FK'larni olib tashlaymiz

  // lesson_files jadvalini o'chirish (agar mavjud bo'lsa)
  const hasLessonFiles = await knex.schema.hasTable('lesson_files');
  if (hasLessonFiles) {
    await knex.schema.dropTableIfExists('lesson_files');
  }

  // lesson_progress jadvalini o'chirish (agar mavjud bo'lsa)
  const hasLessonProgress = await knex.schema.hasTable('lesson_progress');
  if (hasLessonProgress) {
    await knex.schema.dropTableIfExists('lesson_progress');
  }

  // quizzes va assignments jadvallaridan lessons ga bo'lgan FK'larni olib tashlash
  // (bu jadvallar SET NULL ishlatadi, shuning uchun o'chirilmaydi, faqat FK olib tashlanadi)
  const hasQuizzes = await knex.schema.hasTable('quizzes');
  if (hasQuizzes) {
    const hasQuizLessonId = await knex.schema.hasColumn('quizzes', 'lesson_id');
    if (hasQuizLessonId) {
      await knex.schema.alterTable('quizzes', (table) => {
        table.dropForeign('lesson_id');
      });
    }
  }

  const hasAssignments = await knex.schema.hasTable('assignments');
  if (hasAssignments) {
    const hasAssignmentLessonId = await knex.schema.hasColumn('assignments', 'lesson_id');
    if (hasAssignmentLessonId) {
      await knex.schema.alterTable('assignments', (table) => {
        table.dropForeign('lesson_id');
      });
    }
  }

  // Endi lessons jadvalini xavfsiz o'chirishimiz mumkin
  return knex.schema.dropTableIfExists('lessons');
};
