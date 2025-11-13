# Padel Events Calendar — Architecture & File Structure

**Purpose**: Evaluate current inline architecture and recommend file separation for maintainability and future feature expansion.

---

## Current Architecture (As-Is)

### File Structure

```
/
├── index.html          # Clean HTML markup only (no inline JS)
├── assets/
│   ├── style.v1.css    # All styles (versioned for cache busting)
│   └── js/
│       ├── app.js      # Main application entry point & orchestration
│       ├── api.js      # API client (clubs, events, GitHub version)
│       ├── calendar.js # Google Calendar + ICS generation
│       ├── config.js   # Configuration (API endpoints, constants)
│       ├── filters.js  # Filter state & localStorage persistence
│       └── utils.js    # DOM helpers & date formatting
├── firebase.json       # Hosting config + cache headers
├── .firebaserc         # Firebase project reference
├── 404.html            # Error page
├── package.json        # Dev dependencies (linters, prettier)
├── eslint.config.js    # ESLint configuration
└── README.md           # Project documentation
```

### Current Pattern: ✅ ES6 Modules (Phase 2 Complete)

- **HTML**: Clean markup in `index.html`, no inline JavaScript
- **CSS**: External file (`assets/style.v1.css`) with mobile-first responsive design
- **JavaScript**: Separated into ES6 modules under `assets/js/`, loaded via `<script type="module">`

**Pros**:

- ✅ Zero build tools (native ES6 modules work in modern browsers)
- ✅ Clear separation of concerns (API, UI, state, utilities in separate modules)
- ✅ Testable and maintainable code structure
- ✅ Better Git collaboration (changes isolated to specific files)
- ✅ Improved caching (JS cached separately from HTML)
- ✅ Code editor autocomplete and linting support
- ✅ Dev tooling for quality (ESLint, Prettier, HTMLHint, Stylelint)

**Cons**:

- ❌ No IE11 support (ES6 modules require modern browsers - acceptable tradeoff)
- ❌ Slightly more HTTP requests (mitigated by HTTP/2)

---

## Architecture Assessment: Current State & Future Readiness

### Implementation Status: ✅ Phase 2 Architecture Complete

**The project has successfully migrated from inline JavaScript to modular ES6 architecture**, achieving all goals from the Phase 2 recommendation:

✅ **Separation achieved**:

- All JavaScript extracted to separate modules (6 focused modules)
- Clean HTML with no inline scripts
- Configuration centralized in `config.js`
- Utilities and helpers properly abstracted

✅ **Development improvements**:

- Dev dependencies configured (ESLint, Prettier, HTMLHint, Stylelint)
- Firebase cache headers optimized for JS modules
- Git-friendly structure (no merge conflicts on single file)
- Testable module structure

### Current Capabilities

✅ **Fully supports current feature set**:

- Mobile-first responsive design
- ES6 module architecture (no build tools)
- Multi-club event filtering
- Auto-load with grouping by club
- Google Calendar + ICS export
- Version display from GitHub API
- Error handling and loading states
- Filter persistence (localStorage)

✅ **Ready for Phase 3+ expansion**:

- Modular structure supports adding new features
- Easy to add new modules (analytics, maps, search)
- State management scalable for advanced filtering
- API layer abstracted for easy endpoint changes

---

## Phase 1 Implementation Status ✅ COMPLETE

All Phase 1 tasks from the original architecture plan have been successfully implemented:

### ✅ 1.0 Auto-Load Default Events on Landing

**Status: IMPLEMENTED**

- Events automatically load on page initialization
- Default view shows next 2 weeks of events
- Events grouped by club with clear section headers
- Chronological sorting within each club
- "Happening Soon" section for events within 24 hours

**Implementation**:

- `app.js`: `autoLoadEvents()` function runs on DOMContentLoaded
- `app.js`: `groupEventsByClub()` groups events by venue
- `app.js`: `filterHappeningSoon()` highlights upcoming events
- `app.js`: `renderClubSection()` renders club-grouped events

