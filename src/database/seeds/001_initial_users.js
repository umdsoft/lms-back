const bcrypt = require('bcryptjs');

/**
 * Seed: Initial users for testing
 * Updated to match Sequelize User model schema
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
      phone: '+998901234567',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      avatar: null,
      is_active: true,
      is_email_verified: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 2,
      email: 'teacher@lms.com',
      phone: '+998901234568',
      password: hashedPassword,
      first_name: 'Teacher',
      last_name: 'User',
      role: 'teacher',
      avatar: null,
      is_active: true,
      is_email_verified: true,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
    {
      id: 3,
      email: 'student@lms.com',
      phone: '+998901234569',
      password: hashedPassword,
      first_name: 'Student',
      last_name: 'User',
      role: 'student',
      avatar: null,
      is_active: true,
      is_email_verified: false,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    },
  ]);
};
