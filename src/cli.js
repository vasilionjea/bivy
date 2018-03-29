'use strict';

const program = require('commander');
const VERSION = require('../package.json').version;
const { parseInterval } = require('./utils');
const today = new Date();
const DEFAULT_NIGHTS = 1;

/**
 * The park's website disallows booking sites before two days ahead, so the
 * default arrival date is always set to two days ahead. For example, if
 * today's date is `Jan 1st`, you can book a site starting on `Jan 3d`.
 */
const DEFAULT_ARRIVAL_DATE = new Date(today.getTime());
DEFAULT_ARRIVAL_DATE.setDate(today.getDate() + 2);

/**
 * Returns a departure date string, which depends on the arrival date
 * and the number of nights.
 *
 * @param {Date} arrivalStr  A string date like "Sat Mar 24 2018"
 * @param {Number} nights Number of nights to stay
 * @returns {Date}
 */
function getDepartureDate(arrivalStr, nights) {
  // TODO: allow passing an arrivalStr without the year, assume current year.
  const arrival = new Date(arrivalStr);
  const departure = new Date(arrival.getTime());
  departure.setDate(arrival.getDate() +  Math.abs(parseInt(nights)));

  return departure;
}

// Set the CLI options.
program
  .version(VERSION)
  .option('-a, --arrival [date]', '(optional) Add arrival date', DEFAULT_ARRIVAL_DATE.toDateString())
  .option('-n, --nights [number]', '(optional) Add number of nights', DEFAULT_NIGHTS)
  .option('-i, --interval [string]', '(optional) Add interval with minutes and/or hours to schedule a search', '0min')
  .parse(process.argv);

/**
 * The CLI module
 * @module CLI
 */
module.exports = {
  version: VERSION,
  interval: parseInterval(program.interval),
  dates: {
    arrival: program.arrival,
    nights: program.nights,
    departure: getDepartureDate(program.arrival, program.nights).toDateString(),
    today: today.toDateString(),
  }
};