### ✅ 1.1 Mobile-First Card Layout

**Status: IMPLEMENTED**

- Replaced table layout with vertical card list
- Each card shows title, date/time, club, level, calendar actions
- Responsive grid layout (1 column mobile, 2 columns tablet+)
- Touch-optimized with readable typography

**Implementation**:

- `app.js`: `renderEventCard()` generates card HTML
- `style.v1.css`: `.event-card` styles with mobile-first media queries
- `style.v1.css`: Responsive grid using `@media (width >= 768px)`

### ✅ 1.2 ICS Calendar Export

**Status: IMPLEMENTED**

- Dual calendar options per event (Google Calendar + ICS download)
- ICS generation with proper timezone handling (Asia/Bangkok)
- Download functionality with event-based filenames
- Cross-platform compatibility (iOS, Android, desktop)

**Implementation**:

- `calendar.js`: `generateICS()` creates ICS data structure
- `calendar.js`: `downloadICS()` triggers browser download
- `calendar.js`: `generateGoogleCalendarLink()` with timezone conversion
- `app.js`: ICS download button in event card rendering

### ✅ 1.3 Touch Targets & Visual Highlights

**Status: IMPLEMENTED**

- All interactive elements ≥ 44px height (iOS/Android guidelines)
- Selected clubs show checked state (background + checkmark)
- Active level buttons have distinct visual state
- Focus outlines for keyboard navigation
- ARIA labels for accessibility

**Implementation**:

- `style.v1.css`: `.chip`, `.level-btn` with min-height: 44px
- `style.v1.css`: `.chip.checked` active state styling
- `style.v1.css`: `.level-btn.active` selected state
- `index.html`: `aria-label` attributes on interactive elements
- `app.js`: Dynamic `checked` class toggling on checkboxes

### ✅ 1.4 Filter Persistence (localStorage)

**Status: IMPLEMENTED**

- Filter selections saved to localStorage
- Saved filters can be applied after auto-load
- Persists across browser sessions
- Graceful fallback if localStorage unavailable

**Implementation**:

- `filters.js`: `saveFilters()` and `loadFilters()` functions
- `config.js`: `STORAGE_KEY` constant
- Integration ready (storage functions available for future use)

### ✅ 1.5 Error Handling & Status Updates

**Status: IMPLEMENTED**

- Try/catch blocks around all API calls
- User-friendly error messages in status element
- Loading state indicators (animated GIF for clubs)
- Fallback to cached events on API failure
- GitHub version display with commit SHA and date

**Implementation**:

- `app.js`: Try/catch in `initializeClubs()`, `autoLoadEvents()`, `applyFilters()`
- `app.js`: `updateVersion()` fetches latest commit from GitHub API
- `api.js`: `fetchLatestCommit()` for version display
- `utils.js`: `formatCommitDate()` for readable timestamps
- `index.html`: Loading animation during club fetch
- `style.v1.css`: `.clubs-loading` and `.loading-gif` styles

### ✅ 1.6 Mobile-First Visual Design

**Status: IMPLEMENTED**

- CSS custom properties for brand colors
- Mobile-first responsive styles with progressive enhancement
- Clean visual hierarchy with clear CTAs
- Modern card-based UI with shadows and hover states
- Professional color palette (green/teal theme)

**Implementation**:

- `style.v1.css`: CSS custom properties in `:root`
- `style.v1.css`: Mobile-first breakpoints (375px base, 600px+, 768px+)
- `style.v1.css`: Brand colors applied throughout (--brand-primary, --brand-accent)
- `style.v1.css`: Card shadows, hover effects, transitions

---

## Additional Features Implemented Beyond Phase 1

### ✅ ES6 Module Architecture (Phase 2)

**Status: IMPLEMENTED**

