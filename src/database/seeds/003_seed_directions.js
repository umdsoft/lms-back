const { v4: uuidv4 } = require('uuid');

/**
 * Seed: Directions
 * EDULIFE Platform - Default course directions/categories
 */
exports.seed = async function(knex) {
  // Delete existing entries
  await knex('directions').del();

  await knex('directions').insert([
    {
      id: uuidv4(),
      name: 'Dasturlash',
      slug: 'dasturlash',
      description: 'Dasturlash tillari va texnologiyalari: JavaScript, Python, Java, va boshqalar',
      icon: 'code',
      color: '#3B82F6',
      order_index: 1,
      is_active: true,
      is_featured: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Ingliz tili',
      slug: 'ingliz-tili',
      description: 'Ingliz tilini boshlang\'ich darajadan professional darajagacha o\'rganing',
      icon: 'globe',
      color: '#10B981',
      order_index: 2,
      is_active: true,
      is_featured: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Rus tili',
      slug: 'rus-tili',
      description: 'Rus tilini grammatika va muloqot orqali o\'rganing',
      icon: 'book-open',
      color: '#EF4444',
      order_index: 3,
      is_active: true,
      is_featured: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Matematika',
      slug: 'matematika',
      description: 'Matematika fanidan boshlang\'ich va yuqori darajadagi kurslar',
      icon: 'calculator',
      color: '#8B5CF6',
      order_index: 4,
      is_active: true,
      is_featured: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Marketing',
      slug: 'marketing',
      description: 'Digital marketing, SMM, SEO va reklama strategiyalari',
      icon: 'megaphone',
      color: '#F59E0B',
      order_index: 5,
      is_active: true,
      is_featured: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Dizayn',
      slug: 'dizayn',
      description: 'Grafik dizayn, UI/UX, web dizayn va video montaj',
      icon: 'palette',
      color: '#EC4899',
      order_index: 6,
      is_active: true,
      is_featured: true,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id: uuidv4(),
      name: 'Biznes',
      slug: 'biznes',
      description: 'Biznes yuritish, menejment, moliya va tadbirkorlik',
      icon: 'briefcase',
      color: '#6366F1',
      order_index: 7,
      is_active: true,
      is_featured: false,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
};
