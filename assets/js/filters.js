/**
 * Filter state management and persistence
 */

import { STORAGE_KEY } from "./config.js";

/**
 * Save filters to localStorage
 * @param {string[]} clubs - Selected club values
 * @param {string[]} levels - Selected level ranges
 */
export function saveFilters(clubs, levels) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ clubs, levels }));
}

/**
 * Load filters from localStorage
 * @returns {{clubs: string[], levels: string[]}}
 */
export function loadFilters() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { clubs: [], levels: [] };
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
 * @returns {string}
 */
export function buildFilterSummary(clubs, levels, allClubs) {
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

  return parts.join(" • ");
}
