# Padel Events — Player-Focused Feature Summary

Short summary
----------------

Mobile-first, player-focused frontend that helps Bangkok padel players find, filter, and add local events to their calendars quickly — with reliable time handling, cross-platform exports, and fast page loads.

Key features (what players get)
-------------------------------

- **Quick Event Preview:** Shows upcoming padel events on page load so players see matches immediately. (Implemented in `assets/js/app.js` — auto-load + render flow.)
- **Club Filter Chips:** Dynamic, pill-style club filters fetched from the API so you can pick clubs quickly. (Implemented in `assets/js/api.js` + rendering in `assets/js/app.js` — populates `#clubBox`.)
- **Multi-dimensional Filters:** Combine level, event type, category, time-of-day, and weekday filters to find matches that fit your skill and schedule. (Implemented in `assets/js/filters.js` and `assets/js/app.js` — UI buttons and state handlers.)
- **Mobile-first Card UI:** Touch-optimized event cards and responsive layout for easy scanning on phones. (Implemented in `assets/js/app.js` and `assets/style.v1.css`.)
- **Happening Soon Section:** Events for today and tomorrow are surfaced to help players join immediate matches. (Implemented in `assets/js/app.js` — grouping logic.)
- **Add-to-Calendar (Google):** One-click Google Calendar links generated with correct UTC timestamps for Bangkok events. (Implemented in `assets/js/calendar.js` — Google Calendar URL builder.)
- **ICS Export (Download):** Downloadable `.ics` files for Apple Calendar, Outlook, and universal imports. (Implemented in `assets/js/calendar.js` — ICS generator + Blob download.)
- **Timezone-Safe Dates:** Bangkok local times are converted to UTC so calendars show the correct start/end times. (Implemented in `assets/js/calendar.js` and `assets/js/utils.js` date helpers.)
- **Filter Persistence:** Filter helpers ready to persist selections (localStorage) so you don't have to re-select filters each visit. (Implemented in `assets/js/utils.js` and used in `assets/js/app.js`.)
- **Device-aware Signup Links:** Platform-aware signup / join links so iOS/Android/desktop users get the best flow. (Implemented in `assets/js/app.js`.)
- **Version Info & Status Messages:** Footer shows latest commit/version; `aria-live` status messages keep players informed during loading or errors. (Implemented in `index.html` + `assets/js/api.js` / `app.js`.)

Biggest solutions that fix player pains
-------------------------------------

- **Pain: Hard to scan events on mobile.**
  - Solution: Mobile-first card list and larger touch targets make scanning and tapping easier. Files: `assets/style.v1.css`, `assets/js/app.js`.
  - Why it helps players: Faster discovery and less accidental taps when choosing events.

- **Pain: Calendar imports show wrong times.**
  - Solution: Convert Bangkok local times to UTC for Google links and ICS date fields. Files: `assets/js/calendar.js`, `assets/js/utils.js`.
  - Why it helps players: Events land at correct local times in players' calendars, avoiding missed matches.

- **Pain: Can't add events on non-Google platforms.**
  - Solution: Generate and download `.ics` files so players using iPhone, Outlook, or other apps can import easily. Files: `assets/js/calendar.js`.
  - Why it helps players: Ensures everyone can add events regardless of their calendar app.

- **Pain: Filters are stale or hard to use.**
  - Solution: Dynamic filter chips (loaded from API) and multi-dimensional filtering (level/type/time/weekday) plus persistence helpers. Files: `assets/js/api.js`, `assets/js/filters.js`, `assets/js/app.js`.
  - Why it helps players: Filters reflect current clubs and let players zero-in on matches that fit skill and availability.

- **Pain: Slow or stale site after deploys.**
  - Solution: Firebase hosting cache rules (no-cache for `index.html`, long immutable cache for versioned assets) to keep HTML fresh while speeding static assets. Files: `firebase.json`.
  - Why it helps players: Faster loads and fewer broken experiences after updates.

Where to verify quickly
-----------------------

- Open `index.html` to review the main UI and `aria-live` regions.
- Check `assets/js/app.js` for render & filter wiring and the auto-load flow.
- Inspect `assets/js/calendar.js` for Google URL and `.ics` generation.
- Confirm `assets/style.v1.css` for mobile styles and touch-target rules.
- `firebase.json` contains the hosting cache headers used on deploy.

Notes / Next steps (optional)
----------------------------

- I can add a short "How to use — quick tips" section for players (3 bullets) inside this file if you want. Say `yes` and I'll append it.
- If you want this file committed to a different branch or modified language/tone for sharing with clubs, tell me the preferred audience and I'll adapt.

---
_Generated summary for padel players. File: `docs/FEATURES_SUMMARY.md`_
