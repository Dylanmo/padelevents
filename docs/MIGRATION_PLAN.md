# Migration Plan — Inline JS → ES6 Modules (Phase 2)

## Goal

Move inline JavaScript from `index.html` into a small set of ES6 modules under `assets/js/` with **minimal risk** and **no build step**.

---

## Prerequisites

- Modern browser support (Chrome 61+, Firefox 60+, Safari 11+, Edge 16+)
- No IE11 requirement (ES6 modules unsupported)
- Firebase Hosting configured (for cache header updates)

---

## Step-by-Step Migration

### Step 1: Create `assets/js/` Directory Structure

```bash
mkdir -p assets/js
touch assets/js/app.js
touch assets/js/api.js
touch assets/js/calendar.js
touch assets/js/filters.js
touch assets/js/utils.js
touch assets/js/config.js
```

---

### Step 2: Extract Configuration (`config.js`)

Create `assets/js/config.js`:

```javascript
export const API_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbwgIl9UntPvaiuLYqczS_PUXSaycq7mNCIBGhbjObDrsPjowctV-Y6RG8pUAAFlC1jC9A/exec";

export const STORAGE_KEY = "padel.filters";

export const CITY_CONFIG = {
  bangkok: {
    name: "Bangkok",
    timezone: "Asia/Bangkok",
  },
};
```

---

### Step 3: Extract Utilities (`utils.js`)

Create `assets/js/utils.js`:

```javascript
// DOM helpers
export const qs = (s) => document.querySelector(s);
export const qsa = (s) => document.querySelectorAll(s);

// Date formatting helpers
export function formatDate(date, options) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Bangkok",
    ...options,
  }).format(date);
}

export function formatDateRange(start, end) {
  const s = new Date(start);
  const e = new Date(end);

  const day = formatDate(s, { weekday: "short" });
  const date = formatDate(s, { day: "2-digit", month: "short" });
  const tStart = formatDate(s, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const tEnd = formatDate(e, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return { day, date, tStart, tEnd };
}
```

---

### Step 4: Extract API Client (`api.js`)

Create `assets/js/api.js`:

```javascript
import { API_ENDPOINT } from "./config.js";

export async function loadClubs() {
  const res = await fetch(API_ENDPOINT + "?action=filters");
  if (!res.ok) throw new Error("Failed to load clubs");
  const { clubs } = await res.json();
  return clubs;
}

export async function fetchEvents(clubs, levels) {
  let url = API_ENDPOINT + "?action=preview";
  if (clubs.length > 0) url += `&clubs=${clubs.join(",")}`;
  if (levels.length > 0) url += `&levels=${levels.join(",")}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("API request failed");
  const data = await res.json();
  return data;
}
```

---

### Step 5: Extract Calendar Functions (`calendar.js`)

Create `assets/js/calendar.js`:

```javascript
export function generateGoogleCalendarLink(event) {
  const toBangkokCalendarFormat = (iso) => {
    const d = new Date(iso);
    const bangkokTime = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Bangkok",
    }).format(d);

    const [datePart, timePart] = bangkokTime.split(", ");
    const [day, month, year] = datePart.split("/");
    const [hour, minute] = timePart.split(":");

    const bangkokDate = new Date(
      `${year}-${month}-${day}T${hour}:${minute}:00+07:00`,
    );
    const utcYear = bangkokDate.getUTCFullYear();
    const utcMonth = String(bangkokDate.getUTCMonth() + 1).padStart(2, "0");
    const utcDay = String(bangkokDate.getUTCDate()).padStart(2, "0");
    const utcHour = String(bangkokDate.getUTCHours()).padStart(2, "0");
    const utcMin = String(bangkokDate.getUTCMinutes()).padStart(2, "0");

    return `${utcYear}${utcMonth}${utcDay}T${utcHour}${utcMin}00Z`;
  };

  const details = [
    event.club && `📍 Club: ${event.club}`,
    event.level && `🥇 Padel level: ${event.level}`,
  ]
    .filter(Boolean)
    .join("%0A");

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${toBangkokCalendarFormat(event.start)}/${toBangkokCalendarFormat(event.end)}&details=${details}&location=${encodeURIComponent(event.club || "")}&ctz=Asia/Bangkok`;
}

export function generateICS(event) {
  const formatDateBangkok = (iso) => {
    const d = new Date(iso);
    const bangkokTime = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Bangkok",
    }).format(d);

    const [datePart, timePart] = bangkokTime.split(", ");
    const [day, month, year] = datePart.split("/");
    const [hour, minute, second] = timePart.split(":");

    return `${year}${month}${day}T${hour}${minute}${second}`;
  };

  const start = formatDateBangkok(event.start);
  const end = formatDateBangkok(event.end);
  const now = formatDateBangkok(new Date().toISOString());
  const uid = `${event.title.replace(/\s+/g, "-")}-${Date.now()}@padelevents.com`;
  const description = [
    event.club && `Club: ${event.club}`,
    event.level && `Padel level: ${event.level}`,
  ]
    .filter(Boolean)
    .join("\\n");

  return {
    title: event.title,
    start: start,
    end: end,
    now: now,
    uid: uid,
    description: description,
    location: event.club || "",
  };
}

export function downloadICS(icsData) {
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Padel Events Bangkok//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VTIMEZONE
TZID:Asia/Bangkok
BEGIN:STANDARD
DTSTART:19700101T000000
TZOFFSETFROM:+0700
TZOFFSETTO:+0700
TZNAME:+07
END:STANDARD
END:VTIMEZONE
BEGIN:VEVENT
UID:${icsData.uid}
DTSTAMP:${icsData.now}
DTSTART;TZID=Asia/Bangkok:${icsData.start}
DTEND;TZID=Asia/Bangkok:${icsData.end}
SUMMARY:${icsData.title}
DESCRIPTION:${icsData.description}
LOCATION:${icsData.location}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${icsData.title.replace(/\s+/g, "-")}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

---

### Step 6: Extract Filter Logic (`filters.js`)

Create `assets/js/filters.js`:

```javascript
import { STORAGE_KEY } from "./config.js";

