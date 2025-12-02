const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

/**
 * Seed: Users
 * EDULIFE Platform - Test users for each role
 */
exports.seed = async function(knex) {
  // Delete existing entries in correct order
  await knex('teacher_profiles').del();
  await knex('user_streaks').del();
  await knex('users').del();

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('Password123!', salt);

  const superAdminId = uuidv4();
  const adminId = uuidv4();
  const teacherId = uuidv4();
  const studentId = uuidv4();

  // Insert users
  await knex('users').insert([
    {
      id: superAdminId,
      email: 'superadmin@edulife.uz',
      phone: '+998901234567',
      password_hash: hashedPassword,
      first_name: 'Super',
      last_name: 'Admin',
      role: 'super_admin',
      status: 'active',
      email_verified_at: new Date(),
      phone_verified_at: new Date(),
      language: 'uz',
      timezone: 'Asia/Tashkent',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: adminId,
      email: 'admin@edulife.uz',
      phone: '+998901234568',
      password_hash: hashedPassword,
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      status: 'active',
      email_verified_at: new Date(),
      phone_verified_at: new Date(),
      language: 'uz',
      timezone: 'Asia/Tashkent',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: teacherId,
      email: 'teacher@edulife.uz',
      phone: '+998901234569',
      password_hash: hashedPassword,
      first_name: 'Sardor',
      last_name: 'Usmonov',
      role: 'teacher',
      status: 'active',
      email_verified_at: new Date(),
      phone_verified_at: new Date(),
      language: 'uz',
      timezone: 'Asia/Tashkent',
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: studentId,
      email: 'student@edulife.uz',
      phone: '+998901234570',
      password_hash: hashedPassword,
      first_name: 'Ali',
      last_name: 'Valiyev',
      role: 'student',
      status: 'active',
      email_verified_at: new Date(),
      phone_verified_at: new Date(),
      language: 'uz',
      timezone: 'Asia/Tashkent',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Create teacher profile for teacher user
  await knex('teacher_profiles').insert({
    id: uuidv4(),
    user_id: teacherId,
    username: 'sardor_usmonov',
    bio: 'Professional dasturchi va o\'qituvchi. 5+ yillik tajriba.',
    headline: 'Senior Full Stack Developer',
    specializations: JSON.stringify(['JavaScript', 'React', 'Node.js', 'Python']),
    level: 'verified',
    commission_rate: 30.00,
    total_students: 0,
    total_courses: 0,
    total_reviews: 0,
    avg_rating: 0.00,
    total_earnings: 0,
    is_verified: true,
    verified_at: new Date(),
    created_at: new Date(),
    updated_at: new Date(),
  });

  // Create user streaks for all users
  await knex('user_streaks').insert([
    {
      id: uuidv4(),
      user_id: superAdminId,
      current_streak: 0,
      longest_streak: 0,
      freeze_available: 2,
      freeze_used_this_month: 0,
      total_active_days: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      user_id: adminId,
      current_streak: 0,
      longest_streak: 0,
      freeze_available: 2,
      freeze_used_this_month: 0,
      total_active_days: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      user_id: teacherId,
      current_streak: 0,
      longest_streak: 0,
      freeze_available: 2,
      freeze_used_this_month: 0,
      total_active_days: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      user_id: studentId,
      current_streak: 5,
      longest_streak: 10,
      last_activity_date: new Date(),
      freeze_available: 2,
      freeze_used_this_month: 0,
      total_active_days: 15,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};
