/**
 * Utility functions for DOM manipulation and date formatting
 */

/**
 * Query selector shorthand
 * @param {string} selector - CSS selector
 * @returns {Element|null}
 */
export const qs = (selector) => document.querySelector(selector);

/**
 * Query selector all shorthand
 * @param {string} selector - CSS selector
 * @returns {NodeList}
 */
export const qsa = (selector) => document.querySelectorAll(selector);

/**
 * Format date using Intl.DateTimeFormat
 * @param {Date} date - Date object to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
export function formatDate(date, options) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    ...options,
  }).format(date);
}

/**
 * Format date for Bangkok timezone display
 * @param {Date} date - Date object
 * @param {string} format - 'weekday' | 'date' | 'time' | 'full'
 * @returns {string}
 */
export function formatBangkokDate(date, format = "full") {
  const options = {
    weekday: { weekday: "short", timeZone: "Asia/Bangkok" },
    date: {
      day: "2-digit",
      month: "short",
      timeZone: "Asia/Bangkok",
    },
    time: {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Bangkok",
    },
    full: {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Bangkok",
    },
  };

  return formatDate(date, options[format] || options.full);
}
