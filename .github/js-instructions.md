---
applyTo:
  - "assets/js/**/*.js"
---

JavaScript Guidelines — padel-events

Purpose

- Practical JS best practices for a modular, frontend-only project using ES6 modules (no build tools).
- Enforce patterns that work well with GitHub Copilot for consistent, testable, secure code.

Project constraints

- Native ES6 modules (`type="module"`) in separate files under `assets/js/`
- Zero build tools — no bundlers, transpilers, or npm-based toolchains
- Vanilla JavaScript only; avoid large dependencies

Contract

- Inputs: changes to JS modules, API interactions, DOM updates
- Outputs: readable, testable, modular JS that follows style rules and avoids security issues

## Module Organization

**File structure**:

```
assets/js/
├── app.js           # Main entry point, orchestrates app initialization
├── api.js           # All API calls and data fetching
├── calendar.js      # Google Calendar + ICS generation
├── filters.js       # Filter state management & persistence
├── utils.js         # Shared utilities (qs, date formatting)
└── config.js        # Configuration (API endpoints, constants)
```

**Rules**:

- One module per concern (API ≠ DOM ≠ utilities)
- File naming: kebab-case for multi-word files (`calendar-utils.js`)
- Keep modules focused: if a file exceeds ~200 lines, consider splitting

## Import/Export Patterns

**Prefer named exports** (better for Copilot autocomplete, tree-shaking, refactoring):

```javascript
// ✅ GOOD - Named exports in utils.js
export const qs = (s) => document.querySelector(s);
export const qsa = (s) => document.querySelectorAll(s);
export function formatDate(date, options) {
  /* ... */
}

// Import specific items
import { qs, qsa, formatDate } from "./utils.js";
```

**Use default exports** only for single-purpose modules:

```javascript
// ✅ OK - Single class per file
export default class ApiClient {
  /* ... */
}

import ApiClient from "./api.js";
```

**Avoid**:

- ❌ Anonymous default exports: `export default function() { /* ... */ }`
- ❌ Mixing default + named exports in same file (confusing)
- ❌ Wildcard imports unless necessary: `import * as utils from './utils.js'`

## Import Ordering Convention

```javascript
// 1. Config imports
import { API_CONFIG } from "./config.js";

// 2. Utility imports
import { qs, qsa, formatDate } from "./utils.js";

// 3. Feature imports
import { fetchEvents, loadClubs } from "./api.js";
import { generateGoogleCalendarLink } from "./calendar.js";

// 4. Blank line before code
```

## Configuration Management

**Centralize all config** in `assets/js/config.js`:

```javascript
// config.js
export const API_CONFIG = {
  endpoint: "https://script.google.com/macros/s/...",
  city: "bangkok",
  timeout: 5000,
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

**Never hardcode**:

- ❌ API URLs (use `API_CONFIG.endpoint`)
- ❌ Magic numbers (use named constants: `const MAX_EVENTS = 50;`)
- ❌ Environment-specific values (use config objects)

## API Abstraction

**Isolate all API calls** in `assets/js/api.js`:

```javascript
// api.js
import { API_CONFIG } from "./config.js";

export async function fetchEvents(clubs, levels) {
  const url = buildApiUrl("preview", { clubs, levels });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function loadClubs() {
  const res = await fetch(`${API_CONFIG.endpoint}?action=filters`);
  if (!res.ok) throw new Error("Failed to load clubs");
  const { clubs } = await res.json();
  return clubs;
}

function buildApiUrl(action, params) {
  let url = `${API_CONFIG.endpoint}?action=${action}`;
  if (params.clubs?.length) url += `&clubs=${params.clubs.join(",")}`;
  if (params.levels?.length) url += `&levels=${params.levels.join(",")}`;
  return url;
}
```

**Benefits**:

- Single source of truth for API logic
- Easy to mock for testing
- Consistent error handling
- Copilot knows to use these functions instead of raw fetch

## Core style rules (derived from industry best practices)

- Prefer `const` and `let` over `var` (const by default, let only when reassignment needed)
- Use small, single-purpose functions (~60 lines max)
- Use descriptive names (no single letters except loop indices)
- Avoid mutating function parameters
- Prefer declarative DOM updates (createElement/textContent) over string concat + innerHTML
- Avoid `eval()`, `new Function()`, or `Function()` constructor
- Use arrow functions for non-method functions
- Use template literals over string concatenation
- Destructure imports and function parameters for clarity

## Testable Code Principles

**Write pure functions** where possible (same input → same output):

```javascript
// ✅ GOOD - Pure function (testable)
export function formatEventDate(isoString) {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    day: "2-digit",
    month: "short",
  }).format(date);
}

// ❌ BAD - Side effects, global state
let currentDate;
function updateDate(isoString) {
  currentDate = new Date(isoString);
  document.getElementById("date").textContent = currentDate;
}
```

**Separate concerns**:

- Data fetching → `api.js`
- Data transformation → `utils.js`
- DOM updates → `app.js`

**Example** - Before (not testable):

```javascript
async function onFilter() {
  const clubs = [...document.querySelectorAll("#clubs input:checked")].map(
    (x) => x.value,
  );
  const res = await fetch(url);
  const data = await res.json();
  document.getElementById("results").innerHTML = "";
  // ... mixed concerns
}
```

**After** (testable):

```javascript
// api.js
export async function getFilteredEvents(clubs, levels) {
  return await fetchEvents(clubs, levels);
}

