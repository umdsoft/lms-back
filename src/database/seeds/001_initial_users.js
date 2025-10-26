const bcrypt = require('bcryptjs');

/**
 * Seed: Initial users for testing
 */
exports.seed = async function (knex) {
  // Delete existing entries
  await knex('users').del();

  // Hash password
  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Insert seed entries
  await knex('users').insert([
    {
      id: 1,
      email: 'admin@lms.com',
      password: hashedPassword,
      full_name: 'Admin User',
      phone: '+998901234567',
      role: 'ADMIN',
      status: 'ACTIVE',
      preferred_language: 'uz',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 2,
      email: 'teacher@lms.com',
      password: hashedPassword,
      full_name: 'Teacher User',
      phone: '+998901234568',
      role: 'TEACHER',
      status: 'ACTIVE',
      preferred_language: 'uz',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 3,
      email: 'student@lms.com',
      password: hashedPassword,
      full_name: 'Student User',
      phone: '+998901234569',
      role: 'STUDENT',
      status: 'ACTIVE',
      preferred_language: 'uz',
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
