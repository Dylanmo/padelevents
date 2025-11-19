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

/**
 * Format commit date to match version display format
 * @param {string} isoDate - ISO date string
 * @returns {string} Formatted date (YYYY-MM-DD HH:mm)
 */
export function formatCommitDate(isoDate) {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Detect device type based on user agent
 * @returns {string} 'ios' | 'android' | 'desktop'
 */
export function detectDevice() {
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    return "ios";
  }
  if (/Android/.test(navigator.userAgent)) {
    return "android";
  }
  return "desktop";
}

/**
 * Get time bucket for an event based on local start time
 * @param {string} isoDateString - ISO date string (e.g., "2025-11-18T18:00:00Z")
 * @param {number} timezoneOffset - Timezone offset in hours from UTC (e.g., 7 for Bangkok)
 * @returns {string} 'Morning' | 'Afternoon' | 'Evening' | null
 */
export function getTimeBucket(isoDateString, timezoneOffset = 7) {
  if (!isoDateString) return null;

  const date = new Date(isoDateString);
  // Convert UTC to local time by adding timezone offset
  const utcHours = date.getUTCHours();
  const localHours = (utcHours + timezoneOffset) % 24;

  // Morning: 05:00–11:59
  if (localHours >= 5 && localHours < 12) {
    return "Morning";
  }
  // Afternoon: 12:00–16:59
  if (localHours >= 12 && localHours < 17) {
    return "Afternoon";
  }
  // Evening: 17:00–23:59
  if (localHours >= 17 && localHours < 24) {
    return "Evening";
  }
  // Late night (00:00–04:59) - no bucket
  return null;
}

/**
 * Get weekday index for an event based on local start date
 * @param {string} isoDateString - ISO date string (e.g., "2025-11-18T18:00:00Z")
 * @param {number} timezoneOffset - Timezone offset in hours from UTC (e.g., 7 for Bangkok)
 * @returns {number} Weekday index 0-6 (0=Sunday, 6=Saturday)
 */
export function getWeekdayIndex(isoDateString, timezoneOffset = 7) {
  if (!isoDateString) return null;

  const date = new Date(isoDateString);
  // Adjust UTC date by timezone offset to get local date
  const localDate = new Date(date.getTime() + timezoneOffset * 60 * 60 * 1000);
  return localDate.getUTCDay();
}
