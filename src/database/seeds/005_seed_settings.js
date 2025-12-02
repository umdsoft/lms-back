const { v4: uuidv4 } = require('uuid');

/**
 * Seed: Settings
 * EDULIFE Platform - Default system settings
 */
exports.seed = async function(knex) {
  // Delete existing entries
  await knex('settings').del();

  const settings = [
    // General
    { key_name: 'site_name', value_text: 'EDULIFE', type: 'string', group_name: 'general', description: 'Sayt nomi', is_public: true },
    { key_name: 'site_description', value_text: 'O\'zbekistonning eng yaxshi ta\'lim platformasi', type: 'string', group_name: 'general', description: 'Sayt tavsifi', is_public: true },
    { key_name: 'site_url', value_text: 'https://edulife.uz', type: 'string', group_name: 'general', description: 'Sayt URL manzili', is_public: true },
    { key_name: 'contact_email', value_text: 'info@edulife.uz', type: 'string', group_name: 'general', description: 'Aloqa email', is_public: true },
    { key_name: 'contact_phone', value_text: '+998 71 123 45 67', type: 'string', group_name: 'general', description: 'Aloqa telefon', is_public: true },
    { key_name: 'telegram_channel', value_text: '@edulife_uz', type: 'string', group_name: 'general', description: 'Telegram kanal', is_public: true },

    // Teacher Commission
    { key_name: 'commission_rate_new', value_text: '30', type: 'number', group_name: 'teacher', description: 'Yangi o\'qituvchi komissiyasi (%)', is_public: false },
    { key_name: 'commission_rate_verified', value_text: '30', type: 'number', group_name: 'teacher', description: 'Tasdiqlangan o\'qituvchi komissiyasi (%)', is_public: false },
    { key_name: 'commission_rate_featured', value_text: '25', type: 'number', group_name: 'teacher', description: 'Featured o\'qituvchi komissiyasi (%)', is_public: false },
    { key_name: 'commission_rate_top', value_text: '20', type: 'number', group_name: 'teacher', description: 'Top o\'qituvchi komissiyasi (%)', is_public: false },

    // Payment
    { key_name: 'min_payout_amount', value_text: '100000', type: 'number', group_name: 'payment', description: 'Minimal to\'lov summasi (UZS)', is_public: false },
    { key_name: 'payout_day', value_text: '5', type: 'number', group_name: 'payment', description: 'Oylik to\'lov kuni', is_public: false },
    { key_name: 'payme_enabled', value_text: 'true', type: 'boolean', group_name: 'payment', description: 'PayMe to\'lov tizimi', is_public: true },
    { key_name: 'click_enabled', value_text: 'true', type: 'boolean', group_name: 'payment', description: 'Click to\'lov tizimi', is_public: true },

    // Course
    { key_name: 'course_review_required', value_text: 'true', type: 'boolean', group_name: 'course', description: 'Kurs nashr qilishdan oldin tekshiruv talab', is_public: false },
    { key_name: 'min_lessons_per_course', value_text: '5', type: 'number', group_name: 'course', description: 'Kursda minimal darslar soni', is_public: false },
    { key_name: 'max_video_size_mb', value_text: '500', type: 'number', group_name: 'course', description: 'Maksimal video hajmi (MB)', is_public: false },

    // Test
    { key_name: 'test_passing_score', value_text: '70', type: 'number', group_name: 'test', description: 'Testdan o\'tish uchun minimal ball (%)', is_public: true },
    { key_name: 'max_test_attempts', value_text: '3', type: 'number', group_name: 'test', description: 'Maksimal test urinishlari', is_public: true },

    // Streak
    { key_name: 'streak_freeze_per_month', value_text: '2', type: 'number', group_name: 'streak', description: 'Oylik streak freeze soni', is_public: true },
    { key_name: 'min_watch_time_for_streak', value_text: '15', type: 'number', group_name: 'streak', description: 'Streak uchun minimal video ko\'rish (daqiqa)', is_public: true },
  ];

  await knex('settings').insert(
    settings.map(s => ({
      id: uuidv4(),
      ...s,
      created_at: new Date(),
      updated_at: new Date(),
    }))
  );
};
