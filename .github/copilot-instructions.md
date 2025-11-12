# Padel Events Calendar - AI Instructions

## Project Overview

A single-page web app for creating personalized padel event calendars in Bangkok. Users filter events by club and level, then add them to Google Calendar. **Phase 2 Architecture**: Modular ES6 JavaScript with zero build tools—served via Firebase Hosting.

## Architecture

**Frontend-only**: `index.html` for markup, logic split into ES6 modules under `assets/js/`

**JavaScript Modules**:

- `app.js` - Main entry point
- `api.js` - API client
- `calendar.js` - Calendar generation
- `filters.js` - Filter state management
- `utils.js` - Shared utilities
- `config.js` - Configuration

**External API**: All event data comes from a Google Apps Script endpoint (configured in `config.js`). No backend or database in this repo.

**Hosting**: Firebase Hosting with cache control headers in `firebase.json`. HTML never cached; CSS/JS versioned and immutable.

## Key Files

- `index.html` - HTML structure only (no inline JS)
- `assets/js/*.js` - ES6 modules (native, no bundler)
- `assets/style.v1.css` - All styles; version number in filename for cache busting
- `firebase.json` - Hosting config with explicit cache headers
- `.firebaserc` - Firebase project: `padel-events-bangkok`

## Development Workflow

**No build step**: Edit files directly, test in browser, deploy with Firebase CLI.

**Deploy**: `firebase deploy --only hosting`  
**Local preview**: `firebase serve` or use Live Server extension

**CSS changes**: Increment version (`style.v1.css` → `style.v2.css`), update `<link>` in `index.html`

## Code Patterns

**Modular ES6**: Keep JS in separate modules under `assets/js/`. Use named exports.

**Minimal abstractions**: Use `qs()` / `qsa()` shortcuts from `utils.js`. Vanilla DOM manipulation, no frameworks.

**API contract** (via `api.js`):

- `loadClubs()` returns `[{value, label}]`
- `fetchEvents(clubs, levels)` returns `{total, sample: [{title, start, end, club, level}]}`

**Date handling**: Always use `new Date()` with ISO strings from API. Format with `Intl.DateTimeFormat`.

**Google Calendar links**: Generate in `calendar.js` with UTC conversion.

## Common Tasks

**Adding a new module**: Create in `assets/js/`, use named exports, import in `app.js`

**Adding a club/filter**: Update Google Apps Script (not this repo). Frontend auto-loads from API.

**Changing styles**: Edit `style.v1.css` in place OR version bump if deployed (to bust cache).

**Updating event display**: Modify render logic in `app.js` or create new module.

## Important Constraints

- **No npm dependencies for runtime code** - dev tools only (linters, prettier)
- **Native ES6 modules** - no bundlers, transpilers, or build tools
- Keep modules focused and testable
- Firebase Hosting config controls caching—don't add `.htaccess` or server logic
- API endpoint is external/unchangeable—work within its current response format

## Lint & Formatting Policy (MANDATORY FOR EVERY CHANGE)

After EVERY code edit (HTML, CSS, JS modules) the assistant must automatically run the linters and formatting checks before considering the task complete:

1. HTML: `npx htmlhint index.html`
2. CSS: `npx stylelint "assets/**/*.css" --fix` (apply safe auto-fixes)
3. JS: `npx eslint assets/js/**/*.js --fix` (apply safe auto-fixes)
4. Formatting: `npx prettier --check "*.html" "assets/**/*.css" "assets/js/**/*.js"` then, if issues, `npx prettier --write "*.html" "assets/**/*.css" "assets/js/**/*.js"`

Rules:

- Never skip linting unless user explicitly says so.
- If linters report only naming-convention or stylistic warnings conflicting with established project patterns, document and ignore—do NOT refactor without permission.
- Apply only safe automatic fixes; do not introduce new dependencies beyond already added dev tools.
- Summarize lint results (PASS/FAIL) per tool after each edit.
- If a fix introduces new errors, revert that part or adjust until all critical errors are resolved.
- Do not block deployment on non-critical stylistic warnings.

If linters are temporarily unavailable or configs missing, note the gap and propose minimal config creation before proceeding.

## Code Generation Guidelines

When generating new code, follow these patterns:

**JavaScript Modules**:

- Use named exports (not default exports unless single-purpose module)
- Import config from `config.js`, never hardcode API URLs
- Separate concerns: API calls in `api.js`, DOM updates in `app.js`, utilities in `utils.js`
- Write pure functions where possible (testable, no side effects)
- Use consistent error handling (try/catch with user-friendly messages)

**HTML**:

- Use semantic elements (`<main>`, `<section>`, `<article>`)
- Include proper ARIA labels for accessibility
- Add meta tags for SEO and social sharing
- Never use inline JavaScript (keep in modules)

**CSS**:

- Use custom properties (CSS variables) for all design tokens
- Write mobile-first responsive styles
- Use simplified BEM for complex components
- Prefer GPU-accelerated properties for animations (transform, opacity)

See individual guidelines files for complete rules:

- `.github/html-instructions.md`
- `.github/css-instructions.md`
- `.github/js-instructions.md`
