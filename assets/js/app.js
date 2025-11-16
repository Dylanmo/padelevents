/**
 * Main application entry point
 * Orchestrates all modules and initializes the app
 */

import { loadClubs, fetchEvents, fetchLatestCommit } from "./api.js";
import {
  generateGoogleCalendarLink,
  generateICS,
  downloadICS,
} from "./calendar.js";
import { buildFilterSummary, getSelectedClubs } from "./filters.js";
import {
  qs,
  qsa,
  formatBangkokDate,
  formatCommitDate,
  detectDevice,
} from "./utils.js";
import { CITY_CONFIG } from "./config.js";

// Application state
const state = {
  selectedLevels: [],
  allClubs: [],
  cachedEvents: null,
};

// Detect device type on app initialization
const DEVICE = detectDevice();

/**
 * Get the appropriate signup URL for the user's device
 * Implements fallback logic based on device type
 * @param {object} event - Event object with signup fields
 * @param {string} device - Device type ('ios' | 'android' | 'desktop')
 * @returns {string|null} Signup URL or null if none available
 */
function getSignupUrlForDevice(event, device) {
  if (device === "ios") {
    return (
      event.signupIos || event.signupIosFallback || event.signupWeb || null
    );
  }
  if (device === "android") {
    return event.signupAndroid || event.signupWeb || null;
  }
  // desktop - prioritize web signup
  return event.signupWeb || null;
}

/**
 * Get signup URLs and descriptions for desktop display
 * Returns web signup and fallback mobile options
 * For iOS, always use signupIosFallback for desktop users
 * @param {object} event - Event object with signup fields
 * @returns {object} { webUrl, iosUrl, androidUrl, hasWebUrl }
 */
function getDesktopSignupOptions(event) {
  return {
    webUrl: event.signupWeb || null,
    iosUrl: event.signupIosFallback || null,
    androidUrl: event.signupAndroid || null,
    hasWebUrl: !!event.signupWeb,
  };
}

/**
 * Initialize the application
 */
async function init() {
  updateVersion();
  setupFooterEmailLinks();
  await initializeClubs();
  await autoLoadEvents();
  attachEventListeners();
}

/**
 * Setup footer email links based on device type
 * Mobile: use mailto links
 * Desktop: use Gmail compose URLs
 */
function setupFooterEmailLinks() {
  // Detect if user is on mobile device
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    ) ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);

  const emailLinks = qsa(".footer-email-link");

  for (const link of emailLinks) {
    if (!isMobile) {
      // Desktop: use Gmail link
      const gmailUrl = link.dataset.gmail;
      if (gmailUrl) {
        link.href = gmailUrl;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
    }
    // Mobile: keep mailto (already in HTML)
  }
}

/**
 * Update version display with latest GitHub commit info
 */
async function updateVersion() {
  const versionEl = qs(".version");
  try {
    const { sha, date } = await fetchLatestCommit();
    const formattedDate = formatCommitDate(date);
    versionEl.textContent = `v${sha} • ${formattedDate}`;
  } catch (error) {
    console.error("Failed to fetch version:", error);
    versionEl.textContent = "Version unavailable";
  }
}

/**
 * Load clubs from API and render checkboxes
 */
async function initializeClubs() {
  try {
    const box = qs("#clubBox");
    const loadingEl = qs("#clubsLoading");
    const clubFilterGroup = qs("#clubFilterGroup");
    const levelFilterGroup = qs("#levelFilterGroup");
    const filterBar = qs("#filterBar");

    // Show loading animation
    if (loadingEl) {
      loadingEl.style.display = "flex";
    }

    const clubs = await loadClubs();
    state.allClubs = clubs;

    // Hide loading animation
    if (loadingEl) {
      loadingEl.style.display = "none";
    }

    // Render club chips
    box.innerHTML = clubs
      .map(
        (club) =>
          `<label class="chip"><input type="checkbox" value="${club.value}" aria-label="Select ${club.label}"><span>${club.label}</span></label>`,
      )
      .join("");

    // Show all filter sections now that clubs are loaded
    if (clubFilterGroup) {
      clubFilterGroup.style.display = "block";
    }
    if (levelFilterGroup) {
      levelFilterGroup.style.display = "block";
    }
    if (filterBar) {
      filterBar.style.display = "flex";
    }
  } catch (error) {
    console.error("Error loading clubs:", error);
    const loadingEl = qs("#clubsLoading");
    const clubFilterGroup = qs("#clubFilterGroup");
    if (loadingEl) {
      loadingEl.style.display = "none";
    }
    qs("#clubBox").innerHTML =
      '<span class="error">Unable to load clubs. Please refresh.</span>';
    if (clubFilterGroup) {
      clubFilterGroup.style.display = "block";
    }
  }
}

