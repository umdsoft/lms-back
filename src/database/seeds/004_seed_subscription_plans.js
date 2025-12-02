const { v4: uuidv4 } = require('uuid');

/**
 * Seed: Subscription Plans
 * EDULIFE Platform - Default subscription plans
 */
exports.seed = async function(knex) {
  // Delete existing entries
  await knex('subscription_plans').del();

  await knex('subscription_plans').insert([
    {
      id: uuidv4(),
      name: 'Oylik obuna',
      slug: 'monthly',
      description: 'Bir oylik obuna - barcha kurslarga to\'liq kirish',
      price: 99000,
      currency: 'UZS',
      duration_days: 30,
      duration_type: 'monthly',
      features: JSON.stringify([
        'Barcha kurslarga kirish',
        'Sertifikatlar olish',
        'Mobil ilovada ko\'rish',
        'Offlayn rejim',
      ]),
      max_courses: null,
      max_downloads: 10,
      is_active: true,
      is_featured: false,
      trial_days: 7,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Choraklik obuna',
      slug: 'quarterly',
      description: 'Uch oylik obuna - 15% chegirma',
      price: 249000,
      currency: 'UZS',
      duration_days: 90,
      duration_type: 'quarterly',
      features: JSON.stringify([
        'Barcha kurslarga kirish',
        'Sertifikatlar olish',
        'Mobil ilovada ko\'rish',
        'Offlayn rejim',
        '15% chegirma',
        'Priority support',
      ]),
      max_courses: null,
      max_downloads: 30,
      is_active: true,
      is_featured: true,
      trial_days: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Yillik obuna',
      slug: 'yearly',
      description: 'Bir yillik obuna - 33% chegirma',
      price: 799000,
      currency: 'UZS',
      duration_days: 365,
      duration_type: 'yearly',
      features: JSON.stringify([
        'Barcha kurslarga kirish',
        'Sertifikatlar olish',
        'Mobil ilovada ko\'rish',
        'Offlayn rejim',
        '33% chegirma',
        'Priority support',
        'Eksklyuziv kontent',
        'Cheksiz yuklab olish',
      ]),
      max_courses: null,
      max_downloads: null,
      is_active: true,
      is_featured: true,
      trial_days: 0,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};
