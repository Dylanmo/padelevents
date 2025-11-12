# Visual Design Guidelines — Padel Events Bangkok

**Last Updated**: November 12, 2025  
**Version**: 1.0

---

## Overview

This document establishes the visual design system for Padel Events Bangkok. Our goal is to create a **mobile-first, app-like experience** that's instantly recognizable, easy to use, and follows modern web design best practices.

### Design Principles

1. **Mobile-First**: Design for 375px width first, enhance for larger screens
2. **App-Like Experience**: Touch-friendly, gesture-aware, minimal friction
3. **Clarity Over Cleverness**: Prioritize usability and readability
4. **Consistent & Recognizable**: Establish clear visual patterns users can learn
5. **Accessible**: WCAG AA compliance minimum (4.5:1 contrast for text)

### Reference Inspirations

**Big Players**:

- Airbnb: Clean cards, generous whitespace, clear CTAs
- Spotify: Bold typography, vibrant accent colors, dark mode support
- Google Calendar: Efficient information density, scannable events

**Innovative Players**:

- Linear: Minimal color palette, crisp typography, subtle animations
- Pitch: Bold brand colors used sparingly, strong typography hierarchy
- Arc Browser: Playful yet professional, unique color system

---

## Brand Identity

### Brand Colors

We use a **restrained color palette** with green as our primary brand color, used sparingly for key actions and highlights.

```css
:root {
  /* Primary Brand */
  --color-primary: #10b981; /* Vibrant padel green */
  --color-primary-hover: #059669; /* Darker on hover */
  --color-primary-light: #d1fae5; /* Subtle backgrounds */

  /* Accent */
  --color-accent: #0891b2; /* Teal for secondary actions */
  --color-accent-hover: #0e7490;

  /* Neutral Palette */
  --color-bg-page: #fafafa; /* Off-white page background */
  --color-bg-card: #ffffff; /* Pure white cards */
  --color-bg-elevated: #ffffff; /* Modals, dropdowns */

  /* Text */
  --color-text-primary: #111827; /* Near-black for headings */
  --color-text-secondary: #6b7280; /* Gray for metadata */
  --color-text-tertiary: #9ca3af; /* Lighter gray for hints */
  --color-text-inverse: #ffffff; /* White text on dark backgrounds */

  /* Borders & Dividers */
  --color-border: #e5e7eb; /* Subtle borders */
  --color-border-focus: #10b981; /* Focus outlines */

  /* Status Colors */
  --color-success: #10b981; /* Same as primary */
  --color-warning: #f59e0b; /* Amber */
  --color-error: #ef4444; /* Red */
  --color-info: #3b82f6; /* Blue */
}
```

**Usage Guidelines**:

- **Primary green**: Reserve for CTAs ("Add to Calendar"), selected filters, and key highlights
- **Accent teal**: Use for secondary actions, hover states, or info badges
- **Neutrals**: Use extensively — most of the UI should be neutral grays and whites
- **Status colors**: Only for feedback (success messages, error states, warnings)

**Anti-Pattern**: Don't overuse primary green. If everything is green, nothing stands out.

---

## Typography

### Font Stack

**Primary Font**: System UI stack (native, fast, readable)

```css
:root {
  --font-sans:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
  --font-mono: "SF Mono", Monaco, "Cascadia Code", "Courier New", monospace;
}
```

**Why System Fonts?**

- Zero network latency (instant load)
- Optimized for each platform (iOS, Android, Windows)
- Accessible and familiar to users
- Consistent with native apps

### Type Scale

**Mobile-first sizing** (scales up on larger screens):

```css
:root {
  /* Base */
  --text-xs: 0.75rem; /* 12px - captions, labels */
  --text-sm: 0.875rem; /* 14px - metadata, small UI text */
  --text-base: 1rem; /* 16px - body text (minimum for readability) */
  --text-lg: 1.125rem; /* 18px - card titles */
  --text-xl: 1.25rem; /* 20px - section headers */
  --text-2xl: 1.5rem; /* 24px - page titles */
  --text-3xl: 1.875rem; /* 30px - hero text (desktop only) */

  /* Line Heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;

  /* Font Weights */
  --weight-normal: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
}
```

