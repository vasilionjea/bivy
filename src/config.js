'use strict';

module.exports = {
  BASE_URL: 'https://www.recreation.gov',
  SEARCH_PATH: 'unifSearch.do',

  // Campgrounds we care about
  CAMPGROUNDS: {
    70925: 'UPPER PINES',
    70928: 'LOWER PINES',
    70927: 'NORTH PINES',
  },

  SELECTORS: {
    searchInput: '#locationCriteria',
    searchSubmit: '.searchIconBtn',
    searchResults: '#search_results_list',
  },
};
