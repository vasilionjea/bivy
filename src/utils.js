'use strict';

const MINUTE = 60000;
const MINUTE_REGEX = /\d(min)/;
const HOUR = MINUTE * 60;
const HOUR_REGEX = /\d(hr)/;
const TEN_MINUTES = MINUTE * 10;

/**
 * Converts a URL's search path to an object containing the query params.
 *
 * @param {String} searchPath A URL's search path like `?foo=bar&baz=biz`
 * @param {String} [paramName] A param's name that's contained in the search path
 * @returns {Object|String} An object like `{foo: 'bar', baz: 'biz'}` or a query param's value
 */
function getUrlParams(searchPath, paramName) {
  const paramsMap = {};
  const path = decodeURIComponent(searchPath.slice(1)).trim();

  if (path) {
    path.split('&').reduce((paramsMap, pair) => {
      var [key, val] = pair.split('=');
      paramsMap[key] = val;
      return paramsMap;
    }, paramsMap)
  }

  return paramName ? paramsMap[paramName] : paramsMap;
}

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
        console.log(`\n[${now.toLocaleDateString()} ${now.toLocaleTimeString()}] Scheduling task...`);

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
        console.log(`\n[${now.toLocaleDateString()} ${now.toLocaleTimeString()}] Stopping task...`);

        clearInterval(this._timer);
        this._timer = null;
      }

      return this;
    }
  };

  return task;
}

/**
 * Various shared utilities
 * @public
 */
module.exports = {
  getUrlParams,
  minutesToMilliseconds,
  hoursToMilliseconds,
  parseInterval,
  scheduleTask,
};