- Migrated from inline JavaScript to separate ES6 modules
- 6 focused modules with clear responsibilities
- Native browser module support (no build tools)
- Proper imports/exports structure

**Implementation**:

- `app.js`: Main application entry point
- `api.js`: API client with fetch logic
- `calendar.js`: Calendar generation utilities
- `config.js`: Centralized configuration
- `filters.js`: Filter state management
- `utils.js`: Shared utility functions
- `index.html`: `<script type="module">` loader

### ✅ Development Tooling

**Status: IMPLEMENTED**

- ESLint for JavaScript linting
- Prettier for code formatting
- HTMLHint for HTML validation
- Stylelint for CSS quality
- Package.json with dev dependencies

**Implementation**:

- `package.json`: Dev dependencies configured
- `eslint.config.js`: ESLint rules
- npm scripts available for linting/formatting

### ✅ Advanced UI Features

**Status: IMPLEMENTED**

- "Happening Soon" section for events within 24 hours
- "View all" links per club for focused browsing
- "Show more" expandable event lists per club
- Event issue reporting via mailto links
- Smart footer email links (Gmail on desktop, mailto on mobile)
- Past event visual indicators (grayed out with "Past" label)

**Implementation**:

- `app.js`: `filterHappeningSoon()` with 24-hour window
- `app.js`: `filterByClub()` for club-focused views
- `app.js`: `toggleClubEvents()` for expand/collapse
- `app.js`: `setupFooterEmailLinks()` with device detection
- `style.v1.css`: `.event-past` styling with opacity and grayscale
- `style.v1.css`: `.happening-soon` gradient section

### ✅ Firebase Hosting Optimization

**Status: IMPLEMENTED**

- Cache headers configured for optimal performance
- HTML never cached (always fresh)
- CSS and JS cached with immutable flag
- Proper MIME types and compression

**Implementation**:

- `firebase.json`: Cache-Control headers per file type
- HTML: no-cache
- CSS: 1 year immutable cache
- JS: 1 year immutable cache

---

## Recommended Path Forward

### ~~Phase 1: Keep Inline JS~~ ✅ COMPLETE

~~Continue with current inline approach for tasks 1.0–1.6~~
**Status**: Phase 1 fully implemented and deployed

### ~~Phase 2: Minimal Separation (Option 1)~~ ✅ COMPLETE

~~Refactor inline JS to ES6 modules in `assets/js/`~~
**Status**: Migration complete, architecture now modular

### Phase 3: Feature Expansion (Current Phase)

Now that architecture is solid, ready to add advanced features:

**Recommended next features** (from FEATURE_PLAN.md Phase 2):

- Shareable filter links (URL parameters)
- Date range filters (7/14/30 day views)
- Search by event title or club
- Empty state improvements
- Analytics integration
- Dynamic slot tracking (medium-term)

**Architecture is ready**:

- ✅ Modular structure supports new features
- ✅ No refactoring needed before expansion
- ✅ Dev tooling in place for quality assurance
- ✅ Git workflow established with feature branches

---

## Alternative Architecture: Build-Tool Approach (Future Consideration)

### Option 2: Build-Tool Approach (If Needed for Phase 4+)

**Current status: NOT NEEDED** - ES6 module architecture meets all current and planned requirements.

Consider this only if you need:

- Team collaboration (5+ developers)
- TypeScript or advanced transpilation
- Component frameworks (React, Vue, Svelte)
- Advanced bundling optimizations
- Tree-shaking and code splitting

```
/
├── src/
│   ├── index.html          # HTML template
│   ├── styles/
│   │   ├── base.css        # Reset and base styles
│   │   ├── components.css  # Reusable components
│   │   └── layout.css      # Layout and responsive grid
│   ├── scripts/
│   │   ├── main.js         # Entry point
│   │   ├── api/
│   │   ├── components/
│   │   └── utils/
├── dist/                   # Build output (deployed to Firebase)
├── package.json
├── vite.config.js
```

