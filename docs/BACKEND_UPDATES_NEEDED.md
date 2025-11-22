# Backend API Updates Required

The frontend is ready, but the Google Apps Script backend needs these updates:

## 1. Update `previewByClubs` function signature

**Current (line 161):**

```javascript
const { clubs, limit, levels } = payload;
```

**Required:**

```javascript
const { clubs, limit, levels, types, categories } = payload;
```

## 2. Update `doGet` router to parse new parameters

**Current (lines 13-21):**

```javascript
if (action === "preview") {
  const clubs = String(p.clubs || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const levels = String(p.levels || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const limit = Math.min(Number(p.limit || 200), 1000);
  const res = previewByClubs({ clubs, levels, limit });
  return _json(res);
}
```

**Required:**

```javascript
if (action === "preview") {
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
```

## 3. Add type and category filters to `previewByClubs`

**Add after level filter (after line 181):**

```javascript
.filter((r) => {
  if (!types || types.length === 0) return true;
  const eventType = String(r.type || "").trim();
  return types.includes(eventType);
})
.filter((r) => {
  if (!categories || categories.length === 0) return true;
  const eventCategory = String(r.category || "").trim();
  return categories.includes(eventCategory);
})
```

## 4. Fix event object mapping to return BOTH type and category

**Current (lines 185-218):**

```javascript
const category = r.category || r.type || r.format || "";

return {
  id: r.instance_id || r.id || "",
  start: new Date(r.date_start).toISOString(),
  end: new Date(r.date_end).toISOString(),
  title: r.event || "Padel",
  club: prettyClubLabelFromClub(clubCode),
  level: lvl.min != null && lvl.max != null ? `${lvl.min}–${lvl.max}` : "",
  price,
  category, // ❌ Only one field
  total,
  available,
  location,
  url: r.url || r.link || "",
  description: r.description || r.details || "",
};
```

**Required:**

```javascript
const eventType = String(r.type || "").trim();
const eventCategory = String(r.category || "").trim();

return {
  id: r.instance_id || r.id || "",
  start: new Date(r.date_start).toISOString(),
  end: new Date(r.date_end).toISOString(),
  title: r.event || "Padel",
  club: prettyClubLabelFromClub(clubCode),
  level: lvl.min != null && lvl.max != null ? `${lvl.min}–${lvl.max}` : "",
  price,
  type: eventType, // ✅ Separate type field
  category: eventCategory, // ✅ Separate category field
  total,
  available,
  location,
  url: r.url || r.link || "",
  description: r.description || r.details || "",
};
```

## 5. Update ICS action as well (optional but recommended)

**Current (lines 37-45):**

```javascript
if (action === "ics") {
  const clubs = String(p.clubs || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const levels = String(p.levels || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const { sample } = previewByClubs({ clubs, levels, limit: 800 });
  // ...
}
```

**Required:**

```javascript
if (action === "ics") {
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
  // ...
}
```

---

## Testing After Updates

1. Deploy the updated Google Apps Script
2. Test API call: `?action=preview&types=Americano&categories=Mixed`
3. Verify response includes both `type` and `category` fields
4. Verify filtering works correctly (returns only Americano Mixed events)
5. Frontend should work immediately after backend deployment

## Data Validation

Based on spreadsheet screenshot, verify these exact values exist:

- **Types**: "Americano", "Social", "King of the court"
- **Categories**: "Mixed", "Men only", "Women only"

Note: Frontend buttons use "King of the Court" (capitalized "Court") but spreadsheet shows "King of the court" (lowercase "court"). **Match the exact casing in the spreadsheet!**
