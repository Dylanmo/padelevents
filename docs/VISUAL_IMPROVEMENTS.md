# Visual Improvements & Future Refactoring

**Created**: November 12, 2025  
**Status**: Planning Document  
**Priority**: After initial design system implementation

---

## Overview

This document tracks planned refactoring work to fully align the codebase with the Visual Design Guidelines. These improvements will be implemented incrementally after the foundational design system variables are in place.

---

## Phase 1: CSS Class Name Refactoring

### Current State vs Design System

| Component         | Current Class Names                                 | Design System Class Names                                         | Impact               |
| ----------------- | --------------------------------------------------- | ----------------------------------------------------------------- | -------------------- |
| **Event Cards**   | `.event-title`, `.event-datetime`, `.event-details` | `.event-card__title`, `.event-card__meta`, `.event-card__details` | Better BEM semantics |
| **Filter Chips**  | `.chip`, `.chips`                                   | `.filter-chip`, `.filter-chips`                                   | More descriptive     |
| **Club Headers**  | `.club-header`, `.club-link`                        | `.club-section__header`, `.club-section__link`                    | Consistent naming    |
| **Level Buttons** | `.level-btn`                                        | `.level-btn`, `.level-btn__label`, `.level-btn__range`            | Structured labels    |

### JavaScript Impact

Files requiring updates when CSS classes change:

- `assets/js/app.js` - DOM manipulation for events
- `assets/js/filters.js` - Filter chip selection
- Any template string literals using class names

### Migration Strategy

1. **Add new classes alongside old** (both work during transition)
2. **Update JavaScript to use new classes**
3. **Test thoroughly** (visual regression + functional testing)
4. **Remove old classes** once confirmed working
5. **Document breaking changes** in changelog

---

## Phase 2: Icon System Migration

### Current: Emoji Icons

**In use:**

- 📍 Pin - Club names, locations
- 🥇 Medal - Skill levels
- 🎾 Tennis - Page title, branding
- ⚡ Lightning - Happening Soon section

**Keep as emoji (universally recognized UI patterns):**

- 📅 Calendar - Google Calendar button
- 📅 Download - ICS file button
- _(Rationale: Standard symbols across all platforms, users instantly recognize these actions)_

### Proposed: Inline SVG Icons

**Benefits:**

- Consistent cross-platform rendering
- Color control via CSS variables
- Better accessibility (proper ARIA labels)
- Professional, app-like appearance
- Scalable without quality loss

**Implementation Plan:**

1. **Create icon component library** (`assets/icons/` directory)

   ```
   assets/icons/
     location.svg
     medal.svg
     padel.svg
     lightning.svg
   ```

2. **CSS utility classes**

   ```css
   .icon {
     display: inline-block;
     vertical-align: middle;
     flex-shrink: 0;
     width: 16px;
     height: 16px;
   }

   .icon-lg {
     width: 20px;
     height: 20px;
   }
   .icon-location {
     color: var(--color-primary);
   }
   .icon-level {
     color: var(--color-accent);
   }
   ```

3. **HTML pattern**

   ```html
   <!-- Old -->
   <h2 class="club-header">📍 Thonglor Padel Club</h2>

   <!-- New (SVG for UI elements) -->
   <h2 class="club-header">
     <svg class="icon icon-location" aria-hidden="true">...</svg>
     Thonglor Padel Club
   </h2>

   <!-- Keep emoji for calendar actions (universally recognized) -->
   <button class="btn-google">📅 Add to Google Calendar</button>
   <button class="btn-ics">📅 Download ICS</button>
   ```

4. **JavaScript helper** (optional)
   ```javascript
   // utils.js
   export function icon(name, className = "") {
     const icons = {
       location: "<svg>...</svg>",
       medal: "<svg>...</svg>",
       // etc.
     };
     return icons[name] || "";
   }
   ```

### Icon Design Guidelines

