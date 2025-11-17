/** BASIC CONFIG **/
const CFG = { RAW_SHEET: "event_recurring5", TZ: "Asia/Bangkok" };

/** ──────────────────────────────────────────────────────────────
 *  Router: serve HTML by default; handle JSON & ICS actions
 *  ────────────────────────────────────────────────────────────── */
function doGet(e) {
  const p = e && e.parameter ? e.parameter : {};
  const action = String(p.action || "").toLowerCase();

  if (action === "preview") {
    // /exec?action=preview&clubs=A,B,C&levels=0-2,3-4&types=Americano,Social&categories=Mixed&limit=200
    const clubs = String(p.clubs || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const levels = String(p.levels || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const types = String(p.types || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const categories = String(p.categories || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const limit = Math.min(Number(p.limit || 200), 1000);
    const res = previewByClubs({ clubs, levels, types, categories, limit });
    return _json(res);
  }

  if (action === "filters") {
    return _json(getFilterOptions());
  }

  if (action === "meta") {
    return _json(getMeta());
  }

  if (action === "ics") {
    // /exec?action=ics&clubs=A,B,C&levels=0-2,3-4&types=Americano&categories=Mixed
    const clubs = String(p.clubs || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const levels = String(p.levels || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const types = String(p.types || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const categories = String(p.categories || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const { sample } = previewByClubs({
      clubs,
      levels,
      types,
      categories,
      limit: 800,
    });
    const icsText = buildICS_(sample, CFG.TZ);
    return ContentService.createTextOutput(icsText).setMimeType(
      ContentService.MimeType.ICAL
    );
  }

  // Default: serve the web app page
  return HtmlService.createHtmlOutputFromFile("Page")
    .setTitle("Padel Event Calendar")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/** Utils for router */
function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/** Build info for footer (formatted as YYYY/MM/DD HH:mm:ss) */
function getBuildInfo() {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: CFG.TZ,
  });

  const parts = fmt.formatToParts(now);
  const lookup = (name) => parts.find((p) => p.type === name)?.value || "";
  const formatted = `${lookup("year")}/${lookup("month")}/${lookup("day")} ${lookup("hour")}:${lookup("minute")}:${lookup("second")}`;

  return { version: formatted, tz: CFG.TZ };
}

/** Utils **/
function normalize(s) {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}
function sheetToObjects(sh) {
  const values = sh.getDataRange().getDisplayValues();
  if (!values.length) return [];
  const head = values[0].map(normalize);
  return values
    .slice(1)
    .filter((r) => r.some((x) => String(x).trim() !== ""))
    .map((r) => Object.fromEntries(head.map((k, i) => [k, r[i]])));
}
function isCancelled(r) {
  return String(r.status || "").toLowerCase() === "cancelled";
}
function parseLevelRange(s) {
  const m = String(s || "").match(
    /([0-9]+(?:\.[0-9]+)?)\s*[–-]\s*([0-9]+(?:\.[0-9]+)?)/
  );
  return m
    ? { min: parseFloat(m[1]), max: parseFloat(m[2]) }
    : { min: null, max: null };
}
function prettyClubLabelFromClub(rawClub) {
  const txt = String(rawClub || "").trim();
  if (!txt) return "";
  const part = txt.split("|").pop();
  const words = part.replace(/_/g, " ").toLowerCase().split(" ");
  return words.map((w) => (w ? w[0].toUpperCase() + w.slice(1) : "")).join(" ");
}
function asInt(x) {
  const n = parseInt(String(x || "").replace(/[^\d-]/g, ""), 10);
  return Number.isFinite(n) ? n : null;
}

/** Meta: get last updated from 'generated_at' column */
function getMeta() {
  const ss = SpreadsheetApp.getActive();
  const rows = sheetToObjects(ss.getSheetByName(CFG.RAW_SHEET));
  let latest = null;
  rows.forEach((r) => {
    const d = new Date(r.generated_at || r.generatedat || r.updated_at || "");
    if (!isNaN(d)) {
      if (!latest || d > latest) latest = d;
    }
  });
  return { lastUpdated: latest ? latest.toISOString() : null };
}

/** 1) Filter options: clubs, types, categories */
function getFilterOptions() {
  const ss = SpreadsheetApp.getActive();
  const rows = sheetToObjects(ss.getSheetByName(CFG.RAW_SHEET));

  const clubMap = new Map();
  const typeMap = new Map();
  const categoryMap = new Map();

  rows.forEach((r) => {
    const clubValue = String(r.club || "").trim();
    if (clubValue && !clubMap.has(clubValue)) {
      clubMap.set(clubValue, {
        value: clubValue,
        label: prettyClubLabelFromClub(clubValue) || clubValue,
      });
    }

    const typeValue = String(r.type || r.event_type || r.format || "").trim();
    if (typeValue && !typeMap.has(typeValue)) {
      typeMap.set(typeValue, {
        value: typeValue,
        label: typeValue,
      });
    }

    const categoryValue = String(r.category || r.event_category || "").trim();
    if (categoryValue && !categoryMap.has(categoryValue)) {
      categoryMap.set(categoryValue, {
        value: categoryValue,
        label: categoryValue,
      });
    }
  });

  const clubs = Array.from(clubMap.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
  const types = Array.from(typeMap.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
  const categories = Array.from(categoryMap.values()).sort((a, b) =>
    a.label.localeCompare(b.label)
  );

  return { clubs, types, categories };
}

/** 2) Preview by selected clubs, levels, types, categories — returns enriched event info */
function previewByClubs(payload) {
  const { clubs, limit, levels, types, categories } = payload;
  const ss = SpreadsheetApp.getActive();
  const raw = sheetToObjects(ss.getSheetByName(CFG.RAW_SHEET));

  const overlaps = (emin, emax, umin, umax) => emin <= umax && emax >= umin;

  const filtered = raw
    .filter((r) => r.date_start && r.date_end && !isCancelled(r))
    .filter((r) =>
      clubs && clubs.length ? clubs.includes(String(r.club || "").trim()) : true
    )
    .filter((r) => {
      if (!levels || levels.length === 0) return true;
      const lr = parseLevelRange(r.level_range || r.level || "");
      if (lr.min == null || lr.max == null) return false;
      return levels.some((pair) => {
        const [umin, umax] = String(pair).split("-").map(parseFloat);
        if (!Number.isFinite(umin) || !Number.isFinite(umax)) return true;
        return overlaps(lr.min, lr.max, umin, umax);
      });
    })
    .filter((r) => {
      if (!types || types.length === 0) return true;
      const eventType = String(r.type || r.event_type || r.format || "").trim();
      return types.includes(eventType);
    })
    .filter((r) => {
      if (!categories || categories.length === 0) return true;
      const eventCategory = String(r.category || r.event_category || "").trim();
      return categories.includes(eventCategory);
    })
    .sort((a, b) => new Date(a.date_start) - new Date(b.date_start));

  const out = (limit ? filtered.slice(0, limit) : filtered).map((r) => {
    const lvl = parseLevelRange(r.level_range || r.level || "");
    const clubCode = String(r.club || "").trim();

    // Price fallbacks
    const price = r.price || r.fee || r.cost || "";
    // Type / Category fallbacks
    const eventType = r.type || r.event_type || r.format || "";
    const eventCategory =
      r.category || r.event_category || r.type || r.format || "";
    // Location (override if a dedicated field exists)
    const location = r.location || prettyClubLabelFromClub(clubCode);

    // Capacity / availability fallbacks
    const total = asInt(
      r.spots_total || r.capacity || r.slots_total || r.total
    );
    const available = asInt(
      r.spots_available || r.available || r.slots_open || r.open
    );

    // Signup platform + links (from sheet columns)
    const signupPlatform = r.signup_platform || "";
    const signupIos = r.signup_ios || "";
    const signupIosFallback = r.signup_ios_fallback || "";
    const signupAndroid = r.signup_android || "";
    const signupWeb = r.signup_web || "";

    // URL used for ICS + generic link; fall back to signup_web if needed
    const url = r.url || r.link || signupWeb || "";

    const levelMin = lvl.min;
    const levelMax = lvl.max;
    const status = r.status || "";
    const generatedAt = r.generated_at || r.generatedat || r.updated_at || "";

    return {
      id: r.instance_id || r.id || "",
      start: new Date(r.date_start).toISOString(),
      end: new Date(r.date_end).toISOString(),
      title: r.event || "Padel",
      club: prettyClubLabelFromClub(clubCode),
      clubCode,
      level: lvl.min != null && lvl.max != null ? `${lvl.min}–${lvl.max}` : "",
      levelMin,
      levelMax,
      price,
      type: eventType,
      category: eventCategory,
      status,
      total,
      available,
      location,
      url,
      description: r.description || r.details || "",
      signupPlatform,
      signupIos,
      signupIosFallback,
      signupAndroid,
      signupWeb,
      generatedAt,
    };
  });

  return { total: filtered.length, sample: out };
}

/** ──────────────────────────────────────────────────────────────
 *  ICS builder (iOS-friendly; includes VTIMEZONE)
 *  ────────────────────────────────────────────────────────────── */
function buildICS_(events, tz) {
  const nowZ = Utilities.formatDate(new Date(), "UTC", "yyyyMMdd'T'HHmmss'Z'");
  const lines = [];
  lines.push("BEGIN:VCALENDAR");
  lines.push("PRODID:-/Padel/Filtered Feed/EN");
  lines.push("VERSION:2.0");
  lines.push("CALSCALE:GREGORIAN");
  lines.push("METHOD:PUBLISH");
  lines.push(vtimezone_(tz));

  events.forEach((ev) => {
    const uid = uidForEvent_(ev);
    const dtStart = dtLocal_(ev.start, tz);
    const dtEnd = dtLocal_(ev.end, tz);
    const title = icsEscape_(ev.title || "Padel Event");
    const loc = icsEscape_(ev.club || ev.location || "");
    const desc = icsEscape_(
      [
        ev.level ? `Level: ${ev.level}` : "",
        ev.type ? `Type: ${ev.type}` : "",
        ev.category ? `Category: ${ev.category}` : "",
        ev.price ? `Price: ${ev.price}` : "",
        ev.url ? `Link: ${ev.url}` : "",
        ev.description || "",
      ]
        .filter(Boolean)
        .join("\n")
    );

    lines.push("BEGIN:VEVENT");
    lines.push("UID:" + uid);
    lines.push("DTSTAMP:" + nowZ);
    lines.push("DTSTART;TZID=" + tz + ":" + dtStart);
    lines.push("DTEND;TZID=" + tz + ":" + dtEnd);
    lines.push("SUMMARY:" + title);
    if (loc) lines.push("LOCATION:" + loc);
    if (desc) lines.push("DESCRIPTION:" + desc);
    if (ev.url) lines.push("URL:" + ev.url);
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function uidForEvent_(ev) {
  const base = String(ev.id || ev.title || "") + "|" + String(ev.start || "");
  const hash = Utilities.base64Encode(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, base)
  )
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 24);
  return hash + "@padel";
}
function icsEscape_(s) {
  return String(s || "")
    .replace(/([,;])/g, "\\$1")
    .replace(/\n/g, "\\n");
}
function dtLocal_(iso, tz) {
  return Utilities.formatDate(new Date(iso), tz, "yyyyMMdd'T'HHmmss");
}
function vtimezone_(tz) {
  if (tz === "Asia/Bangkok") {
    return [
      "BEGIN:VTIMEZONE",
      "TZID:Asia/Bangkok",
      "X-LIC-LOCATION:Asia/Bangkok",
      "BEGIN:STANDARD",
      "TZOFFSETFROM:+0700",
      "TZOFFSETTO:+0700",
      "TZNAME:+07",
      "DTSTART:19700101T000000",
      "END:STANDARD",
      "END:VTIMEZONE",
    ].join("\r\n");
  }
  // Generic fallback (UTC only)
  return [
    "BEGIN:VTIMEZONE",
    "TZID:" + tz,
    "X-LIC-LOCATION:" + tz,
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0000",
    "TZOFFSETTO:+0000",
    "TZNAME:UTC",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE",
  ].join("\r\n");
}
