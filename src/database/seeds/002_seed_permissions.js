const { v4: uuidv4 } = require('uuid');

/**
 * Seed: Permissions
 * EDULIFE Platform - Default permissions
 */
exports.seed = async function(knex) {
  // Delete existing entries
  await knex('permissions').del();

  const permissions = [
    // Courses
    { name: 'View Courses', slug: 'course.view', group_name: 'courses', description: 'Kurslarni ko\'rish' },
    { name: 'Create Course', slug: 'course.create', group_name: 'courses', description: 'Kurs yaratish' },
    { name: 'Edit Course', slug: 'course.edit', group_name: 'courses', description: 'Kursni tahrirlash' },
    { name: 'Delete Course', slug: 'course.delete', group_name: 'courses', description: 'Kursni o\'chirish' },
    { name: 'Publish Course', slug: 'course.publish', group_name: 'courses', description: 'Kursni nashr qilish' },
    { name: 'Review Course', slug: 'course.review', group_name: 'courses', description: 'Kursni tekshirish' },

    // Users
    { name: 'View Users', slug: 'user.view', group_name: 'users', description: 'Foydalanuvchilarni ko\'rish' },
    { name: 'Create User', slug: 'user.create', group_name: 'users', description: 'Foydalanuvchi yaratish' },
    { name: 'Edit User', slug: 'user.edit', group_name: 'users', description: 'Foydalanuvchini tahrirlash' },
    { name: 'Delete User', slug: 'user.delete', group_name: 'users', description: 'Foydalanuvchini o\'chirish' },
    { name: 'Block User', slug: 'user.block', group_name: 'users', description: 'Foydalanuvchini bloklash' },

    // Teachers
    { name: 'View Teachers', slug: 'teacher.view', group_name: 'teachers', description: 'O\'qituvchilarni ko\'rish' },
    { name: 'Verify Teacher', slug: 'teacher.verify', group_name: 'teachers', description: 'O\'qituvchini tasdiqlash' },
    { name: 'Manage Payouts', slug: 'teacher.payout', group_name: 'teachers', description: 'To\'lovlarni boshqarish' },

    // Payments
    { name: 'View Payments', slug: 'payment.view', group_name: 'payments', description: 'To\'lovlarni ko\'rish' },
    { name: 'Refund Payment', slug: 'payment.refund', group_name: 'payments', description: 'To\'lovni qaytarish' },
    { name: 'Create Manual Payment', slug: 'payment.create', group_name: 'payments', description: 'Qo\'lda to\'lov yaratish' },

    // Subscriptions
    { name: 'View Subscriptions', slug: 'subscription.view', group_name: 'subscriptions', description: 'Obunalarni ko\'rish' },
    { name: 'Manage Plans', slug: 'subscription.manage', group_name: 'subscriptions', description: 'Rejalarni boshqarish' },

    // Analytics
    { name: 'View Analytics', slug: 'analytics.view', group_name: 'analytics', description: 'Analitikani ko\'rish' },
    { name: 'Export Analytics', slug: 'analytics.export', group_name: 'analytics', description: 'Analitikani eksport qilish' },

    // Settings
    { name: 'View Settings', slug: 'settings.view', group_name: 'settings', description: 'Sozlamalarni ko\'rish' },
    { name: 'Edit Settings', slug: 'settings.edit', group_name: 'settings', description: 'Sozlamalarni tahrirlash' },

    // Promo Codes
    { name: 'View Promo Codes', slug: 'promo.view', group_name: 'promo', description: 'Promo kodlarni ko\'rish' },
    { name: 'Create Promo Code', slug: 'promo.create', group_name: 'promo', description: 'Promo kod yaratish' },
    { name: 'Delete Promo Code', slug: 'promo.delete', group_name: 'promo', description: 'Promo kodni o\'chirish' },

    // Reviews
    { name: 'Moderate Reviews', slug: 'review.moderate', group_name: 'reviews', description: 'Sharhlarni moderatsiya qilish' },

    // Audit
    { name: 'View Audit Logs', slug: 'audit.view', group_name: 'audit', description: 'Audit loglarni ko\'rish' },
  ];

  await knex('permissions').insert(
    permissions.map(p => ({
      id: uuidv4(),
      ...p,
      created_at: new Date(),
      updated_at: new Date(),
    }))
  );
};