/**
 * Auto-load default events (2 weeks, all clubs)
 */
async function autoLoadEvents() {
  try {
    qs("#status").textContent = "Loading upcoming events...";

    const data = await fetchEvents([], []);
    state.cachedEvents = data;

    const cityName = CITY_CONFIG.bangkok.name;
    renderEvents(data, `All upcoming events in ${cityName}`);
    qs("#status").textContent = "";
  } catch (error) {
    console.error("Error auto-loading events:", error);
    qs("#status").innerHTML =
      '<span class="error">⚠️ Unable to load events. Please try again.</span>';

    if (state.cachedEvents) {
      const cityName = CITY_CONFIG.bangkok.name;
      renderEvents(state.cachedEvents, `Cached events in ${cityName}`);
    }
  }
}

/**
 * Apply filters manually
 */
async function applyFilters() {
  try {
    const clubs = getSelectedClubs(qsa("#clubBox input:checked"));
    qs("#status").textContent = "Filtering events...";

    const data = await fetchEvents(clubs, state.selectedLevels);
    state.cachedEvents = data;

    const summary = buildFilterSummary(
      clubs,
      state.selectedLevels,
      state.allClubs,
    );
    renderEvents(data, summary);
    qs("#status").textContent = "";

    // Scroll to results after rendering
    setTimeout(() => {
      const eventsSection = qs("#eventsSection");
      if (eventsSection) {
        eventsSection.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  } catch (error) {
    console.error("Error filtering events:", error);
    qs("#status").innerHTML =
      '<span class="error">⚠️ Unable to filter events. Please try again.</span>';

    if (state.cachedEvents) {
      renderEvents(state.cachedEvents, "Cached events");
    }
  }
}

/**
 * Filter events by a specific club (show all events for that club)
 * @param {string} clubDisplayName - Display name of the club to filter by
 */
async function filterByClub(clubDisplayName) {
  try {
    // Find the club value from display name
    const club = state.allClubs.find((c) => c.label === clubDisplayName);
    if (!club) {
      console.error("Club not found:", clubDisplayName);
      return;
    }

    const clubValue = club.value;

    // Update status
    const statusEl = qs("#status");
    statusEl.textContent = `Loading all ${clubDisplayName} events...`;

    try {
      // Fetch all events for this club
      const data = await fetchEvents([clubValue], []);

      // Check and update the club checkbox in UI
      const clubCheckboxes = qsa("#clubBox input");
      for (const checkbox of clubCheckboxes) {
        const label = checkbox.closest("label");
        if (checkbox.value === clubValue) {
          checkbox.checked = true;
          label.classList.add("checked");
        } else {
          checkbox.checked = false;
          label.classList.remove("checked");
        }
      }

      // Clear level filters in UI
      state.selectedLevels = [];
      for (const btn of qsa(".level-btn")) {
        btn.classList.remove("active");
      }

      // Store the data
      state.cachedEvents = data;

      // Render all events for this club
      const summary = `Showing ${data.total} events for ${clubDisplayName}`;
      renderEvents(data, summary, true, clubDisplayName); // Pass club name for header

      // Scroll to events
      qs("#eventsSection").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      statusEl.textContent = "";
    } catch (fetchError) {
      console.error("Error fetching club events:", fetchError);
      statusEl.innerHTML =
        '<span class="error">⚠️ Unable to load events. Please try again.</span>';
      throw fetchError;
    }
  } catch (error) {
    console.error("Error in filterByClub:", error);
  }
}

/**
 * Filter events happening within a time window
 * @param {Array} events - Array of events
 * @param {Date} cutoffDate - Cutoff date for filtering
 * @returns {Array} Filtered and sorted events
 */
function filterHappeningSoon(events, cutoffDate) {
  return events
    .filter((event) => new Date(event.start) <= cutoffDate)
    .sort((a, b) => new Date(a.start) - new Date(b.start));
}

/**
 * Group events by club within a time range
 * @param {Array} events - Array of events
 * @param {Date} endDate - End date for filtering
 * @returns {Object} Events grouped by club name
 */
function groupEventsByClub(events, endDate) {
  const grouped = {};

  for (const event of events) {
    const eventDate = new Date(event.start);
    if (eventDate <= endDate) {
      const club = event.club || "Other";
      if (!grouped[club]) {
        grouped[club] = [];
      }
      grouped[club].push(event);
    }
  }

  // Sort events within each club by date
  for (const club of Object.keys(grouped)) {
    grouped[club].sort((a, b) => new Date(a.start) - new Date(b.start));
  }

  return grouped;
}

/**
 * Render the "Happening Soon" section HTML
 * @param {Array} events - Events to render
 * @param {number} initialLimit - Number of events to show initially on desktop
 * @returns {string} HTML string
 */
function renderHappeningSoonSection(events, initialLimit = 3) {
  if (events.length === 0) return "";

  const hasMore = events.length > initialLimit;

  // Render all events, hiding those beyond the initial limit
  const allEvents = events
    .map((event, index) => {
      const isHidden = index >= initialLimit;
      return renderEventCard(event, isHidden);
    })
    .join("");

  let showMoreButton = "";
  if (hasMore) {
    const moreCount = events.length - initialLimit;
    const plural = moreCount > 1 ? "s" : "";
    showMoreButton = `<button class="btn-show-more" data-section="happening-soon" aria-label="Show ${moreCount} more happening soon events">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
			</svg>
			Show ${moreCount} more event${plural}
		</button>`;
  }

  return `<div class="happening-soon">
		<h2 class="happening-header">
			<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="currentColor"/>
			</svg>
			Today &amp; Tomorrow
		</h2>
		<ul class="events-list">${allEvents}</ul>
		${showMoreButton}
	</div>`;
}

/**
 * Render a club section with events
 * @param {string} club - Club name
 * @param {Array} events - Events for this club
 * @param {number} initialLimit - Number of events to show initially
 * @returns {string} HTML string
 */
function renderClubSection(club, events, initialLimit = 3) {
  const hasMore = events.length > initialLimit;

  // Render all events in a single list, hiding those beyond the initial limit
  const allEvents = events
    .map((event, index) => {
      const isHidden = index >= initialLimit;
      return renderEventCard(event, isHidden);
    })
    .join("");

  let showMoreButton = "";
  if (hasMore) {
    const moreCount = events.length - initialLimit;
    const plural = moreCount > 1 ? "s" : "";
    showMoreButton = `<button class="btn-show-more" data-club="${club}" aria-label="Show ${moreCount} more events from ${club}">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
				<path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
			</svg>
			Show ${moreCount} more event${plural}
		</button>`;
  }

  return `<div class="club-section" data-club="${club}">
		<h2 class="club-header">
			<span class="club-header-text">
				<svg class="location-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
				</svg>
				${club}
			</span>
			<a href="#" class="club-link" data-club="${club}" aria-label="View all ${club} events">
				View all
				<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
					<path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</a>
		</h2>
		<ul class="events-list">${allEvents}</ul>
		${showMoreButton}
	</div>`;
}

/**
 * Render events grouped by club
 * @param {object} data - Event data with total and sample
 * @param {string} summaryText - Filter summary text
 * @param {boolean} isSingleClubView - Whether viewing all events for a single club
 * @param {string} clubName - Club display name for single club view
 */
function renderEvents(
  data,
  summaryText,
  isSingleClubView = false,
  clubName = "",
) {
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

  // If viewing all events for a single club, show them all in chronological order
  if (isSingleClubView) {
    const sortedEvents = [...sample].sort(
      (a, b) => new Date(a.start) - new Date(b.start),
    );
    const eventCards = sortedEvents
      .map((event) => renderEventCard(event))
      .join("");
    const clubHeader = clubName
      ? `<div class="club-section">
			<h2 class="club-header">
				<span class="club-header-text">
					<svg class="location-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
					</svg>
					${clubName}
				</span>
			</h2>
			<ul class="events-list">${eventCards}</ul>
		</div>`
      : `<ul class="events-list">${eventCards}</ul>`;
    qs("#eventsWrap").innerHTML = clubHeader;
    return;
  }

  const now = new Date();
  const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const next7days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const happeningSoon = filterHappeningSoon(sample, next24h);
  const grouped = groupEventsByClub(sample, next7days);

  const happeningSoonHtml = renderHappeningSoonSection(happeningSoon);
  const sortedClubs = Object.keys(grouped).sort((a, b) => a.localeCompare(b));
  const clubSectionsHtml = sortedClubs
    .map((club) => renderClubSection(club, grouped[club], 3))
    .join("");

  qs("#eventsWrap").innerHTML = happeningSoonHtml + clubSectionsHtml;
}

/**
 * Render single event card
 * @param {object} event - Event object
 * @param {boolean} isHidden - Whether the event should be initially hidden
 * @returns {string} HTML string
 */
function renderEventCard(event, isHidden = false) {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const now = new Date();
  const isPast = end < now;

  const day = formatBangkokDate(start, "weekday");
  const date = formatBangkokDate(start, "date");
  const timeStart = formatBangkokDate(start, "time");
  const timeEnd = formatBangkokDate(end, "time");

  const gcalLink = generateGoogleCalendarLink(event);
  const icsData = generateICS(event);

  const hiddenClass = isHidden ? " event-hidden" : "";
  const hiddenStyle = isHidden ? ' style="display: none;"' : "";

  // Build signup button HTML
  let signupButtonHtml = "";
  if (DEVICE === "desktop") {
    // For desktop: show web signup with mobile fallback option as pill buttons
    const options = getDesktopSignupOptions(event);
    if (options.webUrl || options.iosUrl || options.androidUrl) {
      const buttons = [];

      if (options.webUrl) {
        buttons.push(`<a href="${options.webUrl}" target="_blank" rel="noopener noreferrer" class="signup-pill">
			Web
		</a>`);
      }

      if (options.iosUrl) {
        buttons.push(`<a href="${options.iosUrl}" target="_blank" rel="noopener noreferrer" class="signup-pill">
			<img src="/assets/svg/icon-apple.svg" alt="Apple" class="signup-icon" width="16" height="16" />
			iOS
		</a>`);
      }

      if (options.androidUrl) {
        buttons.push(`<a href="${options.androidUrl}" target="_blank" rel="noopener noreferrer" class="signup-pill">
			<img src="/assets/svg/icon-android.svg" alt="Android" class="signup-icon" width="16" height="16" />
			Android
		</a>`);
      }

      signupButtonHtml = `<div class="event-signup">
		<div class="signup-row">
			<p class="signup-text">Join event:</p>
			<div class="signup-pills">
				${buttons.join("")}
			</div>
		</div>
	</div>`;
    }
  } else {
    // For mobile: show single signup button with relevant icon
    const signupUrl = getSignupUrlForDevice(event, DEVICE);
    if (signupUrl) {
      const platformLabel = event.signupPlatform || "App";
      let iconHtml = "";

      if (DEVICE === "ios") {
        iconHtml = `<img src="/assets/svg/icon-apple.svg" alt="Apple" class="signup-icon-mobile" width="18" height="18" />`;
      } else if (DEVICE === "android") {
        iconHtml = `<img src="/assets/svg/icon-android.svg" alt="Android" class="signup-icon-mobile" width="18" height="18" />`;
      }

      signupButtonHtml = `<div class="event-signup">
			<a href="${signupUrl}" target="_blank" rel="noopener noreferrer" class="btn-calendar btn-signup" aria-label="Join event via ${platformLabel}">
				${iconHtml}
				Join event ${platformLabel}
			</a>
		</div>`;
    }
  }

  return `<li class="event-card${isPast ? " event-past" : ""}${hiddenClass}"${hiddenStyle}>
		<div class="event-title">${event.title}</div>
		<div class="event-datetime">${day} ${date} • ${timeStart}–${timeEnd}</div>
		<div class="event-details">
			${event.club ? `<span class="detail-item detail-club"><svg class="location-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/></svg> ${event.club}</span>` : ""}
			${event.level ? `<span class="detail-item detail-level"><svg class="level-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/></svg> <strong>Level:</strong> ${event.level}</span>` : ""}
		</div>
		<div class="event-actions">
			<a href="${gcalLink}" target="_blank" rel="noopener noreferrer" class="btn-calendar btn-google" aria-label="Add ${event.title} to Google Calendar">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
					<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
					<line x1="16" y1="2" x2="16" y2="6"></line>
					<line x1="8" y1="2" x2="8" y2="6"></line>
					<line x1="3" y1="10" x2="21" y2="10"></line>
					<line x1="10" y1="16" x2="14" y2="16"></line>
					<line x1="12" y1="14" x2="12" y2="18"></line>
				</svg>
				Google Calendar
			</a>
			<button class="btn-calendar btn-ics" data-ics='${JSON.stringify(icsData)}' aria-label="Download ${event.title} as ICS file">
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
					<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
					<line x1="16" y1="2" x2="16" y2="6"></line>
					<line x1="8" y1="2" x2="8" y2="6"></line>
					<line x1="3" y1="10" x2="21" y2="10"></line>
					<line x1="10" y1="16" x2="14" y2="16"></line>
					<line x1="12" y1="14" x2="12" y2="18"></line>
				</svg>
				Calendar (ICS)
			</button>
		</div>
		${signupButtonHtml}
	</li>`;
}

/**
 * Toggle show more events for a club or section
 * @param {string} club - Club name (for club sections)
 * @param {string} sectionType - Section type ('happening-soon' for Happening Soon)
 */
function toggleClubEvents(club, sectionType = null) {
  let section = null;

  if (sectionType === "happening-soon") {
    // Find the happening-soon section
    section = qs(".happening-soon");
  } else {
    // Find the club section by iterating through all club sections
    const sections = qsa(".club-section");

    for (const sec of sections) {
      if (sec.dataset.club === club) {
        section = sec;
        break;
      }
    }
  }

  if (!section) {
    console.error("Section not found:", club || sectionType);
    return;
  }

  // Find all hidden event cards and show them
  const hiddenEvents = section.querySelectorAll(".event-hidden");
  const button = section.querySelector(".btn-show-more");

  if (hiddenEvents.length > 0 && button) {
    for (const event of hiddenEvents) {
      event.style.display = "";
      event.classList.remove("event-hidden");
    }
    button.remove();
  }
}

/**
 * Attach event listeners
 */
function attachEventListeners() {
  // Level button toggle
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".level-btn");
    if (button) {
      const range = button.dataset.range;
      button.classList.toggle("active");

      const index = state.selectedLevels.indexOf(range);
      if (index >= 0) {
        state.selectedLevels.splice(index, 1);
      } else {
        state.selectedLevels.push(range);
      }
    }

    // Club "View all" link
    const clubLink = event.target.closest(".club-link");
    if (clubLink) {
      event.preventDefault();
      const clubName = clubLink.dataset.club;
      filterByClub(clubName);
    }

    // Show more button
    const showMoreBtn = event.target.closest(".btn-show-more");
    if (showMoreBtn) {
      const club = showMoreBtn.dataset.club;
      const section = showMoreBtn.dataset.section;

      if (section === "happening-soon") {
        toggleClubEvents(null, "happening-soon");
      } else if (club) {
        toggleClubEvents(club);
      }
    }

    // ICS download button
    const icsBtn = event.target.closest(".btn-ics");
    if (icsBtn) {
      const icsData = JSON.parse(icsBtn.dataset.ics);
      downloadICS(icsData);
    }
  });

  // Club checkbox change
  document.addEventListener("change", (event) => {
    if (event.target.matches('#clubBox input[type="checkbox"]')) {
      const label = event.target.closest("label");
      if (event.target.checked) {
        label.classList.add("checked");
      } else {
        label.classList.remove("checked");
      }
    }
  });

  // Apply filters button
  qs("#btnFilter").addEventListener("click", applyFilters);
}

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", init);