- **Size**: 16×16px default, 20×20px for emphasis
- **Stroke width**: 1.5px for consistency
- **Color**: Use `currentColor` to inherit from parent
- **Style**: Minimalist, line-based (not filled)
- **Source**: Design custom or use [Heroicons](https://heroicons.com/) as base

**Migration scope:**

- ✅ Replace: 📍 (location), 🥇 (level), ⚡ (lightning), 🎾 (padel racket)
- ❌ Keep emoji: 📅 (calendar), 📅 (download) - standard action icons

---

## Phase 3: Spacing & Typography Refactoring

### Replace Hardcoded Values

**Current issues:**

- Hardcoded pixel values throughout CSS
- Inconsistent spacing (e.g., `margin-bottom: 8px` vs `12px` with no pattern)
- Font sizes not using type scale variables

**Refactoring targets:**

```css
/* BEFORE */
.event-card {
  padding: 16px;
  margin-bottom: 12px;
}

.event-title {
  font-size: 1.0625rem; /* 17px - arbitrary */
  margin-bottom: 8px;
}

/* AFTER */
.event-card {
  padding: var(--space-4); /* 16px */
  margin-bottom: var(--space-3); /* 12px */
}

.event-title {
  font-size: var(--text-lg); /* 18px */
  font-weight: var(--weight-semibold);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-2); /* 8px */
}
```

**Process:**

1. Search for all hardcoded values: `grep -r "padding: [0-9]" assets/style.v1.css`
2. Map to nearest design system value
3. Replace systematically, section by section
4. Test visual regression at 375px, 640px, 1024px

---

## Phase 4: Component Semantic Improvements

### Filter Group Labels

**Current:**

```html
<p class="filter-label">Select Bangkok Padel Clubs</p>
```

**Design System:**

```html
<h3 class="filter-group__label">Select Clubs</h3>
```

**Changes needed:**

- Use `<h3>` for semantic hierarchy (not `<p>`)
- Apply uppercase, letter-spacing per design spec
- Update CSS class name

### Event Card Structure

**Current:**

```html
<div class="event-details">
  <span class="detail-item">...</span>
</div>
```

**Design System:**

```html
<div class="event-card__details">
  <span class="event-card__club">📍 Thonglor Padel</span>
  <span class="event-card__level">🥇 Level 3–4</span>
</div>
```

**Changes:**

- Remove generic `.detail-item` class
- Use specific child classes (`.event-card__club`, `.event-card__level`)
- Better for targeting in CSS/JS

---

## Phase 5: Mobile-First Responsive Optimization

### iPhone SE (375px) Specific Improvements

**Current issues:**

1. **Loading GIF**: `width: 70%` can be too large on small screens
2. **Filter chips**: May wrap poorly with long club names
3. **Event actions**: Button spacing could be tighter on 375px
4. **Typography**: H1 at 28px might be too large

**Proposed adjustments:**

```css
/* Mobile-first (375px base) */
h1 {
  font-size: var(--text-2xl); /* 24px */
  font-weight: var(--weight-bold);
}

.loading-gif {
  max-width: 240px; /* Smaller on mobile */
}

.event-actions {
  gap: var(--space-2); /* 8px on mobile */
}

/* Tablet+ */
@media (min-width: 640px) {
  h1 {
    font-size: var(--text-3xl); /* 30px */
  }

  .loading-gif {
    max-width: 290px;
  }

  .event-actions {
    gap: var(--space-3); /* 12px on larger screens */
  }
}
```

---

## Phase 6: Accessibility Enhancements

### Skip Navigation Link

**Purpose**: Allow keyboard users to skip repetitive content.

```html
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <!-- Filters section -->

  <main id="main-content">
    <!-- Events -->
  </main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  padding: var(--space-2) var(--space-4);
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Enhanced Focus States

**Current:**

```css
:focus-visible {
  outline: 3px solid var(--brand-primary);
  outline-offset: 2px;
}
```

**Improved:**

```css
:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Specific component overrides */
.btn-primary:focus-visible {
  outline-color: var(--color-text-inverse);
  outline-offset: 4px;
}
```

### Better ARIA Labels

**Current:**

```html
<button aria-label="Apply filters to events">Apply Filters</button>
```

**Improved (dynamic):**

```html
<button aria-label="Apply filters: 3 clubs, 2 levels selected">
  Apply Filters
</button>
```

**Implementation:**

- Update ARIA label dynamically based on filter state
- Add live regions for filter count updates
- Announce when events list updates

---

## Phase 7: Visual Q&A Improvements

### Larger, Clearer Filter Labels

**Current:**

```css
.filter-label {
  font-size: 0.875rem; /* 14px */
  font-weight: 600;
}
```

**Improved:**

```css
.filter-group__label {
  font-size: var(--text-sm); /* 14px */
  font-weight: var(--weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
  margin-bottom: var(--space-3);
}
```

### Better Event Card Info Hierarchy

**Improvements:**

1. **Increase time/date prominence**

   ```css
   .event-card__datetime {
     font-size: var(--text-base); /* 16px instead of 14px */
     font-weight: var(--weight-medium);
     color: var(--color-text-primary); /* Darker */
   }
   ```

2. **Add visual separators**

   ```html
   <time>Fri 15 Nov</time>
   <span class="separator">•</span>
   <span>18:00–20:00</span>
   ```

3. **Badge-style metadata**
   ```css
   .event-card__level {
     display: inline-flex;
     padding: var(--space-1) var(--space-2);
     background: var(--color-primary-light);
     color: var(--color-primary);
     border-radius: 4px;
     font-size: var(--text-xs);
     font-weight: var(--weight-medium);
   }
   ```

### Simplified Color Usage

**Goal**: Reserve green for CTAs only.

**Changes:**

- Remove green from filter chips (use gray borders)
- Use accent teal for secondary actions only
- Level badges use neutral gray when not selected

---

## Phase 8: Empty States

### No Events Found

**Current**: Basic text message.

**Improved:**

```html
<div class="empty-state">
  <svg class="empty-state__icon" aria-hidden="true">
    <!-- Calendar icon -->
  </svg>
  <h3 class="empty-state__title">No events found</h3>
  <p class="empty-state__message">
    Try adjusting your filters or check back later for new events.
  </p>
  <button class="btn-secondary" onclick="resetFilters()">Reset Filters</button>
</div>
```

```css
.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-4);
  background: var(--color-bg-card);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.empty-state__icon {
  width: 64px;
  height: 64px;
  color: var(--color-text-tertiary);
  margin-bottom: var(--space-4);
}

.empty-state__title {
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-2);
}

