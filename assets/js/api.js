/**
 * API client for fetching clubs and events
 */

import { API_CONFIG, GITHUB_API_URL } from "./config.js";

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
 * @param {string[]} types - Array of event types to filter by
 * @param {string[]} categories - Array of categories to filter by
 * @returns {Promise<{total: number, sample: Array}>}
 */
export async function fetchEvents(
  clubs = [],
  levels = [],
  types = [],
  categories = [],
) {
  let url = `${API_CONFIG.endpoint}?action=preview`;

  if (clubs.length > 0) {
    url += `&clubs=${clubs.join(",")}`;
  }

  if (levels.length > 0) {
    url += `&levels=${levels.join(",")}`;
  }

  if (types.length > 0) {
    url += `&types=${types.join(",")}`;
  }

  if (categories.length > 0) {
    url += `&categories=${categories.join(",")}`;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}

/**
 * Fetch latest commit info from GitHub API
 * @returns {Promise<{sha: string, date: string}>}
 */
export async function fetchLatestCommit() {
  const response = await fetch(GITHUB_API_URL);
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  const data = await response.json();
  return {
    sha: data.sha.substring(0, 7),
    date: data.commit.committer.date,
  };
}
