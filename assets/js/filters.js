/**
 * Filter state management and persistence
 */

import { STORAGE_KEY } from "./config.js";

/**
 * Save filters to localStorage
 * @param {string[]} clubs - Selected club values
 * @param {string[]} levels - Selected level ranges
 * @param {string[]} types - Selected event types
 * @param {string[]} categories - Selected categories
 * @param {string[]} timeBuckets - Selected time buckets
 * @param {number[]} weekdays - Selected weekdays (0-6) or empty array
 */
export function saveFilters(
  clubs,
  levels,
  types,
  categories,
  timeBuckets = [],
  weekdays = [],
) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      clubs,
      levels,
      types,
      categories,
      timeBuckets,
      weekdays,
    }),
  );
}

/**
 * Load filters from localStorage
 * @returns {{clubs: string[], levels: string[], types: string[], categories: string[], timeBuckets: string[], weekdays: number[]}}
 */
export function loadFilters() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data
    ? JSON.parse(data)
    : {
        clubs: [],
        levels: [],
        types: [],
        categories: [],
        timeBuckets: [],
        weekdays: [],
      };
}

/**
 * Get currently selected clubs from UI
 * @param {NodeList} checkboxes - Club checkboxes
 * @returns {string[]}
 */
export function getSelectedClubs(checkboxes) {
  return Array.from(checkboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);
}

/**
 * Build a human-readable summary of active filters
 * @param {string[]} clubs - Selected clubs
 * @param {string[]} levels - Selected levels
 * @param {string[]} types - Selected types
 * @param {string[]} categories - Selected categories
 * @param {string[]} timeBuckets - Selected time buckets
 * @param {number[]} weekdays - Selected weekdays (0-6, 0=Sunday)
 * @returns {string} Filter summary text
 */
export function buildFilterSummary(
  clubs = [],
  levels = [],
  types = [],
  categories = [],
  timeBuckets = [],
  weekdays = [],
) {
  const parts = [];

  if (clubs.length > 0) {
    parts.push(clubs.join(", "));
  }

  if (levels.length > 0) {
    parts.push(levels.join(", "));
  }

  if (types.length > 0) {
    parts.push(types.join(", "));
  }

  if (categories.length > 0) {
    parts.push(categories.join(", "));
  }

  if (timeBuckets.length > 0) {
    parts.push(timeBuckets.join(", "));
  }

  if (weekdays.length > 0) {
    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const selectedDays = weekdays.map((d) => dayNames[d]).join(", ");
    parts.push(selectedDays);
  }

  return parts.length > 0 ? parts.join(" · ") : "No filters applied";
}
