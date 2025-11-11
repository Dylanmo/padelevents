# Padel Events Calendar — Mobile-First Feature Plan

**Primary Goal**: Make it as easy as possible for padel players to quickly find relevant events and add them to their calendar on mobile devices.

**Target User**: Casual and intermediate padel players in Bangkok who want to discover 4–12 daily events across ~8 clubs without being overwhelmed.

**Design Principle**: Start small. Mobile-first. Minimize friction from discovery → calendar.

---

## Current State (What Exists)

✅ **Club filters** — Checkboxes loaded from API  
✅ **Level filters** — 4 toggle buttons (Beginner 0–2, Low-Inter 2–3, Mid-Inter 3–4, High-Inter 4–5)  
✅ **Preview API call** — Returns `{ total, sample: [...] }`  
✅ **Event table** — Shows title, date, club, level, and a Google Calendar link per event  
✅ **Google Calendar export** — Per-event link with UTC-converted times  
✅ **Footer** — Last-update placeholder and contact mailto links  

**Gaps**:
- Table layout is hard to read on mobile (horizontal scroll, cramped columns)
- No touch-optimized buttons (small tap targets)
- No filter persistence (users re-select clubs/levels on every visit)
- No error handling (API fails silently)
- No visual hierarchy or brand identity
- No "last updated" time displayed

---

## Phase 1: Core Mobile Usability (Start Here)

**Goal**: Make the current flow work beautifully on mobile. Focus on the critical path: land → see events → add to calendar.

### 1.0 Auto-Load Default Events on Landing (NEW — PRIORITY)

**User Story**: As a user arriving on the site, I want to immediately see upcoming events without having to select filters first.

**Changes**:
- On page load, automatically fetch and display events for the next 2 weeks
- Group events by club (one section per club)
- Sort events by date within each club section
- Show club name as section headers (e.g., "📍 Thonglor Padel Club")
- Users can then refine with filters if needed

**Acceptance**:
- ✅ Events appear automatically on first load (no button click required)
- ✅ Events grouped by club with clear section headers
- ✅ Events within each club sorted chronologically (soonest first)
- ✅ Default range is next 14 days from today

**Files to change**: `index.html` (add auto-load on DOMContentLoaded), `assets/style.v1.css`

---

### 1.1 Replace Event Table with Mobile Card List

**User Story**: As a mobile user, I want to quickly scan upcoming events without horizontal scrolling or zooming.

**Changes**:
- Replace `<table>` with a vertical list of event cards
- Each card shows:
  - Event title (bold, primary text)
  - Day + date + time range (e.g., "Fri 15 Nov • 18:00–20:00")
  - Club + level in a compact detail row (e.g., "📍 Thonglor Padel • 🥇 Level 3–4")
  - Large "Add to Calendar" button with **two options**:
    - Google Calendar link (existing)
    - **ICS download** (NEW) for Apple Calendar, Outlook, Android default calendar
- Desktop: cards can flow into a 2-column grid if space allows
- Group cards by club when showing auto-loaded or filtered results

**Acceptance**:
- ✅ Cards display correctly at 375px width (iPhone SE)
- ✅ No horizontal scroll
- ✅ Readable without zooming
- ✅ Events grouped by club with section headers

**Files to change**: `index.html` (markup + JS rendering), `assets/style.v1.css`

---

### 1.2 Add ICS Calendar Export (Cross-Platform Support)

**User Story**: As a user on iPhone, Android, or desktop, I want to download events to my native calendar app (not just Google Calendar).

**Changes**:
- Generate `.ics` files dynamically in JavaScript for each event
- Provide **two calendar options** per event:
  - "Add to Google Calendar" (existing link-based flow)
  - "Download ICS" (NEW — triggers download of `.ics` file)
- ICS file format:
  ```
  BEGIN:VCALENDAR
  VERSION:2.0
  PRODID:-//Padel Events Bangkok//EN
  BEGIN:VEVENT
  UID:event-{timestamp}@padelevents.com
  DTSTAMP:{now in UTC}
  DTSTART:{start in UTC}
  DTEND:{end in UTC}
  SUMMARY:{event title}
  DESCRIPTION:{club · level}
  LOCATION:{club name}
  END:VEVENT
  END:VCALENDAR
  ```
- Works on iPhone (Apple Calendar), Android (default calendar), Outlook, Thunderbird

