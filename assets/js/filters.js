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
 */
export function saveFilters(clubs, levels, types, categories) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ clubs, levels, types, categories }),
  );
}

/**
 * Load filters from localStorage
 * @returns {{clubs: string[], levels: string[], types: string[], categories: string[]}}
 */
export function loadFilters() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data
    ? JSON.parse(data)
    : { clubs: [], levels: [], types: [], categories: [] };
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
 * Build filter summary text for display
 * @param {string[]} clubs - Selected club values
 * @param {string[]} levels - Selected level ranges
 * @param {Array<{value: string, label: string}>} allClubs - All available clubs
 * @param {string[]} types - Selected event types
 * @param {string[]} categories - Selected categories
 * @returns {string}
 */
export function buildFilterSummary(
  clubs,
  levels,
  allClubs,
  types = [],
  categories = [],
) {
  const parts = [];

  if (clubs.length === 0) {
    parts.push("All clubs");
  } else if (clubs.length === 1) {
    const club = allClubs.find((c) => c.value === clubs[0]);
    parts.push(club ? club.label : clubs[0]);
  } else {
    parts.push(`${clubs.length} clubs`);
  }

  if (levels.length === 0) {
    parts.push("All levels");
  } else if (levels.length === 1) {
    parts.push(`Level ${levels[0]}`);
  } else {
    parts.push(`${levels.length} levels`);
  }

  if (types.length === 0) {
    parts.push("All types");
  } else if (types.length === 1) {
    parts.push(types[0]);
  } else {
    parts.push(`${types.length} types`);
  }

  if (categories.length === 0) {
    parts.push("All categories");
  } else if (categories.length === 1) {
    parts.push(categories[0]);
  } else {
    parts.push(`${categories.length} categories`);
  }

  return parts.join(" • ");
}
