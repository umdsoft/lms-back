/**
 * Video URL Processor
 * Processes video URLs (YouTube, direct) and generates embed URLs
 */

/**
 * Process video URL to determine type and generate embed URL
 * @param {string} url - Video URL
 * @returns {object} { type, videoId?, embedUrl, originalUrl }
 */
function processVideoUrl(url) {
  if (!url) {
    throw new Error('Video URL is required');
  }

  // YouTube patterns
  const youtubePatterns = [
    // https://www.youtube.com/watch?v=VIDEO_ID
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // https://youtu.be/VIDEO_ID
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // https://www.youtube.com/embed/VIDEO_ID
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // https://www.youtube.com/v/VIDEO_ID
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];

  // Check if URL matches any YouTube pattern
  for (const pattern of youtubePatterns) {
    const match = url.match(pattern);
    if (match) {
      const videoId = match[1];
      return {
        type: 'youtube',
        videoId,
        embedUrl: `https://www.youtube.com/embed/${videoId}`,
        originalUrl: url,
      };
    }
  }

  // If not YouTube, treat as direct video URL
  return {
    type: 'direct',
    embedUrl: url,
    originalUrl: url,
  };
}

/**
 * Validate video URL
 * @param {string} url - Video URL
 * @returns {boolean} True if valid
 */
function isValidVideoUrl(url) {
  if (!url) return false;

  try {
    const processed = processVideoUrl(url);
    return !!(processed.embedUrl);
  } catch (error) {
    return false;
  }
}

/**
 * Extract YouTube video ID from URL
 * @param {string} url - YouTube URL
 * @returns {string|null} Video ID or null
 */
function extractYouTubeId(url) {
  if (!url) return null;

  try {
    const processed = processVideoUrl(url);
    return processed.type === 'youtube' ? processed.videoId : null;
  } catch (error) {
    return null;
  }
}

module.exports = {
  processVideoUrl,
  isValidVideoUrl,
  extractYouTubeId,
};
