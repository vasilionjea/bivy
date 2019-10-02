#!/usr/bin/env node
'use strict';

const cli = require('./cli');
const search = require('./search');
const { scheduleTask, playSuccessAudio } = require('./utils');
const { getHtml, sendEmail } = require('./mailgun');

/**
 * -------------------------------------------------------------
 * Main module
 * -------------------------------------------------------------
 */
(async function main() {
  const TIMEOUT = cli.interval.hours + cli.interval.minutes;

  // Schedules task at a chosen interval.
  const searchTask = scheduleTask(async () => {
    try {
      await search.perform({
        query: 'yosemite valley',
        arrivalDate: cli.arrival,
        departureDate: cli.departure,
      });
    } catch (err) {
      console.log(err.message);
    }
  }, TIMEOUT);

  // Sends email when sites are found.
  process.on('sites:found', (urls) => {
    searchTask.stop();

    const data = {
      subject: `Bivy found ${urls.length} campsites! ✨`,
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

    playSuccessAudio();
  });

  // Off we go!
  searchTask.start();
}());
