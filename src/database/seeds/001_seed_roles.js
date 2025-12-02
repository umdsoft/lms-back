const { v4: uuidv4 } = require('uuid');

/**
 * Seed: Roles
 * EDULIFE Platform - Default roles
 */
exports.seed = async function(knex) {
  // Delete existing entries
  await knex('role_permissions').del();
  await knex('roles').del();

  // Insert roles
  await knex('roles').insert([
    {
      id: uuidv4(),
      name: 'Student',
      slug: 'student',
      description: 'O\'quvchi - kurslarni ko\'rish va o\'rganish',
      is_system: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Teacher',
      slug: 'teacher',
      description: 'O\'qituvchi - kurslar yaratish va boshqarish',
      is_system: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Admin',
      slug: 'admin',
      description: 'Administrator - platforma boshqaruvi',
      is_system: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Super Admin',
      slug: 'super_admin',
      description: 'Super Administrator - to\'liq huquqlar',
      is_system: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};