**Acceptance**:
- ✅ "Download ICS" button triggers file download
- ✅ ICS file opens correctly in Apple Calendar on iPhone
- ✅ ICS file opens correctly in Google Calendar app on Android
- ✅ ICS file opens correctly in Outlook on desktop
- ✅ Event times display in user's local timezone when opened

**Files to change**: `index.html` (add `generateICS()` function and download link)

---

### 1.3 Improve Touch Targets & Visual Filter Highlights

**User Story**: As a mobile user, I want to tap buttons easily and clearly see which filters are selected.

**Changes**:
- Make all interactive elements >= 44px tall (iOS/Android touch guideline)
- **Visually highlight selected filters**:
  - Club checkboxes: add background color + border to checked state
  - Level buttons: add distinct active/selected state (bold border, filled background)
  - Use brand color for selected state
- Increase club chip padding and level button height
- Add visible focus outlines for keyboard users
- Add `aria-label` and `aria-checked` to filter buttons and calendar links
- Ensure color contrast meets WCAG AA (4.5:1 for body text, 3:1 for UI elements)

**Acceptance**:
- ✅ Buttons pass 44px touch target test
- ✅ Selected clubs have visible highlight (background + border)
- ✅ Selected levels have visible active state (different from unselected)
- ✅ Focus outlines visible on tab navigation
- ✅ Color contrast >= 4.5:1 (checked with browser dev tools or axe DevTools)

**Files to change**: `assets/style.v1.css`, `index.html` (add aria attributes)

---

### 1.4 Persist Filter Selections (localStorage) — NICE TO HAVE

**User Story**: As a returning user, I want my club and level selections remembered so I don't re-filter every time.

**Priority**: Nice to have — defer until core features (1.0–1.3, 1.5–1.6) are complete.

**Changes**:
- Save selected clubs and levels to `localStorage` on every change
- On page load, read from `localStorage` and pre-check saved clubs/levels
- If saved filters exist, apply them after showing default 2-week view

**Acceptance**:
- ✅ Select a club + level, reload page → filters remain selected
- ✅ Works across sessions (localStorage persists until cleared)
- ✅ Default 2-week view still loads first, then saved filters can be applied

**Files to change**: `index.html` (add save/restore logic in script)

---

### 1.5 Show "Last Updated" & Basic Error Handling

**User Story**: As a user, I want to know when event data was last refreshed and see a clear message if something goes wrong.

**Changes**:
- Populate `#lastUpdated` element with:
  - API timestamp if returned by the backend, OR
  - Current time when preview data loads (e.g., "Updated 2 mins ago")
- Wrap API fetch in try/catch
- On error:
  - Show friendly message in `#status` (e.g., "⚠️ Unable to load events. Please try again.")
  - Optionally show cached preview if available in `localStorage`

**Acceptance**:
- ✅ `#lastUpdated` shows readable time (e.g., "Last update: 14:32" or "2 mins ago")
- ✅ Network error shows user-friendly message (not silent failure)
- ✅ Cached results appear if API fails (optional for v1)

**Files to change**: `index.html` (JS error handling + timestamp logic)

---

### 1.6 Apply Mobile-First Visual Design

**User Story**: As a user, I want the app to feel modern, clean, and trustworthy.

**Changes**:
- Add CSS custom properties for colors:
  ```css
  :root {
    --brand-primary: #0E9F6E; /* padel green */
    --brand-accent: #0B7285;  /* teal */
    --bg-page: #F9FAFB;
    --bg-card: #FFFFFF;
    --text-primary: #111827;
    --text-secondary: #6B7280;
    --border: #E5E7EB;
  }
  ```
- Mobile-first responsive rules:
  - Card spacing, readable type scale (16px body, 18px titles)
  - Padding/margins optimized for thumb reach
  - Clear visual separation between cards (subtle shadows or borders)
- CTA button styled with `--brand-primary` background, white text, rounded corners, hover/active states

**Acceptance**:
- ✅ Visually clean on mobile (no clutter)
- ✅ Primary CTA clearly stands out
- ✅ Brand colors applied consistently

**Files to change**: `assets/style.v1.css`

---

## Phase 2: Small Enhancements (Future)

**Defer these until Phase 1 is live and tested.**

### 2.1 Shareable Filter Links
- Encode clubs/levels into URL (`?clubs=club1,club2&levels=3-4`)
- Users can share a pre-filtered view with friends

