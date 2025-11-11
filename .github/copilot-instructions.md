# Padel Events Calendar - AI Instructions

## Project Overview

A single-page web app for creating personalized padel event calendars in Bangkok. Users filter events by club and level, then add them to Google Calendar. Zero build tools—pure HTML/CSS/JS served via Firebase Hosting.

## Architecture

**Frontend-only**: `index.html` contains all UI and logic inline (no separate JS files). Vanilla JavaScript with async/await for API calls.

**External API**: All event data comes from a Google Apps Script endpoint (`API` constant in `index.html`). No backend or database in this repo—the script handles filtering and event aggregation.

**Hosting**: Firebase Hosting with cache control headers in `firebase.json`. HTML never cached; CSS versioned and immutable (`style.v1.css`).

## Key Files

- `index.html` - Complete app (HTML structure + inline JS)
- `assets/style.v1.css` - All styles; version number in filename for cache busting
- `firebase.json` - Hosting config with explicit cache headers
- `.firebaserc` - Firebase project: `padel-events-bangkok`

## Development Workflow

**No build step**: Edit files directly, test in browser, deploy with Firebase CLI.

**Deploy**: `firebase deploy --only hosting`  
**Local preview**: `firebase serve` or open `index.html` in browser (requires live API)

**CSS changes**: Increment version (`style.v1.css` → `style.v2.css`), update `<link>` in `index.html`

## Code Patterns

**Inline everything**: Keep JS/HTML together in `index.html`. No modules, no bundlers.

**Minimal abstractions**: Use `qs()` shorthand for `querySelector`. Avoid frameworks—vanilla DOM manipulation.

**API contract**:

- `?action=filters` returns `{clubs: [{value, label}]}`
- `?action=preview&clubs=...&levels=...` returns `{total, sample: [{title, start, end, club, level}]}`

**Date handling**: Always use `new Date()` with ISO strings from API. Format with `Intl.DateTimeFormat`.

**Google Calendar links**: Generate programmatically with UTC conversion (see `gcal()` function pattern).

## Common Tasks

**Adding a club/filter**: Update Google Apps Script (not this repo). Frontend auto-loads from API.

**Changing styles**: Edit `style.v1.css` in place OR version bump if deployed (to bust cache).

**Updating event display**: Modify the `sample.forEach()` loop in `onFilter()` function.

## Important Constraints

- No npm, no package.json—avoid suggesting dependencies
- Keep inline JS readable; line count isn't a concern
- Firebase Hosting config controls caching—don't add `.htaccess` or server logic
- API endpoint is external/unchangeable—work within its current response format

## Lint & Formatting Policy (MANDATORY FOR EVERY CHANGE)

After EVERY code edit (HTML, CSS, inline JS) the assistant must automatically run the linters and formatting checks before considering the task complete:

1. HTML: `npx htmlhint index.html`
2. CSS: `npx stylelint "assets/**/*.css" --fix` (apply safe auto-fixes)
3. JS (inline in HTML): `npx eslint index.html` (requires existing config; if missing, skip with note)
4. Formatting: `npx prettier --check "*.html" "assets/**/*.css"` then, if issues, `npx prettier --write "*.html" "assets/**/*.css"`

Rules:

- Never skip linting unless user explicitly says so.
- If linters report only naming-convention or stylistic warnings conflicting with established project patterns (e.g., camelCase IDs), document and ignore—do NOT refactor IDs unless requested.
- Apply only safe automatic fixes; do not introduce new dependencies beyond already added dev tools.
- Summarize lint results (PASS/FAIL) per tool after each edit.
- If a fix introduces new errors, revert that part or adjust until all critical errors are resolved.
- Do not block deployment on non-critical stylistic warnings.

If linters are temporarily unavailable or configs missing, note the gap and propose minimal config creation before proceeding.
