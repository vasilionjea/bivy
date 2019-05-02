'use strict';

const program = require('commander');
const VERSION = require('../package.json').version;
const DEFAULT_NIGHTS = 1;
const {
  parseInterval,
  getDefaultArrivalDate,
  getDepartureDate
} = require('./utils');

/**
 * -------------------------------------------------------------
 * CLI options
 * -------------------------------------------------------------
 */
program
  .version(VERSION)
  .option('-a, --arrival [string]', '(optional) Add arrival date', getDefaultArrivalDate())
  .option('-n, --nights [number]', '(optional) Add number of nights', DEFAULT_NIGHTS)
  .option('-i, --interval [string]', '(optional) Add interval with minutes and/or hours to schedule a search', '0min')
  .parse(process.argv);

/**
 * -------------------------------------------------------------
 * The CLI module
 * -------------------------------------------------------------
 */
module.exports = {
  version: VERSION,
  arrival: program.arrival,
  nights: program.nights,
  departure: getDepartureDate(program.arrival, program.nights),
  interval: parseInterval(program.interval)
};