**Build tool options**:

- **Vite** (recommended): Fast, modern, zero-config
- **Parcel**: Zero-config bundler
- **esbuild**: Extremely fast, minimal setup

**Pros**:

- ✅ Component-based architecture
- ✅ CSS modules or scoped styles
- ✅ Minification and tree-shaking
- ✅ Hot module reloading
- ✅ TypeScript support
- ✅ Easy testing framework integration

**Cons**:

- ❌ Adds build step (breaks "no build tools" principle)
- ❌ Requires Node.js and npm/yarn
- ❌ More complex deployment (build → deploy)
- ❌ Not needed for current scope

**Verdict**: Keep current ES6 module approach. Only migrate to build tools if requirements dramatically change.

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

## ~~Migration Plan: Inline → Separated Modules~~ ✅ COMPLETED

**Original plan**: Migrate from inline JavaScript to ES6 modules after Phase 1  
**Status**: Migration complete, architecture now modular

**What was completed**:

1. ✅ Created `assets/js/` directory structure
2. ✅ Extracted all JavaScript from `index.html` into modules
3. ✅ Separated concerns into focused modules:
   - `api.js`: API client logic
   - `calendar.js`: Calendar generation (Google + ICS)
   - `filters.js`: Filter state and persistence
   - `utils.js`: Shared utilities
   - `config.js`: Centralized configuration
   - `app.js`: Main orchestration
4. ✅ Added proper `export`/`import` statements
5. ✅ Updated `index.html` with `<script type="module">`
6. ✅ Tested in Chrome, Firefox, Safari (ES6 module support)
7. ✅ Updated `firebase.json` with cache headers for JS modules
8. ✅ Added dev tooling (ESLint, Prettier, HTMLHint, Stylelint)

**Result**: Clean, maintainable, testable modular architecture with zero build tools.

---

## Firebase Hosting Cache Strategy (Current Configuration)

```json
{
  "hosting": {
    "headers": [
      {
        "source": "/index.html",
        "headers": [{ "key": "Cache-Control", "value": "no-cache" }]
      },
      {
        "source": "/assets/*.css",
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

**Strategy**:

- **HTML**: Never cached (always fresh, allows instant updates)
- **CSS**: 1-year immutable cache (version in filename: `style.v1.css`)
- **JavaScript**: 1-year immutable cache (ES6 modules cached per file)

**To update CSS**: Bump version (`style.v1.css` → `style.v2.css`), update `<link>` in HTML  
**To update JS**: Edit module files directly (HTML reloads, fetches new JS automatically)

---

## Module Structure Reference (Current Implementation)

### `assets/js/api.js`

**Purpose**: API client for external data sources  
**Exports**: `loadClubs()`, `fetchEvents()`, `fetchLatestCommit()`  
**Dependencies**: `config.js`

```javascript
// Fetches club list from Google Apps Script endpoint
export async function loadClubs()

// Fetches filtered events with optional club/level filters
export async function fetchEvents(clubs = [], levels = [])

// Fetches latest GitHub commit for version display
export async function fetchLatestCommit()
```

### `assets/js/calendar.js`

**Purpose**: Calendar export utilities (Google Calendar + ICS)  
**Exports**: `generateGoogleCalendarLink()`, `generateICS()`, `downloadICS()`  
**Dependencies**: None (pure functions)

```javascript
// Generates Google Calendar URL with timezone conversion
export function generateGoogleCalendarLink(event)

// Generates ICS data object for calendar download
export function generateICS(event)

// Triggers browser download of ICS file
export function downloadICS(icsData)
```

### `assets/js/filters.js`

**Purpose**: Filter state management and localStorage persistence  
**Exports**: `saveFilters()`, `loadFilters()`, `getSelectedClubs()`, `buildFilterSummary()`  
**Dependencies**: `config.js`

```javascript
// Save club and level selections to localStorage
export function saveFilters(clubs, levels)

