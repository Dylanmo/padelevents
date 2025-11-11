# Padel Events Calendar — Architecture & File Structure

**Purpose**: Evaluate current inline architecture and recommend file separation for maintainability and future feature expansion.

---

## Current Architecture (As-Is)

### File Structure

```
/
├── index.html          # Single-page app (HTML + inline CSS link + inline JS)
├── assets/
│   └── style.v1.css    # All styles (versioned for cache busting)
├── firebase.json       # Hosting config + cache headers
├── .firebaserc         # Firebase project reference
├── 404.html            # Error page
└── README.md           # Project documentation
```

### Current Pattern: Inline Everything

- **HTML**: All markup in `index.html`
- **CSS**: External file (`assets/style.v1.css`) linked via `<link>`
- **JavaScript**: Inline `<script>` block at bottom of `index.html` (~80 lines)

**Pros**:

- ✅ Zero build tools (works immediately in browser)
- ✅ Simple deployment (single HTML file + CSS)
- ✅ Fast initial setup and prototyping
- ✅ No module bundler or transpilation needed

**Cons**:

- ❌ JavaScript logic mixed with HTML (hard to test/reuse)
- ❌ Adding features increases `index.html` size and complexity
- ❌ No separation of concerns (UI, state, API calls all in one script block)
- ❌ Difficult to collaborate (merge conflicts in single file)
- ❌ No code editor autocomplete/linting for inline JS

---

## Architecture Assessment: Ready for Future Expansion?

### Current Capabilities

✅ **Works well for**:

- Simple single-page apps (< 300 lines total JS)
- Prototypes and MVPs
- Static content with light interactivity

⚠️ **Limitations for future features**:

