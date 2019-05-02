'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const { exec } = require('child_process');
const { AUDIO_FILE_PLAYER, AUDIO_FILE_SUCCESS } = require('./config');

const MINUTE = 60000;
const MINUTE_REGEX = /\d(min)/;
const HOUR = MINUTE * 60;
const HOUR_REGEX = /\d(hr)/;
const TEN_MINUTES = MINUTE * 10;

/**
 * @param {Number} minutes An integer representing minutes
 * @returns {Number} The equivalent milliseconds for the minutes
 */
function minutesToMilliseconds(minutes = 0) {
  return MINUTE * minutes;
}

/**
 * @param {Number} hours An integer representing hours
 * @returns {Number} The equivalent milliseconds for the hours
 */
function hoursToMilliseconds(hours = 0) {
  return HOUR * hours;
}

/**
 * Parses an interval pattern like "1hr 30min" to an object containing the
 * respective millisecond values.
 *
 * @param {String} pattern A pattern like "1hr 30min"
 * @returns {Object} An object like `{hours: 3600000, minutes: 1800000}`
 */
function parseInterval(pattern = '') {
  const parts = pattern.trim().split(/\s+/);
  let hours = 0, minutes = 0;

  for (const part of parts) {
    if (HOUR_REGEX.test(part)) {
      hours = parseInt(part);
    } else if (MINUTE_REGEX.test(part)) {
      minutes = parseInt(part);
    }
  }

  return {
    hours: hoursToMilliseconds(hours),
    minutes: minutesToMilliseconds(minutes)
  };
}

/**
 * Formats date into the correct string format.
 * @param {Date}
 */
function formatDate(date) {
  const month = date.getMonth() + 1;
  const monthDay = date.getDate();
  const year = date.getFullYear();

  return `${month}/${monthDay}/${year}`;
}

/**
 * The park's website disallows booking sites before two days ahead, so the
 * default arrival date is always set to two days ahead. For example, if
 * today's date is `Jan 1st`, you can book a site starting on `Jan 3d`.
 */
function getDefaultArrivalDate() {
  const today = new Date();
  const date = new Date(today.getTime());
  date.setDate(today.getDate() + 2);

  return formatDate(date);
}

/**
 * Returns a departure date string, which depends on the arrival date
 * and the number of nights.
 *
 * @param {Date} arrivalStr  A string date like "10/13/2018"
 * @param {Number} nights Number of nights to stay
 * @returns {Date}
 */
function getDepartureDate(arrivalStr, nights) {
  // TODO: allow passing an arrivalStr without the year, assume current year.
  const arrival = new Date(arrivalStr);
  const departure = new Date(arrival.getTime());
  departure.setDate(arrival.getDate() +  Math.abs(parseInt(nights)));

  return formatDate(departure);
}

/**
 * Schedules a callback function to run at a specific interval.
 *
 * @param {Function} callback The function to run
 * @param {Number} timeout The interval in milliseconds (must be at least 10 minutes)
 * @returns {Object} A "task" object to manage the execution
 */
function scheduleTask(callback, timeout = 0) {
  const task = {
    _timer: null,

    start() {
      if (callback && !this._timer && timeout >= TEN_MINUTES) {
        const now = new Date();

        const startMessage = chalk.black(`[${now.toLocaleDateString()} ${now.toLocaleTimeString()}] Scheduling task.`);
        console.log(`${chalk.bgCyanBright(startMessage)}`);

        this._timer = setInterval(callback.bind(this), timeout);
      }

      // The callback is always called, even if it's not scheduled at an interval.
      // If it's scheduled at an interval, it will run once immediately.
      callback.call(this);

      return this;
    },

    stop() {
      if (this._timer) {
        const now = new Date();

        const stopMessage = chalk.cyan(`[${now.toLocaleDateString()} ${now.toLocaleTimeString()}] Stopping task.`);
        console.log(`\n${stopMessage}`);

        clearInterval(this._timer);
        this._timer = null;
      }

      return this;
    }
  };

  return task;
}

/**
 * Plays audio file using system's player (afplay for MacOS)
 */
function playSuccessAudio() {
  const file = path.resolve(__dirname, AUDIO_FILE_SUCCESS);

  // Check if the file exists
  fs.access(file, fs.constants.F_OK, (err) => {
    if (!err) {
      exec(`${AUDIO_FILE_PLAYER} ${file}`);
    }
  });
}


/**
 * -------------------------------------------------------------
 * The utils module
 * -------------------------------------------------------------
 */
module.exports = {
  minutesToMilliseconds,
  hoursToMilliseconds,
  parseInterval,
  formatDate,
  getDefaultArrivalDate,
  getDepartureDate,
  scheduleTask,
  playSuccessAudio
};
