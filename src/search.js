'use strict';

const chalk = require('chalk');
const { exec } = require('child_process');
const puppeteer = require('puppeteer');
const querystring = require('querystring');
const {
  BASE_URL,
  SEARCH_PATH,
  SELECTORS,
  CAMPGROUNDS,
} = require('./config');

/**
 * -------------------------------------------------------------
 * Async steps to perform a search
 * -------------------------------------------------------------
 */
const steps = {
  async setup() {
    this.browser = await puppeteer.launch({ headless: true });
    this.page = await this.browser.newPage();

    // We want a desktop viewport, which will cause the page's CSS media
    // queries to render the desktop version of the site.
    await this.page.setViewport({ width: 1440, height: 760 });

    // When `skip` is true, the next steps get skipped.
    this.skip = false;

    // Client side functions exposed to the page.
    await this.page.exposeFunction('skip', () => this.skip = true);
  },

  async begin({ query, arrivalDate, departureDate }) {
    console.log(chalk.cyan(`=> Starting search for your dates: ${arrivalDate} - ${departureDate}`));
    await this.page.goto(`${BASE_URL}/${SEARCH_PATH}?q=${querystring.escape(query)}&sort=available&checkin=${arrivalDate}&checkout=${departureDate}`);
  },

  async findBookableCampground() {
    if (this.skip) {
      return;
    }

    console.log(chalk.cyan('=> Searching bookable campground.'));

    await this.page.waitForSelector(SELECTORS.searchResults);
    await this.page.waitFor(5000); // won't work without a wait here
    await this.page.evaluate(async (CAMPGROUNDS) => {
      const availableLinks = [...document.querySelectorAll('.sarsa-button-primary')];
      let foundCount = 0;

      // Check if any of the "View Details" links are from campgrounds we're interested in.
      for (const link of availableLinks) {
        const id = link.href.replace(/\D/g, ''); // extract campground ID

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

    console.log(chalk.cyan('=> Searching available sites.'));

    await this.page.waitForSelector('.availability-component');
    await this.page.click('.availability-component #campground-view-by-site-list');
    await this.page.waitFor(5000);

    return await this.page.evaluate(() => {
      const sites = [...document.querySelectorAll('.campsite-search-left-rail-results .rec-flex-card-wrap')];
      const siteLinks = [];

      for (const site of sites) {
        const bookNowButton = site.querySelector('.sarsa-button-primary');

        if (bookNowButton) {
          const siteLink = site.querySelector('a[aria-label^="Site:"]');

          if (siteLink) {
            siteLinks.push(siteLink.href);
          }
        }
      }

      return siteLinks;
    });
  },

  async done(result = '') {
    await this.page.close();
    await this.browser.close();

    const noResultsMessage = chalk.red('No availability.');
    const resultsMessage = chalk.greenBright(`Bivy found ${result.length} campsites! ✨`);

    if (!result || !result.length) {
      console.log(`${noResultsMessage}\n`);
    } else {
      console.log(`\n${resultsMessage}`);
      console.log(result);
      process.emit('sites:found', result);
    }
  }
};


/**
 * -------------------------------------------------------------
 * The search module
 * -------------------------------------------------------------
 */
module.exports = {
  async perform(params) {
    await steps.setup();
    await steps.begin(params);
    await steps.findBookableCampground();
    await steps.done(await steps.findAvailableSites());
  }
};
