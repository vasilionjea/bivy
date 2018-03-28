'use strict';

const puppeteer = require('puppeteer');
const { getUrlParams } = require('./utils');
const {
  BASE_URL,
  SEARCH_PATH,
  SELECTORS,
  CAMPGROUNDS,
} = require('./config');

/**
 * Async steps to perform a search.
 * @private
 */
const steps = {
  async setup() {
    this.browser = await puppeteer.launch({ headless: true });
    this.page = await this.browser.newPage();

    // We want a desktop viewport, which will cause the page's CSS media
    // queries to render the desktop version of the site.
    await this.page.setViewport({ width: 1440, height: 720 });

    // When `skip` is true, the next steps get skipped.
    this.skip = false;

    // Client side functions exposed to the page.
    await this.page.exposeFunction('skip', () => this.skip = true);
    await this.page.exposeFunction('getUrlParams', getUrlParams);
  },

  async begin(query) {
    await this.page.goto(`${BASE_URL}/${SEARCH_PATH}`);
    await this.page.type(SELECTORS.searchInput, query);
    await this.page.click(SELECTORS.searchSubmit);
  },

  async setCampingInterest() {
    console.log('=> Setting camping interest...');

    await this.page.waitForSelector('#category_filter');
    await this.page.evaluate(() => {
      const campingRadioButton = document.querySelector('#rb_category_camping');
      if (!campingRadioButton) {
        skip();
      } else {
        campingRadioButton.click();
      }
    });
  },

  async fillInDates(arrivalDate, departureDate) {
    if (this.skip) {
      return;
    }

    console.log('=> Filling in dates...');

    await this.page.waitForSelector('#availability_filter');
    await this.page.type('#arrivalDate', arrivalDate);
    await this.page.type('#departureDate', departureDate);
    await this.page.click('#availability_content [title="Check Dates"]');
  },

  async findBookableCampground() {
    if (this.skip) {
      return;
    }

    console.log('=> Searching bookable campground...');

    await this.page.waitForSelector(SELECTORS.searchResults);
    await this.page.waitFor(3000); // won't work without a wait here
    await this.page.evaluate(async (CAMPGROUNDS) => {
      const availableLinks = [...document.querySelectorAll('.book_now')];
      let foundCount = 0;

      // Check if any of the "Book Now" links are from
      // campgrounds we're interested in.
      for (const link of availableLinks) {
        const id = await getUrlParams(link.search, 'parkId');

        if (CAMPGROUNDS[id]) {
          foundCount += 1;
          link.click();
          break;
        }
      }

      if (foundCount === 0) {
        skip();
      }
    }, CAMPGROUNDS);
  },

  async findAvailableSites() {
    if (this.skip) {
      return;
    }

    console.log('=> Searching available sites...');

    await this.page.waitForSelector('#shoppingitems');
    return await this.page.evaluate(() => {
      const sites = [...document.querySelectorAll('#shoppingitems tbody .book.now')];
      return sites.map(bookLink => bookLink.href);
    });
  },

  async done(result = '') {
    await this.page.close();
    await this.browser.close();

    if (!result || !result.length) {
      console.log('No availability.\n');
    } else {
      console.log(`\nFound ${result.length} sites!`);
      console.log(result);
      process.emit('sites:found', result);
    }
  }
};

/**
 * Search module.
 * @public
 */
module.exports = {
  async perform({ query, arrivalDate, departureDate }) {
    console.log(`=> Starting search for your dates... ${arrivalDate} - ${departureDate}`);
    await steps.setup();
    await steps.begin(query);
    await steps.setCampingInterest();
    await steps.fillInDates(arrivalDate, departureDate);
    await steps.findBookableCampground();
    await steps.done(await steps.findAvailableSites());
  }
};
