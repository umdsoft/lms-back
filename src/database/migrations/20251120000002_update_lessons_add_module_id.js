/**
 * Migration: Update lessons table to use module_id instead of course_id
 */
exports.up = function (knex) {
  return knex.schema.table('lessons', (table) => {
    // Add module_id column
    table
      .integer('module_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('modules')
      .onDelete('CASCADE')
      .after('id');

    // Drop old course_id indexes
    table.dropIndex('course_id');
    table.dropIndex(['course_id', 'order']);
  }).then(() => {
    // Make module_id NOT NULL after migration (assuming data migration happened)
    return knex.schema.alterTable('lessons', (table) => {
      table.integer('module_id').unsigned().notNullable().alter();

      // Drop course_id column
      table.dropColumn('course_id');

      // Add new indexes for module_id
      table.index('module_id');
      table.index(['module_id', 'order']);
    });
  });
};

exports.down = function (knex) {
  return knex.schema.table('lessons', (table) => {
    // Re-add course_id column
    table
      .integer('course_id')
      .unsigned()
      .nullable()
      .references('id')
      .inTable('courses')
      .onDelete('CASCADE')
      .after('id');

    // Drop module_id indexes
    table.dropIndex('module_id');
    table.dropIndex(['module_id', 'order']);
  }).then(() => {
    return knex.schema.alterTable('lessons', (table) => {
      table.integer('course_id').unsigned().notNullable().alter();

      // Drop module_id column
      table.dropColumn('module_id');

      // Re-add course_id indexes
      table.index('course_id');
      table.index(['course_id', 'order']);
    });
  });
};