// utils.js
export function getSelectedClubs() {
  return [...qsa("#clubs input:checked")].map((x) => x.value);
}

// app.js
import { getFilteredEvents } from "./api.js";
import { getSelectedClubs } from "./utils.js";
import { renderEvents } from "./ui.js";

async function onFilter() {
  const clubs = getSelectedClubs();
  const events = await getFilteredEvents(clubs, selectedLevels);
  renderEvents(events);
}
```

## Error Handling Patterns

**Consistent try/catch** in async functions:

```javascript
async function loadEvents() {
  try {
    const events = await fetchEvents(clubs, levels);
    renderEvents(events);
  } catch (err) {
    console.error("Failed to load events:", err);
    showErrorMessage("Unable to load events. Please try again.");
    // Graceful degradation: show cached data if available
    if (cachedEvents) renderEvents(cachedEvents);
  }
}
```

**API functions should**:

- Throw errors for HTTP failures (let caller handle)
- Log to console.error for debugging
- Return parsed data (not raw Response objects)

## Security

**Treat all API responses as untrusted**:

- Use `textContent` / `node.appendChild` for text content
- For URLs with user data (e.g., Google Calendar links), encode with `encodeURIComponent`
- Never use `innerHTML` with untrusted input
- Avoid `eval()`, `new Function()`, or `Function()` constructor
- Watch for DOM-based XSS: OWASP DOM XSS patterns apply

**Examples**:

```javascript
// ✅ GOOD - Safe text insertion
const li = document.createElement("li");
li.textContent = event.title; // safe, no XSS
list.appendChild(li);

// ✅ GOOD - URL encoding
const gcalLink = `https://calendar.google.com/calendar/render?text=${encodeURIComponent(event.title)}`;

// ❌ BAD - XSS vulnerability
node.innerHTML = `<p>${apiData.html}</p>`; // Dangerous!

// ✅ GOOD - Safe alternative
const p = document.createElement("p");
p.textContent = apiData.text;
node.appendChild(p);
```

**OWASP Reference**: https://owasp.org/www-community/attacks/DOM_Based_XSS

## Accessibility & UX

- Keep UI updates respectful to screen readers: prefer element reflow over removing/recreating if it harms focus
- Maintain focus order on updates (e.g., when opening a modal, move focus to it)
- Use semantic HTML with proper ARIA labels (see html-instructions.md)
- Ensure keyboard navigation works (tab order, escape to close)

## Function Naming Conventions

**Use verb-first naming** for better Copilot autocomplete:

```javascript
// ✅ GOOD - Clear intent
fetchEvents();
loadClubs();
renderEvents();
formatDate();
validateInput();

// ❌ BAD - Unclear
eventsGet();
clubsLoad();
dateFormatter();
```

**Async functions** should have descriptive names:

```javascript
async function fetchEvents() {
  /* ... */
} // ✅
async function getEvents() {
  /* ... */
} // ✅
async function events() {
  /* ... */
} // ❌ Too vague
```

## Constants & Magic Values

**Define named constants** at module top or in `config.js`:

```javascript
// ✅ GOOD
const MAX_EVENTS_DISPLAY = 50;
const DEFAULT_TIMEOUT_MS = 5000;
const BANGKOK_TIMEZONE = "Asia/Bangkok";

function renderEvents(events) {
  const display = events.slice(0, MAX_EVENTS_DISPLAY);
  // ...
}

// ❌ BAD - Magic numbers
function renderEvents(events) {
  const display = events.slice(0, 50); // What is 50?
  // ...
}
```

## Testing & Tools

**ESLint config** should follow Airbnb style guide (see `.eslintrc.json`):

- Extends: `airbnb-base`
- ES2021 + ES6 modules
- Import/export validation
- No console (except error/warn)

**Run before commit**:

```bash
npx eslint "assets/js/**/*.js" --fix
npx prettier --check "*.html" "assets/**/*.css" "assets/js/**/*.js"
```

## Formatting (MANDATORY prior to PR)

```bash
# Check formatting
npx prettier --check "*.html" "assets/**/*.css" "assets/js/**/*.js"

# Auto-fix
npx prettier --write "*.html" "assets/**/*.css" "assets/js/**/*.js"

# Lint JS (run if ESLint config exists)
npx eslint "assets/js/**/*.js" --fix
```

## Checklist for PRs changing JS

- [ ] Code split into appropriate modules (api.js, utils.js, etc.)
- [ ] Named exports used (no unnecessary default exports)
- [ ] No hardcoded API URLs or magic values
- [ ] Pure functions where possible (testable)
- [ ] Consistent error handling (try/catch with user-friendly messages)
- [ ] Prettier: PASS
- [ ] ESLint: PASS
- [ ] No eval/new Function usage
- [ ] API input sanitized/encoded before use in markup or URLs

## References

- Airbnb JS style guide: https://github.com/airbnb/javascript
- Google JS style guide: https://google.github.io/styleguide/jsguide.html
- MDN JS docs: https://developer.mozilla.org/docs/Web/JavaScript
- OWASP XSS & DOM XSS: https://owasp.org
- ES6 Modules: https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules
