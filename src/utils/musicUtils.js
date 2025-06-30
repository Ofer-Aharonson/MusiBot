/**
 * Music utility functions for MusiBot
 */

const { createAudioResource } = require('@discordjs/voice');
const play = require('play-dl');

/**
 * Search YouTube for a song and return the first result
 * @param {string} query - The search query
 * @returns {Object|null} - YouTube video information or null if no results
 */
async function searchYouTube(query) {
  try {
    const results = await play.search(query, { limit: 1 });
    return results.length > 0 ? results[0] : null;
  } catch (error) {
    console.error('Error searching YouTube:', error);
    return null;
  }
}

/**
 * Create an audio resource from a YouTube URL
 * @param {string} url - YouTube video URL
 * @returns {Promise<Object>} - Audio resource
 */
async function createYouTubeAudioResource(url) {
  try {
    const stream = await play.stream(url);
    return createAudioResource(stream.stream, {
      inputType: stream.type
    });
  } catch (error) {
    console.error('Error creating audio resource:', error);
    throw error;
  }
}

module.exports = {
  searchYouTube,
  createYouTubeAudioResource
};
