function buildInstances() {
  // ==== Config ====
  const SOURCE_SHEET = 'event_database';
  const OUTPUT_SHEET = 'event_recurring5';
  const HEADER_ROW   = 2;               // row with column names in event_database
  const FIRST_DATA   = HEADER_ROW + 1;  // first data row
  const HORIZON_DAYS = 90;              // max look-ahead window
  const tz = SpreadsheetApp.getActive().getSpreadsheetTimeZone();

  // ==== Helpers ====
  const ss  = SpreadsheetApp.getActive();
  const src = ss.getSheetByName(SOURCE_SHEET);
  const out = ss.getSheetByName(OUTPUT_SHEET) || ss.insertSheet(OUTPUT_SHEET);
  if (!src) throw new Error('Missing sheet: event_database');

  const today = new Date(); today.setHours(0,0,0,0);
  const MS_DAY = 86400 * 1000;

  const slug = s => (s || '').toString().trim()
    .toLowerCase()
    .replace(/\s+/g,' ')
    .replace(/[|]/g,'-')
    .replace(/[^a-z0-9 -]/g,'')
    .replace(/\s/g,'-');

  const parseDateOnly = v => {
    if (v instanceof Date) { const d = new Date(v); d.setHours(0,0,0,0); return d; }
    if (typeof v === 'number') { const d = new Date(Math.round((v - 25569) * MS_DAY)); d.setHours(0,0,0,0); return d; }
    if (typeof v === 'string') {
      const s = v.trim();
      const m1 = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(s);     // dd/mm/yyyy
      if (m1) return new Date(+m1[3], +m1[2]-1, +m1[1], 0,0,0,0);
      const d = new Date(s);
      if (!isNaN(d)) { d.setHours(0,0,0,0); return d; }
    }
    return null;
  };

  const parseTimeFrac = v => {
    if (v instanceof Date) return (v.getHours()*3600 + v.getMinutes()*60 + v.getSeconds())/86400;
    if (typeof v === 'number') return v;
    if (typeof v === 'string') {
      const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(v.trim());
      if (m) { const h=+m[1], mn=+m[2], s=+(m[3]||0); return (h*3600+mn*60+s)/86400; }
    }
    return 0;
  };

  const addDays = (d,n) => { const x=new Date(d.getTime()+n*MS_DAY); x.setHours(0,0,0,0); return x; };
  const addMonths = (d,n) => { const x=new Date(d); x.setMonth(x.getMonth()+n, d.getDate()); x.setHours(0,0,0,0); return x; };

  // ==== Read calendar_id from A1 ====
  const calendarId = String(src.getRange('A1').getDisplayValue()).trim();

  // ==== Read headers + data ====
  const lastRow = src.getLastRow();
  const lastCol = src.getLastColumn();
  if (lastRow < FIRST_DATA) { out.clearContents(); return; }

  const headers = src.getRange(HEADER_ROW,1,1,lastCol).getValues()[0].map(h => String(h||'').trim());
  const data    = src.getRange(FIRST_DATA,1,lastRow-FIRST_DATA+1,lastCol).getValues();

  // Column lookup by name (case-insensitive)
  const idx = name => headers.findIndex(h => h.toLowerCase() === name.toLowerCase());

  const COL = {
    event: idx('event'),
    club: idx('club'),
    date: idx('date'),
    start: idx('start'),
    end: idx('end'),
    type: idx('type'),
    category: idx('category'),
    fee: idx('fee'),
    level_min: idx('level_min'),
    level_max: idx('level_max'),
    slots: idx('slots'),
    slots_open: idx('slots_open'),
    notes: idx('notes'),
    recurring: idx('recurring'),
    recurring_period: idx('recurring_period'),   // "Weekly" / "Monthly" optional
    recurring_days: idx('recurring_days'),       // typically 7
    recurring_future: idx('recurring_future'),   // number of extra future occurrences
    tz: idx('tz'),
    series_id: idx('series_id'),
    club_export: idx('club_export'),
  };

  // ==== Output header (v2 schema) ====
  const OUT_HEADER = [
    'event','club','date','date_start','date_end',
    'type','category','price_text','level_range',
    'slots_total','slots_left','slots_filled','status',
    'avail_text','notes','instance_id','calendar_id','series_id','club_export','generated_at'
  ];

  const rows = [OUT_HEADER];
  const seenIds = new Set(); // ensure uniqueness within one build

  data.forEach(r => {
    const ev    = r[COL.event];
    const club  = r[COL.club];
    const base  = parseDateOnly(r[COL.date]);
    if (!ev || !base) return;

    const startFrac = parseTimeFrac(r[COL.start]);
    const endFrac   = parseTimeFrac(r[COL.end]);

    const type      = COL.type>-1 ? r[COL.type] : '';
    const category  = COL.category>-1 ? r[COL.category] : '';

    const feeVal    = COL.fee>-1 ? Number(r[COL.fee]) : NaN;
    const priceText = isFinite(feeVal) && feeVal>0 ? `${feeVal} Baht` : '';

    const lvlMin = COL.level_min>-1 ? Number(r[COL.level_min]) : NaN;
    const lvlMax = COL.level_max>-1 ? Number(r[COL.level_max]) : NaN;
    const levelRange = (isFinite(lvlMin) || isFinite(lvlMax))
      ? `${isFinite(lvlMin)?lvlMin.toFixed(2):'0.00'} - ${isFinite(lvlMax)?lvlMax.toFixed(2):'0.00'}`
      : '';

    const slotsTotal = COL.slots>-1 ? Number(r[COL.slots]) : NaN;
    const slotsLeft  = COL.slots_open>-1 ? Number(r[COL.slots_open]) : NaN;
    const slotsFilled = (isFinite(slotsTotal) && isFinite(slotsLeft)) ? (slotsTotal - slotsLeft) : '';
    const status = (isFinite(slotsTotal) && isFinite(slotsLeft))
      ? (slotsLeft === 0 ? 'FULL' : (slotsLeft <= 2 ? 'ALMOST FULL' : 'OPEN'))
      : '';
    const availText = (isFinite(slotsTotal) && isFinite(slotsLeft)) ? `${slotsLeft} of ${slotsTotal} available` : '';

    const notes = COL.notes>-1 ? r[COL.notes] : '';

    // Recurrence controls
    const recYes   = String(COL.recurring>-1 ? r[COL.recurring] : '').toLowerCase() === 'yes';
    const period   = (COL.recurring_period>-1 ? String(r[COL.recurring_period]||'').toLowerCase() : '');
    const stepDays = (COL.recurring_days>-1 ? Number(r[COL.recurring_days]) : 7) || 7;
    const future   = recYes ? Math.max(0, Number(COL.recurring_future>-1 ? r[COL.recurring_future] : 0)) : 0;

    // Prefer series_id → club_export → slugged club for uniqueness
    const clubKey = (COL.series_id>-1 && r[COL.series_id]) ? String(r[COL.series_id]).trim() :
                    (COL.club_export>-1 && r[COL.club_export]) ? String(r[COL.club_export]).trim() :
                    slug(club);

    const buildStart = d => new Date(d.getTime() + Math.round(startFrac*MS_DAY));
    const buildEnd   = d => new Date(d.getTime() + Math.round(endFrac*MS_DAY));

    const addStep = (d, k) => {
      if (period === 'monthly') return addMonths(base, k);
      if (recYes) return addDays(base, k*stepDays);
      return base; // one-off
    };

    const horizonCutoff = new Date(today.getTime() + HORIZON_DAYS*MS_DAY);

    for (let k = 0; k <= future; k++) {
      const occurDate = addStep(base, k);
      if (occurDate < today) continue;
      if (occurDate > horizonCutoff) continue;

      const startDT = buildStart(occurDate);
      const endDT   = buildEnd(occurDate);

      const hhmm = Utilities.formatDate(startDT, tz, 'HH:mm');
      const ymd  = Utilities.formatDate(startDT, tz, 'yyyy-MM-dd');

      // Base instance_id (club key included)
      const baseId = `${hhmm}|${ymd}|${slug(ev)}|${slug(type)}|${clubKey}`;

      // Ensure uniqueness in this pass (suffix |2, |3, … if needed)
      let instanceId = baseId, n = 2;
      while (seenIds.has(instanceId)) instanceId = `${baseId}|${n++}`;
      seenIds.add(instanceId);

      rows.push([
        ev, club, occurDate, startDT, endDT,
        type, category, priceText, levelRange,
        isFinite(slotsTotal) ? slotsTotal : '', isFinite(slotsLeft) ? slotsLeft : '',
        slotsFilled, status,
        availText, notes, instanceId, calendarId,
        COL.series_id>-1 ? r[COL.series_id] : '',
        COL.club_export>-1 ? r[COL.club_export] : '',
        Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm:ss')
      ]);
    }
  });

  // ==== Write output ====
  out.clearContents();
  out.getRange(1,1,rows.length,rows[0].length).setValues(rows);
  if (rows.length > 1) {
    // date
    out.getRange(2,3,rows.length-1,1).setNumberFormat('yyyy-MM-dd');
    // date_start + date_end
    out.getRange(2,4,rows.length-1,2).setNumberFormat('yyyy-MM-dd HH:mm');
  }
}