.empty-state__message {
  font-size: var(--text-base);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-6);
}
```

---

## Implementation Timeline

### Immediate (Current Sprint)

- ✅ Add design system variables to CSS
- ✅ Document Happening Soon component
- 🔄 Run linters and fix violations
- 🔄 Accessibility improvements (focus states, ARIA)

### Short-term (Next 2 weeks)

- Icon system migration (emoji → SVG)
- Replace hardcoded spacing/typography values
- Mobile optimization for iPhone SE (375px)

### Medium-term (Next month)

- CSS class name refactoring (BEM consistency)
- Component semantic improvements
- Enhanced empty states

### Long-term (Ongoing)

- Continuous accessibility audits
- Performance monitoring
- User testing and iteration

---

## Testing Checklist

Before deploying any refactoring changes:

- [ ] Visual regression test at 375px, 640px, 1024px
- [ ] Test all interactive elements (buttons, filters, links)
- [ ] Keyboard navigation works (tab order, focus states)
- [ ] Screen reader testing (VoiceOver on iOS, TalkBack on Android)
- [ ] Color contrast verification (WCAG AA compliance)
- [ ] Performance check (no increased load time)
- [ ] Cross-browser test (Safari iOS, Chrome Android, Chrome Desktop)
- [ ] Lint all files (htmlhint, stylelint, eslint, prettier)

---

## Questions & Approvals

**Before proceeding with each phase, confirm:**

1. Visual design approval (screenshots before/after)
2. No breaking changes to user workflows
3. Performance impact acceptable
4. Accessibility improvements verified

**Review cycle**: Weekly design review, incremental deployments.

---

## Related Documentation

- [Visual Design Guidelines](VISUAL_DESIGN_GUIDELINES.md)
- [Component Specifications](design/components.md)
- [Accessibility Guidelines](design/accessibility.md)
- [Color System](design/color-system.md)
- [Typography System](design/typography.md)
- [Spacing & Layout](design/spacing-layout.md)
