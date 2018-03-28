#!/usr/bin/env node
'use strict';

const cli = require('./cli');
const search = require('./search');
const { scheduleTask } = require('./utils');
const { sendEmail, getHtml } = require('./mailgun');

/**
 * Entry point
 * @module Main
 */
(async function main() {
  const TIMEOUT = cli.interval.hours + cli.interval.minutes;

  // Schedules task at a chosen interval.
  const searchTask = scheduleTask(async () => {
    try {
      await search.perform({
        query: 'yosemite valley, ca',
        arrivalDate: cli.dates.arrival,
        departureDate: cli.dates.departure,
      });
    } catch (err) {
      this.stop();
      console.log(err.message);
    }
  }, TIMEOUT);

  // Sends email when sites are found.
  process.on('sites:found', (urls) => {
    searchTask.stop();

    const data = {
      subject: `Bivy found ${urls.length} sites!`,
      html: getHtml(urls)
    };

    sendEmail(data, (error, body) => {
      let msg;
      if (error) {
        msg = `Mailgun ${error}`;
      } else {
        msg = 'Email was sent!';
      }
      console.log(`\n${msg}\n`);
    });
  });

  // Off we go!
  searchTask.start();
}());
