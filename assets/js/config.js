/**
 * Configuration module for Padel Events Calendar
 * Centralizes API endpoints and application settings
 */

export const API_CONFIG = {
  endpoint:
    "https://script.google.com/macros/s/AKfycbwgIl9UntPvaiuLYqczS_PUXSaycq7mNCIBGhbjObDrsPjowctV-Y6RG8pUAAFlC1jC9A/exec",
  city: "bangkok",
};

export const CITY_CONFIG = {
  bangkok: {
    name: "Bangkok",
    timezone: "Asia/Bangkok",
    defaultClubs: [],
  },
};

export const STORAGE_KEY = "padel.filters";

// Timezone offset in hours from UTC (Bangkok = UTC+7)
export const TIMEZONE_OFFSET = 7;

export const GITHUB_API_URL =
  "https://api.github.com/repos/Dylanmo/padelevents/commits/main";