**Hierarchy Example**:

- **H1** (Page Title): 24px / 600 weight / tight leading
- **H2** (Section): 20px / 600 weight / tight leading
- **H3** (Card Title): 18px / 600 weight / normal leading
- **Body**: 16px / 400 weight / normal leading
- **Metadata**: 14px / 400 weight / normal leading / gray color

**Accessibility**:

- Minimum body text: 16px (never smaller)
- Line height: 1.5 minimum for body text
- Contrast: 4.5:1 for body, 3:1 for large text (18px+)

---

## Spacing & Layout

### Spacing Scale

**Consistent 4px-based spacing** system:

```css
:root {
  --space-0: 0;
  --space-1: 0.25rem; /* 4px */
  --space-2: 0.5rem; /* 8px */
  --space-3: 0.75rem; /* 12px */
  --space-4: 1rem; /* 16px */
  --space-5: 1.25rem; /* 20px */
  --space-6: 1.5rem; /* 24px */
  --space-8: 2rem; /* 32px */
  --space-10: 2.5rem; /* 40px */
  --space-12: 3rem; /* 48px */
  --space-16: 4rem; /* 64px */
}
```

**Usage**:

- **Tight spacing** (4–8px): Between related elements (icon + label)
- **Default spacing** (12–16px): Card padding, button padding
- **Comfortable spacing** (20–24px): Between sections
- **Generous spacing** (32–48px): Page margins, major sections

### Container Widths

```css
:root {
  --container-sm: 640px; /* Single column content */
  --container-md: 768px; /* Tablet */
  --container-lg: 1024px; /* Desktop */
  --container-xl: 1280px; /* Wide desktop (max) */
}
```

**Layout Pattern**:

- Mobile (< 640px): Full-width cards with 16px side padding
- Tablet (640–1024px): Max-width container, cards in 2 columns
- Desktop (1024px+): Max 1280px width, cards in 2–3 columns, centered

### Touch Targets

**Minimum touch target size**: 44 × 44px (iOS/Android guideline)

```css
/* Buttons */
.btn {
  min-height: 44px;
  padding: var(--space-3) var(--space-6); /* 12px 24px */
}

/* Checkboxes/Radio (visual + padding) */
input[type="checkbox"],
input[type="radio"] {
  width: 20px;
  height: 20px;
  margin: 12px; /* Total = 44px */
}
```

---

## Components

### Event Cards

**Mobile Layout** (< 640px):

```css
.event-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--space-4);
  margin-bottom: var(--space-4);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.event-card__title {
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.event-card__meta {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
}

.event-card__cta {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-4);
}
```

**Desktop Layout** (>= 640px):

```css
@media (min-width: 640px) {
  .event-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
}

@media (min-width: 1024px) {
  .event-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

### Buttons

**Primary CTA** (Add to Calendar):

```css
.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 8px;
  font-weight: var(--weight-medium);
  padding: var(--space-3) var(--space-6);
  min-height: 44px;
  transition: background 150ms ease;
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-primary:active {
  transform: scale(0.98);
}
```

**Secondary Button** (Download ICS):

```css
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  /* Same sizing/radius as primary */
}

.btn-secondary:hover {
  background: var(--color-primary-light);
}
```

### Filter Chips

**Club Filters** (Checkboxes styled as chips):

```css
.filter-chip {
  display: inline-flex;
  align-items: center;
  padding: var(--space-2) var(--space-4);
  border: 2px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-bg-card);
  transition: all 150ms ease;
}

.filter-chip:hover {
  border-color: var(--color-primary);
}

.filter-chip--active {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: var(--weight-medium);
}
```

**Level Buttons** (Toggle buttons):

```css
.level-btn {
  padding: var(--space-3) var(--space-5);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-card);
  font-weight: var(--weight-medium);
  min-height: 44px;
}

