/**
 * Slug Generator Utility
 * Generates URL-friendly slugs from text
 */

/**
 * Generate slug from text
 * @param {string} text - Text to slugify
 * @returns {string} URL-friendly slug
 */
function generateSlug(text) {
  if (!text) {
    throw new Error('Text is required for slug generation');
  }

  return text
    .toString()
    .toLowerCase()
    .trim()
    // Replace spaces with -
    .replace(/\s+/g, '-')
    // Remove all non-word chars except -
    .replace(/[^\w\-]+/g, '')
    // Replace multiple - with single -
    .replace(/\-\-+/g, '-')
    // Remove - from start and end
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Generate unique slug by appending counter if needed
 * @param {string} text - Base text
 * @param {Function} checkExists - Async function to check if slug exists
 * @returns {Promise<string>} Unique slug
 */
async function generateUniqueSlug(text, checkExists) {
  let slug = generateSlug(text);
  let counter = 1;
  let originalSlug = slug;

  // Check if slug exists and increment counter if needed
  while (await checkExists(slug)) {
    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Validate slug format
 * @param {string} slug - Slug to validate
 * @returns {boolean} True if valid
 */
function isValidSlug(slug) {
  if (!slug) return false;

  // Must be lowercase, alphanumeric with hyphens only
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugPattern.test(slug);
}

module.exports = {
  generateSlug,
  generateUniqueSlug,
  isValidSlug,
};
