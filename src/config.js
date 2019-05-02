'use strict';

/**
 * -------------------------------------------------------------
 * Configuration module
 * -------------------------------------------------------------
 */
module.exports = {
  BASE_URL: 'https://www.recreation.gov',
  SEARCH_PATH: 'search',

  // Campgrounds we care about
  CAMPGROUNDS: {
    232447: 'UPPER PINES',
    232450: 'LOWER PINES',
    232449: 'NORTH PINES',
  },

  AUDIO_FILE_PLAYER: '/usr/bin/afplay', // available in MacOS machines
  AUDIO_FILE_SUCCESS: '../assets/success.wav',

  SELECTORS: {
    searchResults: '.search-results',
  },
};
