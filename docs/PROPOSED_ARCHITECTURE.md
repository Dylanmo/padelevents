# Padel Events — Proposed Architecture for Multi-City Expansion

## Executive Summary

This document outlines a future-proof file structure that supports:

- **Multi-city expansion** (Bangkok → Chiang Mai, Phuket, etc.)
- **Modular JavaScript** (separate concerns without heavy tooling)
- **Dynamic data sources** (scraping padel apps/sites, integrated sign-ups)
- **Faster development cycles** (easier testing, quicker changes)
- **Clean separation of documentation** (dedicated docs folder)

**Phase 2 Recommendation**: Migrate to ES6 modules (no build tool) for immediate benefits with minimal risk.

---

## Goals

1. **Multi-City Support**: Structure files so adding a new city requires minimal changes
2. **Modularity**: Separate API, UI, calendar logic, and utilities into discrete files
3. **Testability**: Enable unit tests for calendar generation, date formatting, filter logic
4. **Speed**: Improve caching (separate JS files) and reduce merge conflicts
5. **Maintainability**: Make it easy to add features without growing `index.html`
6. **Future-Ready**: Provide a clear path to build tools (Vite) if needed later

---

## Proposed File Structure (Phase 2 — No Build Tools)

```
padel-events/
├── index.html                    # HTML markup only (no inline JS)
├── assets/
│   ├── css/
│   │   └── style.v2.css          # All styles (version bump)
│   └── js/
│       ├── app.js                # Main entry point (ES6 module)
│       ├── api.js                # API client (fetch events, clubs)
│       ├── calendar.js           # Google Calendar + ICS generation
│       ├── filters.js            # Filter state & persistence
│       ├── utils.js              # Shared utilities (qs, date formatting)
│       └── config.js             # Configuration (API endpoints, city config)
├── docs/
│   ├── PROPOSED_ARCHITECTURE.md  # This file
│   ├── MIGRATION_PLAN.md         # Step-by-step migration guide
│   └── MULTI_CITY_STRATEGY.md    # Multi-city implementation notes
├── tests/                        # Unit tests (optional Phase 3)
│   ├── calendar.test.js
│   └── filters.test.js
├── firebase.json                 # Hosting config + cache headers
├── .firebaserc                   # Firebase project
├── package.json                  # Dev dependencies (linters, formatters)
├── README.md                     # User-facing documentation
├── ARCHITECTURE.md               # Architecture overview (links here)
└── FEATURE_PLAN.md               # Feature roadmap
```

### Key Changes from Current Structure

1. **`assets/js/` folder created** — All JavaScript extracted from `index.html`
2. **`docs/` folder created** — Dedicated documentation directory
3. **`tests/` folder (optional)** — Unit tests for critical functions
4. **`config.js`** — Centralized configuration for multi-city support

---

## Module Breakdown

### `assets/js/app.js` (Entry Point)

**Purpose**: Main application orchestrator. Imports other modules and initializes the app.

```javascript
import { loadClubs, fetchEvents } from "./api.js";
import { generateGoogleCalendarLink, downloadICS } from "./calendar.js";
import { saveFilters, loadFilters } from "./filters.js";
import { qs, qsa } from "./utils.js";

// App initialization
async function init() {
  await loadClubs();
  await autoLoadEvents();
  attachEventListeners();
}

document.addEventListener("DOMContentLoaded", init);
```

---

### `assets/js/api.js` (API Client)

**Purpose**: All API calls and data fetching logic.

```javascript
import { API_CONFIG } from "./config.js";

export async function loadClubs() {
  const res = await fetch(`${API_CONFIG.endpoint}?action=filters`);
  if (!res.ok) throw new Error("Failed to load clubs");
  const { clubs } = await res.json();
  return clubs;
}

export async function fetchEvents(clubs, levels) {
  let url = `${API_CONFIG.endpoint}?action=preview`;
  if (clubs.length) url += `&clubs=${clubs.join(",")}`;
  if (levels.length) url += `&levels=${levels.join(",")}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("API request failed");
  return res.json();
}
```

**Future**: Add separate functions for scraping external padel apps/sites.

---

### `assets/js/calendar.js` (Calendar Export)

**Purpose**: Google Calendar link generation and ICS file download.

```javascript
export function generateGoogleCalendarLink(event) {
  const toUTC = (iso) => {
    const d = new Date(iso);
    return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}...`;
  };
  const details = [
    event.club && `📍 ${event.club}`,
    event.level && `🥇 ${event.level}`,
  ]
    .filter(Boolean)
    .join(" · ");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${toUTC(event.start)}/${toUTC(event.end)}...`;
}