- Multiple developers editing `index.html` simultaneously → merge conflicts
- Adding search, date-range filters, shareable URLs, ICS generation → inline script grows to 300+ lines
- No test coverage possible (inline JS hard to unit test)
- Browser caching: changing JS requires full HTML reload (can't cache JS separately)

### Verdict

**Current architecture is suitable for Phase 1** (6 core features) but will become **difficult to maintain** as you add:

- Advanced filtering (search, date range, multi-select logic)
- Shareable URLs (query param parsing and state management)
- Analytics or error logging
- A/B testing or feature flags
- Multiple calendar export formats

**Recommendation**: Refactor to separate files **after Phase 1 is complete and tested**, or when inline JS exceeds 200 lines.

---

## Recommended File Structure (Future-Ready)

### Option 1: Minimal Separation (No Build Tools)

Keep the no-build constraint but separate concerns for maintainability.

```
/
├── index.html              # Clean HTML markup only (no inline JS)
├── assets/
│   ├── css/
│   │   └── style.v2.css    # All styles (version bump for cache)
│   └── js/
│       ├── app.js          # Main application logic (ES6 modules)
│       ├── api.js          # API calls and data fetching
│       ├── calendar.js     # Google Calendar + ICS generation
│       ├── filters.js      # Filter UI and state management
│       └── utils.js        # Helper functions (date formatting, etc.)
├── firebase.json
├── .firebaserc
├── 404.html
├── README.md
├── FEATURE_PLAN.md
└── ARCHITECTURE.md
```

**Changes**:

- Move all `<script>` content from `index.html` to `assets/js/app.js`
- Use ES6 modules (`import`/`export`) for separation
- Link in `index.html`:
  ```html
  <script type="module" src="/assets/js/app.js"></script>
  ```
- Modern browsers support ES6 modules natively (no build step needed)

**Pros**:

- ✅ Keeps no-build promise (modules work in modern browsers)
- ✅ Clear separation of concerns (API, UI, state, utilities)
- ✅ Easier to test (can import modules in test files)
- ✅ Better Git collaboration (changes isolated to specific files)
- ✅ Improved caching (JS cached separately from HTML)

**Cons**:

- ❌ No IE11 support (ES6 modules require modern browsers)
- ❌ Slightly more HTTP requests (5 JS files vs 1 inline script, but can be mitigated with HTTP/2)

---

### Option 2: Build-Tool Approach (Future Scalability)

If you anticipate significant feature growth (Phase 3+), consider a lightweight build tool.

```
/
├── src/
│   ├── index.html          # HTML template
│   ├── styles/
│   │   ├── base.css        # Reset and base styles
│   │   ├── components.css  # Reusable components (cards, buttons)
│   │   └── layout.css      # Layout and responsive grid
│   ├── scripts/
│   │   ├── main.js         # Entry point
│   │   ├── api/
│   │   │   └── events.js   # API client
│   │   ├── components/
│   │   │   ├── EventCard.js
│   │   │   ├── FilterPanel.js
│   │   │   └── CalendarExport.js
│   │   └── utils/
│   │       ├── date.js
│   │       └── ics.js
├── dist/                   # Build output (deployed to Firebase)
├── package.json            # Dependencies (Vite or Parcel)
├── vite.config.js          # Build configuration
├── firebase.json
├── .firebaserc
├── README.md
├── FEATURE_PLAN.md
└── ARCHITECTURE.md
```

**Build tool options** (lightweight, minimal config):

- **Vite** (recommended): Fast, modern, zero-config for vanilla JS
- **Parcel**: Zero-config bundler
- **esbuild**: Extremely fast, minimal setup

**Pros**:

- ✅ Component-based architecture (easier to maintain)
- ✅ CSS modules or scoped styles
- ✅ Minification and tree-shaking (smaller bundle size)
- ✅ Hot module reloading (faster development)
- ✅ TypeScript support (if desired)
- ✅ Easy to add testing framework (Vitest, Jest)

**Cons**:

- ❌ Adds build step (breaks "no build tools" constraint)
- ❌ Requires Node.js and npm/yarn
- ❌ Slightly more complex deployment (build → deploy)

---

## Recommended Path Forward

### Phase 1 (Now): Keep Inline JS

- Continue with current inline approach for tasks 1.0–1.6
- Keep all JS in `index.html` `<script>` block
- Monitor JS line count; if it exceeds 200 lines, move to Option 1

### Phase 2 (After Phase 1 Complete): Minimal Separation (Option 1)

- Refactor inline JS to ES6 modules in `assets/js/`
- No build tools; use native browser module support
- File structure:
  ```
  assets/
    js/
      app.js          # Main entry (replaces inline script)
      api.js          # Fetch filters + preview
      calendar.js     # generateICS() + Google Calendar links
      filters.js      # localStorage + UI state
      utils.js        # date formatting, helpers
  ```
- Update `index.html`:
  ```html
  <script type="module" src="/assets/js/app.js"></script>
  ```
- Test thoroughly (especially module imports in Firefox/Safari)

### Phase 3 (If Feature Set Grows Significantly): Add Build Tool (Option 2)

- Only if you plan to add:
  - 10+ new features (search, maps, user accounts, analytics)
  - Team collaboration (multiple contributors)
  - Advanced state management (Redux, Zustand)
  - TypeScript or other transpilation
- Use **Vite** for minimal config and fast dev experience

---

## Migration Plan: Inline → Separated Modules (Option 1)

**When**: After Phase 1 tasks are complete and tested.

**Steps**:

1. Create `assets/js/` directory
2. Move existing `<script>` content to `assets/js/app.js`
3. Extract functions into modules:
   - `api.js`: `loadClubs()`, `onFilter()`, fetch logic
   - `calendar.js`: `gcal()`, `generateICS()`
   - `filters.js`: level button click handler, localStorage save/restore
   - `utils.js`: `qs()`, date formatting
4. Add `export` to functions in modules, `import` in `app.js`
5. Update `index.html`:
   ```html
   <script type="module" src="/assets/js/app.js"></script>
   ```
6. Test in Chrome, Firefox, Safari (ES6 module support)
7. Update `firebase.json` to cache JS files:
   ```json
   {
     "hosting": {
       "headers": [
         {
           "source": "/assets/js/**",
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
8. Version JS files or add content hashes (e.g., `app.v1.js`) for cache busting

**Estimated effort**: 2–3 hours (low risk, incremental changes)

---

## Module Structure Example (Option 1)

### `assets/js/api.js`

```javascript
const API =
  "https://script.google.com/macros/s/AKfycbwgIl9UntPvaiuLYqczS_PUXSaycq7mNCIBGhbjObDrsPjowctV-Y6RG8pUAAFlC1jC9A/exec";

export async function loadClubs() {
  const res = await fetch(API + "?action=filters");
  const { clubs } = await res.json();
  return clubs;
}

export async function fetchPreview(clubs, levels) {
  const url =
    API + `?action=preview&clubs=${clubs.join(",")}&levels=${levels.join(",")}`;
  const res = await fetch(url);
  const { total, sample } = await res.json();
  return { total, sample };
}
```

### `assets/js/calendar.js`

```javascript
export function generateGoogleCalendarLink(event) {
  const toUTC = (iso) => {
    const d = new Date(iso);
    return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}T${String(d.getUTCHours()).padStart(2, "0")}${String(d.getUTCMinutes()).padStart(2, "0")}00Z`;
  };
  const details = [
    event.club && `📍 ${event.club}`,
    event.level && `🥇 ${event.level}`,
  ]
    .filter(Boolean)
    .join(" · ");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${toUTC(event.start)}/${toUTC(event.end)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(event.club || "")}`;
}

export function generateICS(event) {
  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}T${String(d.getUTCHours()).padStart(2, "0")}${String(d.getUTCMinutes()).padStart(2, "0")}00Z`;
  };
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Padel Events Bangkok//EN
BEGIN:VEVENT
UID:${event.id || Date.now()}@padelevents.com
DTSTAMP:${formatDate(new Date().toISOString())}
DTSTART:${formatDate(event.start)}
DTEND:${formatDate(event.end)}
SUMMARY:${event.title}
DESCRIPTION:${event.club} · ${event.level}
LOCATION:${event.club || ""}
END:VEVENT
END:VCALENDAR`;
  return ics;
}