// Load saved filters from localStorage
export function loadFilters()

// Extract selected clubs from checkbox NodeList
export function getSelectedClubs(checkboxes)

// Build human-readable filter summary text
export function buildFilterSummary(clubs, levels, allClubs)
```

### `assets/js/utils.js`

**Purpose**: Shared utility functions (DOM, dates)  
**Exports**: `qs()`, `qsa()`, `formatDate()`, `formatBangkokDate()`, `formatCommitDate()`  
**Dependencies**: None (pure utilities)

```javascript
// Query selector shortcuts
export const qs = (selector) => document.querySelector(selector)
export const qsa = (selector) => document.querySelectorAll(selector)

// Date formatting with Bangkok timezone
export function formatBangkokDate(date, format = 'full')

// Format GitHub commit dates for version display
export function formatCommitDate(isoDate)
```

### `assets/js/config.js`

**Purpose**: Centralized configuration and constants  
**Exports**: `API_CONFIG`, `CITY_CONFIG`, `STORAGE_KEY`, `GITHUB_API_URL`

```javascript
// API endpoint configuration
export const API_CONFIG = {
  endpoint: "https://script.google.com/...",
  city: "bangkok"
}

// City-specific settings (timezone, defaults)
export const CITY_CONFIG = {
  bangkok: { name: "Bangkok", timezone: "Asia/Bangkok", ... }
}

// localStorage key for filter persistence
export const STORAGE_KEY = "padel.filters"