.level-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
}
```

---

## Accessibility

### Color Contrast

**Required ratios** (WCAG AA):

- **Body text** (< 18px): 4.5:1
- **Large text** (>= 18px or 14px bold): 3:1
- **UI components**: 3:1

**Current Palette Compliance**:

- ✅ `--color-text-primary` (#111827) on white: 15.5:1
- ✅ `--color-text-secondary` (#6b7280) on white: 5.2:1
- ✅ `--color-primary` (#10b981) on white: 3.1:1 (use for large text/buttons only)

**Tool**: Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

### Focus States

**Keyboard navigation** must have visible focus:

```css
:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}

/* Remove default outline on mouse click */
:focus:not(:focus-visible) {
  outline: none;
}
```

### ARIA Labels

**Event Cards**:

```html
<button
  class="btn-primary"
  aria-label="Add [Event Title] on [Date] to Google Calendar"
>
  Add to Calendar
</button>
```

**Filter Chips**:

```html
<label class="filter-chip">
  <input type="checkbox" aria-checked="false" />
  <span>Thonglor Padel</span>
</label>
```

---

## Animation & Motion

**Principle**: Subtle, purposeful, performant.

### Transitions

```css
:root {
  --transition-fast: 100ms ease;
  --transition-base: 150ms ease;
  --transition-slow: 300ms ease;
}

/* Apply to interactive elements */
.btn,
.filter-chip {
  transition: all var(--transition-base);
}
```

**What to animate**:

- ✅ Background color changes (hover, active)
- ✅ Border color changes (focus, active)
- ✅ Opacity (tooltips, modals)
- ✅ Transform scale (button press feedback)

**What NOT to animate**:

- ❌ Layout shifts (height, width, position) — causes jank
- ❌ Box-shadow (expensive, use sparingly)

### Micro-Interactions

**Button Press**:

```css
.btn:active {
  transform: scale(0.98);
}
```

**Card Hover** (desktop only):

```css
@media (hover: hover) {
  .event-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    transition: all var(--transition-base);
  }
}
```

---

## Responsive Breakpoints

```css
:root {
  --screen-sm: 640px;
  --screen-md: 768px;
  --screen-lg: 1024px;
  --screen-xl: 1280px;
}

/* Mobile-first approach */
/* Base styles = mobile */

@media (min-width: 640px) {
  /* Tablet adjustments */
}

@media (min-width: 1024px) {
  /* Desktop adjustments */
}
```

**Design for these viewports**:

- **375px** (iPhone SE) — minimum target
- **414px** (iPhone Pro Max)
- **768px** (iPad portrait)
- **1024px** (Desktop)

---

## Dark Mode (Future)

**Not implemented yet**, but designed to support:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-page: #111827;
    --color-bg-card: #1f2937;
    --color-text-primary: #f9fafb;
    --color-text-secondary: #d1d5db;
    --color-border: #374151;
  }
}
```

---

## Implementation Checklist

When building a new feature:

- [ ] Use CSS variables for all colors, spacing, typography
- [ ] Design mobile-first (375px), test on real device
- [ ] Ensure touch targets >= 44px
- [ ] Check color contrast with browser dev tools
- [ ] Add ARIA labels to interactive elements
- [ ] Add `:focus-visible` styles for keyboard navigation
- [ ] Use system font stack (no custom web fonts)
- [ ] Limit use of primary green to key CTAs and highlights
- [ ] Test responsive layout at 375px, 640px, 1024px
- [ ] Validate with htmlhint, stylelint, eslint before commit

---

## Related Documentation

- [Component Design Specifications](design/components.md)
- [Color System](design/color-system.md)
- [Typography System](design/typography.md)
- [Spacing & Layout](design/spacing-layout.md)
- [Accessibility Guidelines](design/accessibility.md)

---

## Questions & Updates

**How to propose changes**:

1. Create a branch: `design/[change-description]`
2. Update this document + implement in CSS
3. Take before/after screenshots
4. Open PR with visual comparison

**Review cycle**: Design changes reviewed weekly (or as needed for urgent fixes).