export function downloadICS(event) {
  const ics = generateICS(event);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${event.title.replace(/\s+/g, "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

### `assets/js/filters.js`

```javascript
const STORAGE_KEY = "padel.filters";

export function saveFilters(clubs, levels) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ clubs, levels }));
}

export function loadFilters() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { clubs: [], levels: [] };
}
```

### `assets/js/app.js` (main entry point)

```javascript
import { loadClubs, fetchPreview } from "./api.js";
import { generateGoogleCalendarLink, downloadICS } from "./calendar.js";
import { saveFilters, loadFilters } from "./filters.js";

const qs = (s) => document.querySelector(s);
const selectedLevels = [];

// Initialize app
async function init() {
  const clubs = await loadClubs();
  renderClubChips(clubs);

  // Restore saved filters
  const saved = loadFilters();
  restoreFilters(saved);

  // Auto-load 2-week events
  await autoLoadEvents();
}

// ... rest of app logic

document.addEventListener("DOMContentLoaded", init);
```

---

## Conflict Check: New Features vs Existing Plan

### ✅ No Conflicts Detected

**New additions integrate smoothly**:

1. **Git branching** → Enhances workflow, no code conflicts
2. **Auto-load 2-week events** → Replaces manual filter trigger, compatible with existing filter logic
3. **ICS export** → Adds new function alongside existing Google Calendar link, no conflicts
4. **Visual filter highlights** → CSS-only enhancement, compatible with existing filter UI
5. **Filter persistence as nice-to-have** → Deferred to later, no blocking issues
6. **File structure recommendation** → Future refactor, doesn't impact Phase 1 implementation

**Adjustments made**:

- Moved filter persistence (1.3) to "nice-to-have" status (task 1.4) to prioritize auto-load and ICS export
- Added auto-load as task 1.0 (highest priority)
- Renumbered tasks to reflect new priority order

---

## Recommended Next Steps

1. **Review updated `FEATURE_PLAN.md`** — Confirm task order and priorities
2. **Set up git branching workflow** — Create first feature branch for task 1.0
3. **Implement Phase 1 tasks** — Start with 1.0 (auto-load) and 1.1 (mobile cards)
4. **Monitor JS complexity** — If inline script exceeds 200 lines during Phase 1, migrate to Option 1 (ES6 modules)
5. **Plan Phase 2 refactor** — After Phase 1 is live, refactor to separated modules for maintainability

**Questions?**

- Do you want to proceed with inline JS for Phase 1, or move to ES6 modules now?
- Are there specific features planned beyond Phase 2 that might require a build tool?
- Do you have a preferred git branching workflow (feature branches, trunk-based, GitFlow)?

---

## Extended Documentation

For a more detailed, actionable proposal including multi-city expansion strategy, file structure recommendations, and step-by-step migration guidance, see:

- **[docs/PROPOSED_ARCHITECTURE.md](docs/PROPOSED_ARCHITECTURE.md)** — Future-proof file structure and multi-city support
- **[docs/MIGRATION_PLAN.md](docs/MIGRATION_PLAN.md)** — Step-by-step migration from inline JS to ES6 modules

These documents provide concrete implementation guidance for Phase 2 optimization.

```

```