export function generateICS(event) {
  // ... (existing ICS generation logic)
}

export function downloadICS(event) {
  const ics = generateICS(event);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, "-")}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
```

**Testable**: Unit tests can verify ICS format and date conversion.

---

### `assets/js/filters.js` (Filter State)

**Purpose**: Manage filter UI state and localStorage persistence.

```javascript
const STORAGE_KEY = "padel.filters";

export function saveFilters(clubs, levels) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ clubs, levels }));
}

export function loadFilters() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { clubs: [], levels: [] };
}

export function restoreFilters(saved) {
  // Restore UI state from saved filters
}
```

---

### `assets/js/utils.js` (Utilities)

**Purpose**: Shared helper functions.

```javascript
export const qs = (s) => document.querySelector(s);
export const qsa = (s) => document.querySelectorAll(s);

export function formatDate(date, options) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    ...options,
  }).format(date);
}
```

---

### `assets/js/config.js` (Configuration)

**Purpose**: Centralized config for multi-city support.

```javascript
export const API_CONFIG = {
  endpoint:
    "https://script.google.com/macros/s/AKfycbwgIl9UntPvaiuLYqczS_PUXSaycq7mNCIBGhbjObDrsPjowctV-Y6RG8pUAAFlC1jC9A/exec",
  city: "bangkok", // 'bangkok', 'chiang-mai', 'phuket'
};

export const CITY_CONFIG = {
  bangkok: {
    name: "Bangkok",
    timezone: "Asia/Bangkok",
    defaultClubs: [],
  },
  "chiang-mai": {
    name: "Chiang Mai",
    timezone: "Asia/Bangkok",
    defaultClubs: [],
  },
};
```

**Future**: URL routing can set `API_CONFIG.city` dynamically (`/bangkok`, `/chiang-mai`).

---

## Multi-City Expansion Strategy

### Option A: Single Deployment, Dynamic City Selection

**File Structure** (no changes needed):

```
padel-events/
├── index.html
└── assets/js/config.js  # Contains city configs
```

**Implementation**:

1. Add city selector dropdown in UI (or auto-detect from URL path)
2. Update `API_CONFIG.city` based on user selection
3. Fetch clubs/events for selected city from API
4. Use different Google Apps Script endpoints per city (or add `city` param to API)

**Pros**:

- Single codebase for all cities
- Easy to maintain (one deployment)
- Users can switch cities without leaving the app

**Cons**:

- All city data loads from one API (may need multi-region endpoints)

---

### Option B: Separate Deployments per City

**File Structure**:

```
padel-events/
├── cities/
│   ├── bangkok/
│   │   ├── index.html
│   │   └── config.js   # Bangkok-specific API endpoint
│   ├── chiang-mai/
│   │   ├── index.html
│   │   └── config.js   # Chiang Mai-specific API endpoint
│   └── phuket/
│       ├── index.html
│       └── config.js
└── assets/  # Shared assets (JS modules, CSS)
```

**Implementation**:

1. Deploy separate Firebase Hosting sites per city
2. Each city has its own `index.html` + `config.js`
3. Share `assets/js/` modules across all cities

**Pros**:

- Better SEO (separate domains: `bangkok.padelevents.com`, `chiangmai.padelevents.com`)
- Faster load times (regional CDN caching)
- Independent deployment per city

**Cons**:

- More complex deployment (multiple Firebase projects or multi-site hosting)

**Recommendation**: Start with **Option A** (single deployment, dynamic selection). Move to Option B only if you need separate domains or regional performance optimization.

---

## Dynamic Data Collection Strategy

### Current: Static API Endpoint

- Google Apps Script returns pre-aggregated event data
- Manual updates to backend script when new clubs/events added

### Future: Dynamic Scraping & API Integration

**Architecture**:

```
Firebase Functions (or Cloud Run)
  ↓
Scraper Service
  ├── Padel App 1 (e.g., Deuce, Rally)
  ├── Padel App 2 (e.g., CourtReserve)
  └── Club Websites (BeautifulSoup, Puppeteer)
  ↓
Firestore Database
  ├── events collection
  └── clubs collection
  ↓
