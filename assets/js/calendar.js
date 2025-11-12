/**
 * Google Calendar and ICS file generation
 */

/**
 * Generate Google Calendar link for an event
 * @param {object} event - Event object with title, start, end, club, level
 * @returns {string} Google Calendar URL
 */
export function generateGoogleCalendarLink(event) {
  const toBangkokCalendarFormat = (iso) => {
    const date = new Date(iso);
    // Format for Google Calendar (YYYYMMDDTHHMMSS in local Bangkok time, then convert to UTC for URL)
    const bangkokTime = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Bangkok",
    }).format(date);

    const [datePart, timePart] = bangkokTime.split(", ");
    const [day, month, year] = datePart.split("/");
    const [hour, minute] = timePart.split(":");

    // Google Calendar needs UTC time with Z suffix
    // Bangkok is UTC+7, so we need to subtract 7 hours
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

  // Use mapLink if available, otherwise fall back to club name
  const location = event.mapLink
    ? encodeURIComponent(event.mapLink)
    : encodeURIComponent(event.club || "");

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${toBangkokCalendarFormat(event.start)}/${toBangkokCalendarFormat(event.end)}&details=${details}&location=${location}&ctz=Asia/Bangkok`;
}

/**
 * Generate ICS file data for an event
 * @param {object} event - Event object with title, start, end, club, level
 * @returns {object} ICS data object
 */
export function generateICS(event) {
  const formatDateBangkok = (iso) => {
    const date = new Date(iso);
    // Convert to Bangkok timezone
    const bangkokTime = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Bangkok",
    }).format(date);

    // Parse: DD/MM/YYYY, HH:MM:SS
    const [datePart, timePart] = bangkokTime.split(", ");
    const [day, month, year] = datePart.split("/");
    const [hour, minute, second] = timePart.split(":");

    return `${year}${month}${day}T${hour}${minute}${second}`;
  };

  const start = formatDateBangkok(event.start);
  const end = formatDateBangkok(event.end);
  const now = formatDateBangkok(new Date().toISOString());
  const uid = `${event.title.replaceAll(/\s+/g, "-")}-${Date.now()}@padelevents.com`;
  const description = [
    event.club && `Club: ${event.club}`,
    event.level && `Padel level: ${event.level}`,
  ]
    .filter(Boolean)
    .join(String.raw`\n`);

  // Use mapLink for location if available, otherwise use club name
  const location = event.mapLink || event.club || "";

  return {
    title: event.title,
    start,
    end,
    now,
    uid,
    description,
    location,
  };
}

/**
 * Download ICS file for an event
 * @param {object} icsData - ICS data object from generateICS
 */
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
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${icsData.title.replaceAll(/\s+/g, "-")}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
