# Backend (Google Apps Script) Updates for Availability Badges

## Changes Required in `code.gs`

### 1. Add Helper Function to Compute Availability Status

Add this function before `previewByClubs()`:

```javascript
/**
 * Compute availability status based on total capacity and available slots
 * @param {number} total - Total capacity/slots
 * @param {number} available - Available/open slots
 * @returns {string} Status: "open" | "almost" | "full" | null
 *
 * Logic:
 * - If total <= 0 or not a number: null (unknown)
 * - If available <= 0: "full"
 * - If available <= (total * 0.25): "almost" (25% threshold)
 * - Otherwise: "open"
 */
function computeAvailStatus(total, available) {
  if (!Number.isFinite(total) || total <= 0) return null;
  if (!Number.isFinite(available)) return null;
  if (available <= 0) return "full";
  if (available <= total * 0.25) return "almost"; // 25% threshold
  return "open";
}

/**
 * Format availability text for display
 * @param {string} status - Availability status ("open" | "almost" | "full")
 * @param {number} available - Number of available slots
 * @returns {string} Display text
 *
 * Examples:
 * - "5 spots left"
 * - "2 spots left"
 * - "Full"
 * - "" (if status is null)
 */
function formatAvailText(status, available) {
  if (status === "full") return "Full";
  if (status === "open" || status === "almost") {
    const plural = available !== 1 ? "s" : "";
    return `${available} spot${plural} left`;
  }
  return "";
}
```

### 2. Update Column Mapping in `previewByClubs()` Function

In the `previewByClubs()` function, where availability is currently computed, update the section that maps columns:

**OLD CODE** (around line 185-210):

```javascript
// Capacity / availability fallbacks
const total = asInt(r.spots_total || r.capacity || r.slots_total || r.total);
const available = asInt(
  r.spots_available || r.available || r.slots_open || r.open
);
```

**NEW CODE** - Keep the same column mapping, but add the new fields to the returned object:

In the return statement of the `.map()` (around line 250+), add these three new fields:

```javascript
      // NEW: Availability status and text
      availStatus: computeAvailStatus(total, available),
      availText: formatAvailText(computeAvailStatus(total, available), available),
      slotsLeft: available || 0,
```

**Complete updated return object should include:**

```javascript
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
  // NEW FIELDS FOR AVAILABILITY BADGE
  availStatus: computeAvailStatus(total, available),
  availText: formatAvailText(computeAvailStatus(total, available), available),
  slotsLeft: available || 0,
};
```

## Column Mappings Supported

The backend uses header-based fallback chains to extract availability data. The following Google Sheets column headers are supported (any variation):

### Total Capacity

- `slots_total`
- `capacity`
- `spots_total`
- `total`

### Available/Open Slots

- `slots_left`
- `slots_open`
- `spots_available`
- `available`
- `open`

### Status (Optional - not currently used, but available)

- `status`

The `normalize()` function converts all headers to lowercase with underscores, so variations like "Slots Total", "slots_total", "Slots_Total" are all supported.

## Response Fields

After these changes, all three endpoints return availability data:

- **`/exec?action=preview`** - Returns events with `availStatus`, `availText`, `slotsLeft`
- **`/exec?action=filters`** - (No change needed; doesn't return events)
- **`/exec?action=meta`** - (No change needed; doesn't return events)

## Testing

Test by calling:

```
https://script.google.com/macros/d/{deployment-id}/usercache?action=preview&clubs=&levels=&types=&categories=&limit=10
```

Verify the response includes `availStatus`, `availText`, and `slotsLeft` for each event.

Example response:

```json
{
  "total": 5,
  "sample": [
    {
      "id": "evt123",
      "title": "Morning Match",
      "availStatus": "open",
      "availText": "5 spots left",
      "slotsLeft": 5,
      "total": 8,
      "available": 5,
      ...
    },
    {
      "id": "evt124",
      "title": "Evening League",
      "availStatus": "almost",
      "availText": "2 spots left",
      "slotsLeft": 2,
      "total": 8,
      "available": 2,
      ...
    },
    {
      "id": "evt125",
      "title": "Beginner Class",
      "availStatus": "full",
      "availText": "Full",
      "slotsLeft": 0,
      "total": 6,
      "available": 0,
      ...
    }
  ]
}
```