Frontend (index.html + assets/js/api.js)
```

**Implementation Steps** (Phase 3+):

1. **Add Firebase Functions** (or Google Cloud Run) for scraping
2. **Store scraped data in Firestore** (NoSQL database)
3. **Update `api.js`** to fetch from Firestore instead of Google Apps Script
4. **Add scheduled scraping** (Cloud Scheduler) to update events daily
5. **Integrate deep links** for event sign-up (link directly to Deuce/Rally app)

**Benefits**:

- Automated data collection (no manual updates)
- Real-time event availability
- Player count and sign-up status
- Direct sign-up links to external apps

**Costs**:

- Firebase Functions usage (free tier: 2M invocations/month)
- Firestore reads/writes (free tier: 50k reads, 20k writes per day)
- Cloud Scheduler (first 3 jobs free)

---

## Testing Strategy

### Phase 2: Manual Testing

- Test in Chrome, Firefox, Safari on desktop + mobile
- Verify ICS download works on iOS (Apple Calendar), Android (Google Calendar)
- Check localStorage persistence across sessions

### Phase 3: Automated Unit Tests

**Test Framework**: Vitest (fast, Vite-native) or Jest

**Test Files**:

```
tests/
├── calendar.test.js       # Test ICS generation, date conversion
├── filters.test.js        # Test localStorage save/load
└── utils.test.js          # Test date formatting, helper functions
```

**Example Test** (`tests/calendar.test.js`):

```javascript
import { describe, it, expect } from "vitest";
import { generateICS } from "../assets/js/calendar.js";

describe("generateICS", () => {
  it("generates valid ICS format", () => {
    const event = {
      title: "Padel Match",
      start: "2025-11-15T18:00:00+07:00",
      end: "2025-11-15T20:00:00+07:00",
      club: "Thonglor Padel",
      level: "3-4",
    };
    const ics = generateICS(event);
    expect(ics).toContain("BEGIN:VCALENDAR");
    expect(ics).toContain("SUMMARY:Padel Match");
    expect(ics).toContain("LOCATION:Thonglor Padel");
  });
});
```

**Run Tests**:

```bash
npm test
```

---

## Caching & Performance

### Updated `firebase.json`

```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "/index.html",
        "headers": [{ "key": "Cache-Control", "value": "no-cache" }]
      },
      {
        "source": "/assets/css/*.css",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public,max-age=31536000,immutable"
          }
        ]
      },
      {
        "source": "/assets/js/**/*.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public,max-age=31536000,immutable"
          }
        ]
      }
    ]
  }
}
```

**Cache Strategy**:

- **HTML**: No cache (always fetch latest)
- **CSS/JS**: Cache for 1 year (immutable) — update filename when changed (e.g., `style.v2.css`)

---

## Documentation Organization

### `docs/` Folder Contents

```
docs/
├── PROPOSED_ARCHITECTURE.md     # This file
├── MIGRATION_PLAN.md            # Step-by-step migration guide
├── MULTI_CITY_STRATEGY.md       # Multi-city implementation notes
├── API_INTEGRATION.md           # Guide for integrating external APIs/scrapers
└── DEPLOYMENT.md                # Deployment checklist and Firebase setup
```

**Purpose**: Keep technical documentation separate from user-facing `README.md`.

---

## Migration Timeline

### Phase 2: Module Extraction (Recommended Next)

- **Duration**: 1–2 days
- **Risk**: Low (no build tool, incremental changes)
- **Benefits**: Immediate code organization improvements, better caching

### Phase 3: Multi-City Support

- **Duration**: 1 week
- **Risk**: Medium (requires API changes or routing logic)
- **Benefits**: Expand to new markets with minimal code duplication

### Phase 4: Dynamic Data & Scraping

- **Duration**: 2–3 weeks
- **Risk**: High (new backend services, scraping complexity)
- **Benefits**: Fully automated event updates, real-time availability

### Phase 5 (Optional): Build Tool Migration

- **Duration**: 2–3 days
- **Risk**: Low (if code is already modular)
- **Benefits**: TypeScript support, HMR, advanced tooling

---

## Summary

**Immediate Next Step**: Migrate to ES6 modules (Phase 2) using the [Migration Plan](MIGRATION_PLAN.md).

**Long-Term Vision**:

- Multi-city support via dynamic config or separate deployments
- Automated event scraping from padel apps and club websites
- Direct sign-up integration (deep links to booking platforms)
- Unit tests for critical business logic

**Key Principles**:

- Start small (ES6 modules, no build tool)
- Iterate quickly (test in production with real users)
- Plan for scale (modular architecture, clear separation of concerns)
- Document everything (keep docs/ up to date as you build)

---

**Questions or feedback?** See [MIGRATION_PLAN.md](MIGRATION_PLAN.md) for next steps.