export function saveFilters(clubs, levels) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ clubs, levels }));
}

export function loadFilters() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : { clubs: [], levels: [] };
}
```

---

### Step 7: Create Main App Module (`app.js`)

Create `assets/js/app.js` with all remaining logic from the inline script:

```javascript
import { loadClubs, fetchEvents } from "./api.js";
import {
  generateGoogleCalendarLink,
  generateICS,
  downloadICS,
} from "./calendar.js";
import { saveFilters, loadFilters } from "./filters.js";
import { qs, qsa, formatDateRange } from "./utils.js";

// Global state
const selectedLevels = [];
let allClubs = [];
let cachedEvents = null;

// Make downloadICS available globally for inline onclick handlers
window.downloadICS = downloadICS;
window.toggleClubEvents = toggleClubEvents;

// Event listeners
document.addEventListener("click", (e) => {
  const b = e.target.closest(".level-btn");
  if (!b) return;
  const r = b.dataset.range;
  b.classList.toggle("active");
  const i = selectedLevels.indexOf(r);
  if (i >= 0) selectedLevels.splice(i, 1);
  else selectedLevels.push(r);
});

document.addEventListener("change", (e) => {
  if (e.target.matches('#clubBox input[type="checkbox"]')) {
    const label = e.target.closest("label");
    if (e.target.checked) label.classList.add("checked");
    else label.classList.remove("checked");
  }
});

// Load clubs from API
async function loadClubsUI() {
  try {
    const box = qs("#clubBox");
    box.textContent = "Loading clubs...";
    const clubs = await loadClubs();
    allClubs = clubs;
    box.innerHTML = clubs
      .map(
        (c) =>
          `<label class="chip"><input type="checkbox" value="${c.value}" aria-label="Select ${c.label}"><span>${c.label}</span></label>`,
      )
      .join("");
  } catch (err) {
    console.error("Error loading clubs:", err);
    qs("#clubBox").innerHTML =
      '<span class="error">Unable to load clubs. Please refresh.</span>';
  }
}

// Auto-load default events (2 weeks, all clubs)
async function autoLoadEvents() {
  try {
    qs("#status").textContent = "Loading upcoming events...";
    const data = await fetchEvents([], []);
    cachedEvents = data;
    renderEvents(data, "All upcoming events");
    updateLastUpdated();
    qs("#status").textContent = "";
  } catch (err) {
    console.error("Error auto-loading events:", err);
    qs("#status").innerHTML =
      '<span class="error">⚠️ Unable to load events. Please try again.</span>';
    if (cachedEvents) renderEvents(cachedEvents, "Cached events");
  }
}

// Apply filters manually
async function applyFilters() {
  try {
    const clubs = [...qsa("#clubBox input:checked")].map((x) => x.value);
    qs("#status").textContent = "Filtering events...";
    const data = await fetchEvents(clubs, selectedLevels);
    cachedEvents = data;
    const summary = buildFilterSummary(clubs, selectedLevels);
    renderEvents(data, summary);
    updateLastUpdated();
    qs("#status").textContent = "";
  } catch (err) {
    console.error("Error filtering events:", err);
    qs("#status").innerHTML =
      '<span class="error">⚠️ Unable to filter events. Please try again.</span>';
    if (cachedEvents) renderEvents(cachedEvents, "Cached events");
  }
}