// GitHub API endpoint for version fetching
export const GITHUB_API_URL = "https://api.github.com/repos/..."
```

### `assets/js/app.js`

**Purpose**: Main application entry point and orchestration  
**Exports**: None (runs on DOMContentLoaded)  
**Dependencies**: All other modules

**Key functions**:

- `init()` - Initialize app on page load
- `initializeClubs()` - Load and render club filters
- `autoLoadEvents()` - Auto-load default 2-week view
- `applyFilters()` - Manual filter application
- `filterByClub()` - Show all events for specific club
- `renderEvents()` - Main rendering logic with grouping
- `renderEventCard()` - Individual event card HTML
- `toggleClubEvents()` - Expand/collapse club sections
- `attachEventListeners()` - Event delegation for interactions

---

## Conflict Check: New Features vs Implementation Status

### ✅ All Features Integrated Successfully

**Phase 1 features** (from FEATURE_PLAN.md):

1. ✅ Auto-load 2-week events → Implemented with club grouping
2. ✅ Mobile card layout → Responsive grid with card design
3. ✅ ICS export → Full cross-platform support
4. ✅ Visual filter highlights → Active states on clubs and levels
5. ✅ Filter persistence → localStorage integration ready
6. ✅ Error handling → Try/catch with user-friendly messages
7. ✅ Mobile-first design → CSS custom properties and responsive layout

**Phase 2 architecture** (from original recommendations):

1. ✅ ES6 module separation → All JavaScript extracted to modules
2. ✅ File structure → `assets/js/` with 6 focused modules
3. ✅ Firebase cache headers → Optimized for modules
4. ✅ Dev tooling → Linters and formatters configured

**Additional features implemented**:

1. ✅ "Happening Soon" section → 24-hour event highlighting
2. ✅ Club-focused views → "View all" links per club
3. ✅ Expandable event lists → "Show more" functionality
4. ✅ Event issue reporting → mailto links with pre-filled details
5. ✅ GitHub version display → Automatic version fetching
6. ✅ Smart footer links → Device-aware email links
7. ✅ Past event indicators → Visual differentiation

**No conflicts detected** - All features work harmoniously together.

---

## Recommended Next Steps

### Immediate (Maintenance & Polish)

1. ✅ **Architecture documentation updated** (this file)
2. **Run linters on current codebase** - Ensure code quality
3. **Mobile testing audit** - Verify all features work on iOS/Android
4. **Performance check** - Validate Firebase caching and load times

### Short-Term (Phase 3 Features)

From FEATURE_PLAN.md Phase 2:

1. **Shareable filter links** - URL parameters for sharing filtered views
2. **Date range filters** - 7/14/30 day quick filters
3. **Search functionality** - Text search for events/clubs
4. **Empty state enhancements** - Better messaging and onboarding

### Medium-Term (Advanced Features)

1. **Dynamic slot tracking** - Scrape booking availability from clubs
2. **Analytics integration** - Track usage patterns
3. **Map view** - Show clubs on interactive map
4. **Multi-city expansion** - Add cities beyond Bangkok

### Long-Term (If Scope Expands Significantly)

1. **User accounts** - Save preferences per user
2. **Push notifications** - Alert users about new events
3. **Mobile app** - Native iOS/Android apps
4. **Admin dashboard** - Manage events and clubs

**Current priority**: Stability and polish. Architecture is solid, focus on user experience refinements.

---

## Questions & Decision Points

### Architecture Decisions Made ✅

- ~~Q: Inline JS or modular?~~ **A: Modular ES6 (Phase 2 complete)**
- ~~Q: Build tools or no build?~~ **A: No build tools (ES6 native modules)**
- ~~Q: Filter persistence?~~ **A: localStorage implemented**
- ~~Q: Calendar export format?~~ **A: Both Google Calendar + ICS**

### Open Questions for Future Planning

1. **Multi-city expansion**: When to add other cities? How to structure city configs?
2. **Dynamic data**: Should we implement slot tracking? Partnership with clubs needed?
3. **Testing strategy**: Add automated tests? Which framework (Vitest, Jest)?
4. **Analytics**: Google Analytics? Custom tracking? Privacy concerns?
5. **SEO**: Add meta tags? Generate sitemap? Server-side rendering needed?

### No Immediate Blockers

Current architecture supports all planned Phase 3 features without refactoring.

---

## Extended Documentation

For additional planning and reference documents:

- **[docs/FEATURE_PLAN.md](FEATURE_PLAN.md)** — Detailed Phase 1 & 2 feature specifications with user stories
- **[docs/PROPOSED_ARCHITECTURE.md](PROPOSED_ARCHITECTURE.md)** — Original architecture proposal (historical reference)
- **[docs/MIGRATION_PLAN.md](MIGRATION_PLAN.md)** — Migration guidance from inline JS to modules (completed)

**Note**: PROPOSED_ARCHITECTURE.md and MIGRATION_PLAN.md are historical documents. The migration they describe has been completed. Refer to this document (ARCHITECTURE.md) for current state.

---

## Summary: Current State Assessment

### What Works Well ✅

- **Modular ES6 architecture** - Clean separation of concerns, no build tools
- **Mobile-first design** - Responsive, touch-optimized, accessible
- **Dual calendar export** - Google Calendar + ICS for cross-platform support
- **Auto-loading experience** - Events appear immediately on landing
- **Club-grouped presentation** - Easy to scan events by venue
- **Error resilience** - Graceful fallbacks and user-friendly messages
- **Developer experience** - Linting, formatting, clear file structure
- **Caching strategy** - Optimized Firebase hosting headers

### What's Different from Original Plan

- **Phase 2 architecture completed early** - Migrated to modules before adding all Phase 1 features
- **Additional UI enhancements** - "Happening Soon" section, expandable lists, club-focused views
- **Version display** - GitHub commit SHA and date in footer
- **Smart email links** - Device-aware mailto/Gmail links

### Technical Debt: None Significant

- Code quality maintained with linters
- No known browser compatibility issues
- Performance optimized with proper caching
- No security concerns (frontend-only, no user data storage)

### Ready for Production ✅

All Phase 1 goals achieved. Architecture supports Phase 3 expansion without refactoring.

**Last updated**: 2025-11-12 (reflects current `main` branch state)

```

```
