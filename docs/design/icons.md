# Icon Design Guidelines

## Overview

Icons in Padel Events Calendar are minimal, consistent, and use SVG format for scalability and performance. All icons follow a strict design system to maintain visual coherence.

## Icon Principles

### 1. Format: SVG Only

- **Always use inline SVG** - Never use icon fonts or raster images (PNG, JPG)
- **Inline for flexibility** - Embed SVG code directly in HTML/JS for color control and accessibility
- **Optimize paths** - Keep SVG paths simple and minimal (use tools like SVGO if needed)

### 2. Color System

Icons must use brand colors from the design system:

- **Primary actions**: `var(--color-primary)` (#10b981 - emerald green)
- **Secondary/accent**: `var(--color-accent)` (#0891b2 - cyan)
- **Text-level icons**: `currentColor` (inherits from parent text color)
- **Disabled/muted**: `var(--color-text-tertiary)` (#9ca3af - gray)

**Example:**
```html
<!-- Location icon using primary brand color -->
<svg class="location-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
</svg>
```

### 3. Sizing System

Consistent icon sizes across the UI:

- **Small (16px)**: Inline with text, detail items, secondary indicators
- **Medium (20px)**: Section headers, primary labels
- **Large (24px)**: Hero sections, major CTAs (rare)

**CSS:**
```css
.location-icon {
  flex-shrink: 0;
  color: var(--color-primary);
}

/* Size variants */
.club-header .location-icon {
  width: 20px;
  height: 20px;
}

.detail-club .location-icon {
  width: 16px;
  height: 16px;
}
```

### 4. Visual Style

- **Filled style preferred** - Use solid fills for primary icons (e.g., location pin)
- **Outlined style for UI controls** - Calendar, download icons use stroke-based outlines
- **Consistent stroke width**: 2px for outlined icons
- **Rounded caps and joins**: `stroke-linecap="round" stroke-linejoin="round"`

### 5. Accessibility

- **Add `aria-hidden="true"`** for decorative icons that duplicate adjacent text
- **Add descriptive `aria-label`** to parent element if icon is the only indicator
- **Use semantic color** - Don't rely on color alone; ensure sufficient contrast

**Example:**
```html
<!-- Decorative icon with aria-hidden -->
<span class="detail-club">
  <svg class="location-icon" aria-hidden="true">...</svg>
  Bangkok Padel Club
</span>

<!-- Icon-only button with aria-label on parent -->
<button aria-label="View all Bangkok Padel Club events">
  <svg>...</svg>
</button>
```

## Current Icons

### Location Pin Icon (Filled)

**Usage**: Club headers, event location details

**Size**: 20px (headers), 16px (inline text)

**Color**: `currentColor` (inherits `--color-primary`)

```html
<svg class="location-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
</svg>
```

### Medal/Level Icon (Filled Star)

**Usage**: Padel level indicator in event details

**Size**: 16px (inline text)

**Color**: `currentColor` (inherits `--color-warning` #f59e0b - amber/gold)

```html
<svg class="level-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
</svg>
```

### Calendar Icon (Outlined)

**Usage**: Calendar action buttons (Google Calendar, ICS download)

**Size**: 18px (button icons)

**Color**: `currentColor` (inherits button text color)

```html
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
  <line x1="16" y1="2" x2="16" y2="6"></line>
  <line x1="8" y1="2" x2="8" y2="6"></line>
  <line x1="3" y1="10" x2="21" y2="10"></line>
  <line x1="10" y1="16" x2="14" y2="16"></line>
  <line x1="12" y1="14" x2="12" y2="18"></line>
</svg>
```

## Adding New Icons

When adding a new icon:

1. **Source from minimal icon sets**: Prefer Feather Icons, Heroicons, or Material Icons Outlined
2. **Optimize SVG code**: Remove unnecessary attributes (`id`, `class`, `style` from source)
3. **Use 24×24 viewBox**: Standard viewBox for consistency, scale with width/height props
4. **Apply brand color**: Use `fill="currentColor"` or `stroke="currentColor"`
5. **Test at all sizes**: Verify icon remains clear at 16px, 20px, 24px
6. **Document here**: Add to this guide with usage context and code snippet

## Don'ts

❌ **Don't use emoji as icons** - Emoji render inconsistently across platforms

❌ **Don't use icon fonts** - Poor accessibility, extra HTTP request, FOIT/FOUT issues

❌ **Don't use raster images** - PNG/JPG don't scale, larger file sizes

❌ **Don't use complex illustrations** - Keep icons minimal (< 200 bytes of SVG code)

❌ **Don't hardcode colors** - Always use CSS variables or `currentColor`

❌ **Don't skip accessibility** - Always add `aria-hidden` or `aria-label`

## Examples in Production

### Club Section Header
```html
<h2 class="club-header">
  <span class="club-header-text">
    <svg class="location-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
    </svg>
    Bangkok Padel Club
  </span>
  <a href="#" class="club-link">View all →</a>
</h2>
```

### Event Detail Item
```html
<span class="detail-item detail-club">
  <svg class="location-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
  </svg>
  Bangkok Padel Club
</span>

<span class="detail-item detail-level">
  <svg class="level-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
  </svg>
  <strong>Level:</strong> 2.5–7
</span>
```

### Calendar Button
```html
<a href="..." class="btn-calendar btn-google">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
  Google Calendar
</a>
```

## Performance Notes

- **Inline SVG is optimal** - No extra HTTP requests, can be cached with HTML/JS
- **Gzip-friendly** - SVG XML compresses very well (often 80%+ reduction)
- **GPU-accelerated** - Modern browsers render SVG with hardware acceleration
- **No FOUT/FOIT** - Unlike icon fonts, SVG renders immediately with content

## Resources

- [Feather Icons](https://feathericons.com/) - Minimal, open-source icon set
- [Heroicons](https://heroicons.com/) - Tailwind's icon library (outline/solid variants)
- [SVGO](https://github.com/svg/svgo) - SVG optimization tool
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Web-based SVG optimizer
