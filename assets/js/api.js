/**
 * API client for fetching clubs and events
 */

import { API_CONFIG } from "./config.js";

/**
 * Load available clubs from API
 * @returns {Promise<Array<{value: string, label: string}>>}
 */
export async function loadClubs() {
  const response = await fetch(`${API_CONFIG.endpoint}?action=filters`);
  if (!response.ok) {
    throw new Error("Failed to load clubs");
  }
  const { clubs } = await response.json();
  return clubs;
}

/**
 * Fetch events with optional filters
 * @param {string[]} clubs - Array of club values to filter by
 * @param {string[]} levels - Array of level ranges to filter by
 * @returns {Promise<{total: number, sample: Array}>}
 */
export async function fetchEvents(clubs = [], levels = []) {
  let url = `${API_CONFIG.endpoint}?action=preview`;

  if (clubs.length > 0) {
    url += `&clubs=${clubs.join(",")}`;
  }

  if (levels.length > 0) {
    url += `&levels=${levels.join(",")}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}
