# Color System

**Part of**: Visual Design Guidelines  
**Last Updated**: November 12, 2025

---

## Philosophy

Our color system is **minimal and purposeful**. We use green sparingly to draw attention to key actions, and rely heavily on neutrals for clarity and readability.

---

## Brand Colors

### Primary (Padel Green)

**Purpose**: CTAs, selected states, key highlights

```css
--color-primary: #10b981;        /* Main brand color */
--color-primary-hover: #059669;  /* Hover/active state */
--color-primary-light: #d1fae5;  /* Subtle backgrounds */
```

**Usage**:
- ✅ "Add to Calendar" button background
- ✅ Selected filter chips border + background
- ✅ Active level button background
- ✅ Focus outlines
- ❌ Do NOT use for body text (contrast too low)
- ❌ Do NOT use for large background areas

**Contrast Ratios**:
- On white (#ffffff): **3.1:1** (WCAG AA for large text only)
- On light green (#d1fae5): **2.4:1** (fails WCAG, use darker text)

### Accent (Teal)

**Purpose**: Secondary actions, info badges

```css
--color-accent: #0891b2;
--color-accent-hover: #0e7490;
```

**Usage**:
- ✅ Secondary buttons
- ✅ Info badges ("New", "Popular")
- ✅ Links in body content
- ❌ Avoid mixing with primary green in same component

---

## Neutral Palette

### Backgrounds

```css
--color-bg-page: #fafafa;    /* Off-white page background */
--color-bg-card: #ffffff;    /* Pure white cards */
--color-bg-elevated: #ffffff; /* Modals, dropdowns */
```

**Why off-white for page?**
- Creates subtle depth with white cards
- Reduces eye strain vs pure white
- Common pattern in modern apps (Airbnb, Linear)

### Text

```css
--color-text-primary: #111827;   /* Near-black for headings */
--color-text-secondary: #6b7280; /* Gray for metadata */
--color-text-tertiary: #9ca3af;  /* Lighter gray for hints */
--color-text-inverse: #ffffff;   /* White text on dark backgrounds */
```

**Contrast Ratios** (all on white):
- Primary: **15.5:1** ✅
- Secondary: **5.2:1** ✅
- Tertiary: **3.2:1** ⚠️ (use for large text only or non-essential UI)

### Borders

```css
--color-border: #e5e7eb;       /* Subtle borders */
--color-border-focus: #10b981; /* Focus outlines (green) */
```

---

## Status Colors

### Success

```css
--color-success: #10b981; /* Same as primary */
```

**Usage**: Success messages, confirmation states

### Warning

```css
--color-warning: #f59e0b; /* Amber */
```

**Usage**: Warning messages, caution states

### Error

```css
--color-error: #ef4444; /* Red */
```

**Usage**: Error messages, destructive actions

### Info

```css
--color-info: #3b82f6; /* Blue */
```

**Usage**: Informational messages, neutral highlights

---

## Usage Guidelines

### Do's

✅ **Use primary green sparingly** — Reserve for CTAs and key highlights  
✅ **Use neutrals extensively** — Gray text, white backgrounds dominate the UI  
✅ **Check contrast** — Always verify with browser dev tools or WebAIM  
✅ **Be consistent** — Use same color for same purpose (e.g., all CTAs green)

### Don'ts

❌ **Don't overuse primary green** — If everything is green, nothing stands out  
❌ **Don't use green for body text** — Contrast too low for readability  
❌ **Don't mix too many colors** — Stick to the defined palette  
❌ **Don't rely on color alone** — Use icons, labels, patterns for accessibility

---

## Dark Mode (Future Consideration)

**Not implemented yet**, but designed to support:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-page: #111827;
    --color-bg-card: #1f2937;
    --color-text-primary: #f9fafb;
    --color-text-secondary: #d1d5db;
    --color-text-tertiary: #9ca3af;
    --color-border: #374151;
    /* Primary green remains same for consistency */
  }
}
```

---

## Testing Checklist

Before shipping a new component:

- [ ] All text meets WCAG AA contrast (4.5:1 for body, 3:1 for large text)
- [ ] Primary green used only for CTAs and highlights
- [ ] Focus states use `--color-border-focus`
- [ ] Status colors used appropriately (success, error, warning, info)
- [ ] Tested on actual mobile device (colors may appear different than desktop)
