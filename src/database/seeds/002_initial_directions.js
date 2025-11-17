/**
 * Seed: Initial Directions
 * Creates default course directions/categories
 */

exports.seed = async function(knex) {
  // Clear existing entries (optional - comment out if you want to preserve existing data)
  await knex('directions').del();

  // Insert seed data
  await knex('directions').insert([
    {
      id: 1,
      name: 'Programming',
      slug: 'programming',
      description: 'Learn programming languages and software development',
      color: 'blue',
      icon: 'Code',
      status: 'active',
      display_order: 1,
    },
    {
      id: 2,
      name: 'Mathematics',
      slug: 'mathematics',
      description: 'Master mathematical concepts and problem solving',
      color: 'purple',
      icon: 'Calculator',
      status: 'active',
      display_order: 2,
    },
    {
      id: 3,
      name: 'English Language',
      slug: 'english-language',
      description: 'Improve your English language skills',
      color: 'orange',
      icon: 'BookOpen',
      status: 'active',
      display_order: 3,
    },
    {
      id: 4,
      name: 'Science',
      slug: 'science',
      description: 'Explore physics, chemistry, and biology',
      color: 'green',
      icon: 'Flask',
      status: 'active',
      display_order: 4,
    },
    {
      id: 5,
      name: 'Business & Finance',
      slug: 'business-finance',
      description: 'Learn business management and financial literacy',
      color: 'indigo',
      icon: 'Briefcase',
      status: 'active',
      display_order: 5,
    },
    {
      id: 6,
      name: 'Design',
      slug: 'design',
      description: 'Master graphic design, UI/UX, and creative skills',
      color: 'pink',
      icon: 'Palette',
      status: 'active',
      display_order: 6,
    },
    {
      id: 7,
      name: 'History & Geography',
      slug: 'history-geography',
      description: 'Discover world history and geographical knowledge',
      color: 'yellow',
      icon: 'Globe',
      status: 'active',
      display_order: 7,
    },
    {
      id: 8,
      name: 'Test Preparation',
      slug: 'test-preparation',
      description: 'Prepare for standardized tests and exams',
      color: 'red',
      icon: 'GraduationCap',
      status: 'active',
      display_order: 8,
    },
  ]);
};
