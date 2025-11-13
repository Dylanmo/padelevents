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

- `index.html` - HTML structure only (no inline JS); references `/assets/style.css` in dev
- `assets/js/*.js` - ES6 modules (native, no bundler)
- `assets/style.css` - Source CSS file (edit this directly during development)
- `assets/style.[hash].css` - Hashed CSS for production (auto-generated on deploy, never edit)
- `scripts/hash-css.js` - Content hashing script for cache busting (runs automatically on predeploy)
- `firebase.json` - Hosting config with explicit cache headers
- `.firebaserc` - Firebase project: `padel-events-bangkok`

## Development Workflow

**No build step**: Edit files directly, test in browser, deploy with Firebase CLI.

**Local development**: 
- `index.html` references `/assets/style.css` directly
- Live Server watches for changes and refreshes instantly
- Just edit `style.css` and see changes immediately in browser

**Deploy to production/pre-staging**: 
```bash
npm run predeploy      # Automatically hashes CSS and updates index.html
firebase deploy --only hosting
```

OR manually:
```bash
npm run hash-css       # Generate hashed CSS file and update index.html
firebase deploy --only hosting
```

**Local preview**: `firebase serve` or use Live Server extension

**Cache busting**: The `predeploy` script automatically runs before Firebase deployment, computing a content hash of `style.css` and generating `style.[hash].css`. The hash only changes when CSS content changes, ensuring browsers get fresh styles on deploy while caching aggressively in production.

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

**Changing styles**: Edit `style.css` in place OR version bump if deployed (to bust cache).

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

**Note on SonarQube**: Full SonarQube/SonarCloud integration requires a paid account or free online project. The current linting setup (ESLint, stylelint, htmlhint) provides comprehensive code quality checks without external services. If deeper static analysis is needed later, SonarCloud (free for public projects) can be configured with a GitHub account.

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

## Visual Design System (MANDATORY FOR ALL UI CHANGES)

**All new features and UI changes MUST follow the visual design guidelines**. Before implementing any visual changes:

1. **Review design system**: Read `docs/VISUAL_DESIGN_GUIDELINES.md` for overview
2. **Use design tokens**: All colors, spacing, typography must use CSS variables defined in the guidelines
3. **Follow component patterns**: Check `docs/design/components.md` for existing patterns before creating new ones
4. **Mobile-first**: Design for 375px width first, enhance for larger screens
5. **Accessibility**: Verify color contrast (4.5:1 for text), touch targets (44px min), keyboard navigation

**Core Design Principles**:

- **Restrained color palette**: Use primary green (#10b981) sparingly for CTAs only
- **System fonts**: Never add custom web fonts (use system UI stack)
- **4px spacing scale**: Use CSS variables (`--space-1` through `--space-16`)
- **Touch-friendly**: Minimum 44×44px tap targets for all interactive elements
- **WCAG AA compliance**: Required for all color contrast ratios

**Design Documentation**:

- `docs/VISUAL_DESIGN_GUIDELINES.md` - Main design system overview
- `docs/design/color-system.md` - Color palette and usage rules
- `docs/design/typography.md` - Font stack, type scale, hierarchy
- `docs/design/spacing-layout.md` - Spacing system, breakpoints, grid
- `docs/design/components.md` - Component specs (cards, buttons, filters)
- `docs/design/icons.md` - Icon guidelines (SVG format, sizing, accessibility)
- `docs/design/accessibility.md` - WCAG compliance, ARIA, keyboard nav

**Before implementing UI changes**:

- [ ] Check if component exists in `docs/design/components.md`
- [ ] Use CSS variables for colors, spacing, typography (never hardcoded values)
- [ ] Verify mobile layout at 375px width
- [ ] Test color contrast with browser dev tools
- [ ] Ensure touch targets >= 44px
- [ ] Add proper ARIA labels and semantic HTML

**When proposing new visual patterns**:

1. Document in appropriate design file first
2. Get approval before implementing
3. Update component specs after implementation
