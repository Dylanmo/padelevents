# Filter Button Design Recommendations

**Date**: November 13, 2025  
**Context**: New pill button design standard established with "View all" and "Show more events" buttons

## Current State Analysis

### Club Selection Pills (label.chip)

- **Current style**: Rounded rectangles with checkboxes
- **Border radius**: `24px` (medium rounded)
- **Padding**: `10px 16px`
- **Font size**: `0.9375rem` (15px)
- **Border**: `2px solid`
- **Active state**: Filled with brand color

### Level Filter Buttons (.level-btn)

- **Current style**: Rounded rectangles
- **Border radius**: `8px` (small rounded corners)
- **Padding**: `12px 18px`
- **Font size**: `0.9375rem` (15px)
- **Border**: `2px solid`
- **Active state**: Filled with accent color (`--brand-accent`)

### Apply Filters Button (#btnFilter)

- **Current style**: Solid primary button
- **Border radius**: `8px` (small rounded)
- **Padding**: `12px 24px`
- **Font size**: `1rem` (16px)
- **Font weight**: `600`
- **Background**: Brand primary (always filled)

---

## ✅ Recommended Changes for Design Consistency

### 1. **Club Pills - Make Fully Rounded**

**Recommendation**: Update to full pill shape to match new button standard

```css
label.chip {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: var(--space-2) var(--space-4); /* 8px 16px */
  border: 1px solid var(--border); /* Reduce from 2px to 1px */
  border-radius: 999px; /* Full pill - was 24px */
  background: var(--bg-card);
  cursor: pointer;
  font-size: var(--text-base); /* 16px - consistent */
  font-weight: 500;
  transition: all 0.2s ease;
  user-select: none;
}

label.chip:hover {
  background: var(--bg-hover);
  border-color: var(--color-primary);
}

label.chip.checked {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  font-weight: 500;
}
```

**Rationale**:

- Matches "View all" and "Show more" pill style
- Creates visual consistency across all filter controls
- Softer, more modern appearance
- Better alignment with design system

---

### 2. **Level Buttons - Full Pill Style**

**Recommendation**: Convert to pill buttons with consistent styling

```css
.level-btn {
  min-height: 44px;
  padding: var(--space-3) var(--space-5); /* 12px 20px */
  border: 1px solid var(--border); /* Reduce from 2px */
  border-radius: 999px; /* Full pill - was 8px */
  background: var(--bg-card);
  color: var(--text-primary);
  font-size: var(--text-base); /* 16px - was 15px */
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
}

.level-btn:hover {
  background: var(--bg-hover);
  border-color: var(--color-primary);
  color: var(--text-primary);
}

.level-btn.active {
  background: var(--color-primary); /* Use primary instead of accent */
  color: white;
  border-color: var(--color-primary);
  font-weight: 500;
}
```

**Rationale**:

- Consistent pill shape across all filters
- Unified color scheme (use primary green, not accent cyan)
- Improved typography consistency
- Better visual hierarchy

---

### 3. **Apply Filters Button - Enhanced Pill Style**

**Recommendation**: Update to match pill design while maintaining primary CTA prominence

```css
button#btnFilter {
  min-height: 44px;
  padding: var(--space-3) var(--space-6); /* 12px 24px */
  border: none;
  border-radius: 999px; /* Full pill - was 8px */
  background: var(--color-primary);
  color: white;
  font-size: var(--text-base); /* 16px */
  font-weight: 600; /* Keep bold for primary CTA */
  cursor: pointer;
  transition: all 0.2s ease;
}

button#btnFilter:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

button#btnFilter:active {
  transform: translateY(0);
}

button#btnFilter:focus-visible {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

**Rationale**:

- Maintains CTA prominence with solid fill
- Pill shape creates consistency with other buttons
- Slightly larger padding appropriate for primary action
- Bold weight (600) distinguishes from secondary buttons

---

## Design System Tokens

All recommendations use existing design system variables:

**Spacing**:

- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-5`: 20px
- `--space-6`: 24px

**Typography**:

- `--text-base`: 16px (primary size)
- `--text-sm`: 14px (for smaller elements)
- `--weight-medium`: 500
- `--weight-semibold`: 600

**Colors**:

- `--color-primary`: #10b981 (brand green)
- `--color-primary-hover`: #059669
- `--border`: #e5e7eb
- `--bg-card`: #fff
- `--bg-hover`: #f3f4f6

---

## Migration Impact

### Visual Changes

1. **Club pills**: Rounder, softer appearance
2. **Level buttons**: Rounder, consistent with pills
3. **Apply button**: Rounder, maintains prominence
4. **All filters**: Unified pill aesthetic

### Accessibility

- ✅ All buttons maintain 44px minimum height
- ✅ Color contrast ratios unchanged (WCAG AA compliant)
- ✅ Focus states preserved
- ✅ Touch targets remain accessible

### User Experience

- **Improved**: Visual consistency across page
- **Improved**: Modern, cohesive design language
- **Maintained**: Clear active/inactive states
- **Maintained**: Obvious primary action (Apply Filters)

---

## Implementation Priority

**High Priority** (Implement immediately):

1. Level buttons - Most visible inconsistency
2. Apply Filters button - Primary CTA should match design system

**Medium Priority** (Implement soon): 3. Club pills - Would complete the unified design

---

## Notes

- All changes use existing CSS variables from design system
- No new colors or tokens introduced
- Changes are purely visual (no functional impact)
- Maintains all existing ARIA labels and accessibility features
- Compatible with existing JavaScript event handlers