### 2.2 "Add All Visible" / ICS Export
- Download an `.ics` file with all filtered events for bulk calendar import
- Or generate a multi-event Google Calendar flow (if feasible)

### 2.3 Date Range Filter
- Let users filter by "Next 7 days", "Next 14 days", "Next 30 days"
- Reduces noise for users planning ahead

### 2.4 Search by Event Title or Club
- Quick text search to find specific events or clubs

### 2.5 Empty State & Onboarding
- Show helpful message when no events match ("Try selecting more clubs or levels")
- Brief first-visit tooltip explaining how filters work

---

## Implementation Order (Phase 1)

**Week 1** — Auto-load + mobile card layout grouped by club (tasks 1.0, 1.1)  
**Week 2** — ICS export + visual filter highlights (tasks 1.2, 1.3)  
**Week 3** — Error handling + visual design polish (tasks 1.5, 1.6)  
**Week 4** — Manual QA + filter persistence (nice-to-have task 1.4)

**Each task is designed to be small, testable, and shippable independently via git branches.**

---

## Git Workflow & Branching Strategy

**Branch naming convention**:
- Feature branches: `feature/{task-number}-{short-description}` (e.g., `feature/1.0-auto-load-events`)
- Bug fixes: `fix/{issue-description}` (e.g., `fix/calendar-timezone`)
- Design/CSS: `design/{change-description}` (e.g., `design/mobile-card-layout`)

**Recommended workflow**:
1. Create a new branch from `main` for each task
   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/1.0-auto-load-events
   ```
2. Make changes, test locally with `firebase serve` or by opening `index.html`
3. Commit with descriptive messages:
   ```bash
   git add index.html assets/style.v1.css
   git commit -m "feat: auto-load 2-week events grouped by club on landing"
   ```
4. Push branch and create Pull Request on GitHub:
   ```bash
   git push origin feature/1.0-auto-load-events
   ```
5. Review PR, test on mobile, merge to `main`
6. Deploy to Firebase Hosting from `main`:
   ```bash
   git checkout main
   git pull origin main
   firebase deploy --only hosting
   ```

**Why this matters**: Keeps `main` stable, allows testing each feature independently, and provides rollback points if issues arise.

---

## Success Metrics (Phase 1)

After Phase 1 is live, success looks like:

1. **Instant value**: Users see relevant events immediately on landing (no filters required)
2. **Mobile usability**: Users can scan events and add to their calendar in < 20 seconds on a phone
3. **Cross-platform**: ICS export works on iPhone, Android, and desktop calendars
4. **Visual clarity**: Selected filters are clearly highlighted; users know what's active
5. **Error resilience**: API downtime shows a friendly message (not a blank screen)
6. **Visual trust**: Modern, clean UI with clear CTAs and readable text

**How to measure**:
- Manual testing on iPhone/Android (375px–414px widths)
- Test ICS download on at least 2 platforms (iOS + Android or desktop)
- Ask 2–3 padel players to test and observe friction points
- Check browser console for JS errors on common flows
- Verify Google Calendar links AND ICS files create events with correct times in user's local timezone

---

## Technical Constraints & Non-Goals

**Must keep**:
- Frontend-only (no backend changes to this repo)
- No build tools (inline JS, direct CSS link)
- Firebase Hosting with cache headers in `firebase.json`
- External API contract unchanged (Google Apps Script endpoint)

**Out of scope for Phase 1**:
- User accounts or authentication
- Offline-first / Service Worker caching
- Analytics or logging (can add later)
- Map view or club locations
- Push notifications or reminders

---

## Files to Change (Phase 1)

| File | Changes |
|------|---------|
| `index.html` | Replace table with card list markup, add aria-labels, add localStorage save/restore logic, add error handling |
| `assets/style.v1.css` | Add CSS variables, mobile-first card styles, larger touch targets, focus states, responsive layout |

**No new files needed.** Keep it simple.

---

## Next Steps

1. **Review this plan** — Confirm prioritization and scope
2. **Provide brand colors** (optional) — Or approve suggested palette (green + teal)
3. **Start implementation** — Begin with task 1.1 (mobile card list)
4. **Iterate in small PRs** — Ship each task independently, test on mobile, gather feedback

**Questions?**
- Do you want to adjust the order or defer any task?
- Any specific brand color hex values to use?
- Should we add "auto-filter on load" if filters are cached?