// Build filter summary text
function buildFilterSummary(clubs, levels) {
  const parts = [];
  if (clubs.length === 0) parts.push("All clubs");
  else if (clubs.length === 1) {
    const club = allClubs.find((c) => c.value === clubs[0]);
    parts.push(club ? club.label : clubs[0]);
  } else parts.push(`${clubs.length} clubs`);

  if (levels.length === 0) parts.push("All levels");
  else if (levels.length === 1) parts.push(`Level ${levels[0]}`);
  else parts.push(`${levels.length} levels`);

  return parts.join(" • ");
}

// Render events grouped by club
function renderEvents(data, summaryText) {
  const { total, sample } = data;

  if (!sample || sample.length === 0) {
    qs("#previewHeader").style.display = "none";
    qs("#eventsWrap").innerHTML =
      '<div class="empty-state"><p>No events found. Try adjusting your filters.</p></div>';
    return;
  }

  qs("#matchCount").textContent = `${total} events`;
  qs("#filterSummary").textContent = summaryText;
  qs("#previewHeader").style.display = "block";

  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const next7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Filter events happening in next 24 hours
  const happeningSoon = sample
    .filter((ev) => new Date(ev.start) <= next24h)
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  // Group by club for events in next 7 days
  const grouped = {};
  sample.forEach((ev) => {
    const eventDate = new Date(ev.start);
    if (eventDate <= next7days) {
      const club = ev.club || "Other";
      if (!grouped[club]) grouped[club] = [];
      grouped[club].push(ev);
    }
  });

  // Sort events within each club by date
  Object.keys(grouped).forEach((club) => {
    grouped[club].sort((a, b) => new Date(a.start) - new Date(b.start));
  });

  // Render HTML
  let html = "";

  // Happening Soon section
  if (happeningSoon.length > 0) {
    html += `<div class="happening-soon">
      <h2 class="happening-header">⚡ HAPPENING SOON</h2>
      <p class="happening-subtitle">Next events within 24 hours</p>
      <ul class="events-list">`;
    happeningSoon.forEach((ev) => {
      html += renderEventCard(ev);
    });
    html += `</ul></div>`;
  }

  // Club sections (limit to 3 events initially)
  Object.keys(grouped)
    .sort()
    .forEach((club) => {
      const events = grouped[club];
      const initialLimit = 3;
      const hasMore = events.length > initialLimit;

      html += `<div class="club-section" data-club="${club}">
      <h2 class="club-header">📍 ${club}</h2>
      <ul class="events-list">`;

      events.slice(0, initialLimit).forEach((ev) => {
        html += renderEventCard(ev);
      });

      if (hasMore) {
        html += `</ul>
      <ul class="events-list events-hidden" style="display:none;">`;
        events.slice(initialLimit).forEach((ev) => {
          html += renderEventCard(ev);
        });
      }

      html += `</ul>`;

      if (hasMore) {
        const moreCount = events.length - initialLimit;
        html += `<button class="btn-show-more" onclick="toggleClubEvents('${club}')" aria-label="Show ${moreCount} more events from ${club}">
        Show ${moreCount} more event${moreCount > 1 ? "s" : ""} →
      </button>`;
      }

      html += `</div>`;
    });

  qs("#eventsWrap").innerHTML = html;
}

// Toggle show more events for a club
function toggleClubEvents(club) {
  const section = qs(`.club-section[data-club="${club}"]`);
  if (!section) return;
  const hiddenList = section.querySelector(".events-hidden");
  const btn = section.querySelector(".btn-show-more");
  if (hiddenList && btn) {
    hiddenList.style.display = "flex";
    btn.remove();
  }
}

// Render single event card
function renderEventCard(ev) {
  const { day, date, tStart, tEnd } = formatDateRange(ev.start, ev.end);
  const now = new Date();
  const isPast = new Date(ev.end) < now;

  const gcalLink = generateGoogleCalendarLink(ev);
  const icsData = generateICS(ev);

  return `<li class="event-card${isPast ? " event-past" : ""}">
    <div class="event-title">${ev.title}</div>
    <div class="event-datetime">${day} ${date} • ${tStart}–${tEnd}</div>
    <div class="event-details">
      ${ev.club ? `<span class="detail-item detail-club">📍 ${ev.club}</span>` : ""}
      ${ev.level ? `<span class="detail-item">🥇 Padel level: ${ev.level}</span>` : ""}
    </div>
    <div class="event-actions-label">📅 Add to calendar</div>
    <div class="event-actions">
      <a href="${gcalLink}" target="_blank" rel="noopener noreferrer" class="btn-calendar btn-google" aria-label="Add ${ev.title} to Google Calendar">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.68 8.18c0-.57-.05-1.11-.15-1.64H8v3.1h4.3c-.18.97-.74 1.79-1.57 2.34v2.01h2.54c1.49-1.37 2.35-3.39 2.35-5.81z" fill="#4285F4"/><path d="M8 16c2.12 0 3.9-.7 5.2-1.9l-2.54-1.97c-.7.47-1.6.75-2.66.75-2.04 0-3.77-1.38-4.39-3.23H.93v2.03A8 8 0 008 16z" fill="#34A853"/><path d="M3.61 9.65a4.8 4.8 0 010-3.3V4.32H.93a8 8 0 000 7.36l2.68-2.03z" fill="#FBBC05"/><path d="M8 3.18c1.15 0 2.18.4 2.99 1.17l2.24-2.24C11.89.79 10.11 0 8 0a8 8 0 00-7.07 4.32l2.68 2.03C4.23 4.56 5.96 3.18 8 3.18z" fill="#EA4335"/></svg>
        Google Calendar
      </a>
      <button class="btn-calendar btn-ics" onclick='downloadICS(${JSON.stringify(icsData)})' aria-label="Download ${ev.title} as ICS file">
        📅 Add to Calendar
      </button>
    </div>
  </li>`;
}

// Update last updated timestamp
function updateLastUpdated() {
  const now = new Date();
  const formatted = new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Bangkok",
  }).format(now);
  qs("#lastUpdated").textContent = formatted.replace(", ", " ");
}

// Initialize
qs("#btnFilter").onclick = applyFilters;
document.addEventListener("DOMContentLoaded", async () => {
  await loadClubsUI();
  await autoLoadEvents();
});
```

---

### Step 8: Update `index.html`

Replace the inline `<script>` block with a module import:

```html
<!-- Remove entire inline <script> block -->
<!-- Replace with: -->
<script type="module" src="/assets/js/app.js"></script>
```

---

### Step 9: Update `firebase.json` Cache Headers

Add caching for JS modules:

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

---

## Testing Checklist

### Local Testing

```bash
# Option 1: Firebase serve
firebase serve

# Option 2: Local HTTP server (Python)
python3 -m http.server 8000

# Option 3: Local HTTP server (Node.js)
npx http-server -p 8000
```

### Manual Tests

- [ ] Page loads without console errors
- [ ] Clubs load and display correctly
- [ ] Events auto-load on page load
- [ ] Filter buttons toggle active state
- [ ] Apply Filters button fetches filtered events
- [ ] Google Calendar links open with correct data
- [ ] ICS download works (test in Apple Calendar, Google Calendar, Outlook)
- [ ] Events grouped by club correctly
- [ ] "Show more" button expands hidden events
- [ ] Last updated timestamp displays
- [ ] Error messages appear on API failure

### Browser Compatibility

Test in:

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (macOS/iOS)
- [ ] Edge (latest)

### Mobile Testing

- [ ] iOS Safari (iPhone)
- [ ] Chrome on Android
- [ ] Touch targets >= 44px
- [ ] No horizontal scroll

---

## Rollback Plan

If issues arise:

1. **Quick rollback**: Restore inline script from `index.backup.html`
2. **Git rollback**: `git reset --hard HEAD~1` (if committed)
3. **Keep backup**: Copy current `index.html` before migration

---

## Deployment

```bash
# Test locally first
firebase serve

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Verify production site
open https://padel-events-bangkok.web.app
```

---

## Post-Migration

### Next Steps

1. **Add ESLint config** for JS modules
2. **Add unit tests** for `calendar.js` and `filters.js`
3. **Monitor performance** (check Network tab for HTTP requests)
4. **Gather user feedback** on load times and functionality

### Performance Metrics

- Baseline (before): ~1 HTML file + 1 CSS file = 2 requests
- After migration: 1 HTML + 1 CSS + 6 JS modules = 8 requests
- **Mitigation**: HTTP/2 multiplexing, aggressive caching, consider bundling later if needed

---

## Estimated Effort

- **Extraction**: 2–3 hours
- **Testing**: 1–2 hours
- **Deployment**: 30 minutes
- **Total**: ~4–6 hours

---

## Success Criteria

✅ All existing features work identically to inline version  
✅ No console errors in Chrome/Firefox/Safari  
✅ ICS download works on iOS and Android  
✅ Code is organized into logical modules  
✅ Caching headers optimize load times  
✅ ESLint runs cleanly on extracted JS files

---

**Ready to start?** Follow steps 1–9 sequentially and test after each step.
