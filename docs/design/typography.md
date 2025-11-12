# Typography System

**Part of**: Visual Design Guidelines  
**Last Updated**: November 12, 2025

---

## Font Stack

We use **system fonts** for optimal performance and native feel:

```css
--font-sans:
  -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
  Arial, sans-serif;
--font-mono: "SF Mono", Monaco, "Cascadia Code", "Courier New", monospace;
```

### Why System Fonts?

✅ **Zero latency** — No network requests, instant load  
✅ **Platform-optimized** — iOS, Android, Windows, macOS native fonts  
✅ **Accessible** — Familiar and readable for all users  
✅ **Consistent** — Matches native apps on each platform

---

## Type Scale

**Mobile-first sizing** (base 16px):

```css
--text-xs: 0.75rem; /* 12px - Captions, labels */
--text-sm: 0.875rem; /* 14px - Metadata, small UI text */
--text-base: 1rem; /* 16px - Body text (minimum for readability) */
--text-lg: 1.125rem; /* 18px - Card titles */
--text-xl: 1.25rem; /* 20px - Section headers */
--text-2xl: 1.5rem; /* 24px - Page titles */
--text-3xl: 1.875rem; /* 30px - Hero text (desktop only) */
```

**Never use font sizes smaller than 16px for body text** (accessibility guideline).

---

## Line Heights

```css
--leading-tight: 1.25; /* Headings */
--leading-normal: 1.5; /* Body text (minimum for readability) */
--leading-relaxed: 1.75; /* Long-form content */
```

**Rule**: Use `--leading-tight` for headings, `--leading-normal` for body.

---

## Font Weights

```css
--weight-normal: 400; /* Body text */
--weight-medium: 500; /* Emphasized text, button labels */
--weight-semibold: 600; /* Subheadings, card titles */
--weight-bold: 700; /* Page headings */
```

**Avoid using too many weights** — Stick to 400, 600, 700 for consistency.

---

## Hierarchy Examples

### Page Title (H1)

```css
h1 {
  font-size: var(--text-2xl); /* 24px */
  font-weight: var(--weight-bold);
  line-height: var(--leading-tight);
  color: var(--color-text-primary);
}

@media (min-width: 768px) {
  h1 {
    font-size: var(--text-3xl); /* 30px on tablet+ */
  }
}
```

### Section Header (H2)

```css
h2 {
  font-size: var(--text-xl); /* 20px */
  font-weight: var(--weight-semibold);
  line-height: var(--leading-tight);
  color: var(--color-text-primary);
}
```

### Card Title (H3)

```css
h3 {
  font-size: var(--text-lg); /* 18px */
  font-weight: var(--weight-semibold);
  line-height: var(--leading-tight);
  color: var(--color-text-primary);
}
```

### Body Text

```css
p,
li {
  font-size: var(--text-base); /* 16px */
  font-weight: var(--weight-normal);
  line-height: var(--leading-normal);
  color: var(--color-text-primary);
}
```

### Metadata (small text)

```css
.metadata {
  font-size: var(--text-sm); /* 14px */
  font-weight: var(--weight-normal);
  color: var(--color-text-secondary);
}
```

### Labels (uppercase, small)

```css
.label {
  font-size: var(--text-xs); /* 12px */
  font-weight: var(--weight-medium);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}
```

---

## Accessibility Guidelines

### Minimum Sizes

- **Body text**: 16px minimum (never smaller)
- **Small UI text**: 14px minimum (for metadata, labels)
- **Touch targets**: Ensure 44px minimum height (text + padding)

### Contrast

- **Primary text** on white: 15.5:1 ✅
- **Secondary text** on white: 5.2:1 ✅
- **Tertiary text** on white: 3.2:1 ⚠️ (use for large text or non-critical UI)

### Line Length

- **Optimal**: 50–75 characters per line
- **Maximum**: 90 characters per line

```css
.prose {
  max-width: 65ch; /* Roughly 65 characters */
}
```

---

## Usage Patterns

### Do's

✅ **Use system fonts** — Never add custom web fonts (performance cost)  
✅ **Stick to type scale** — Don't use arbitrary sizes  
✅ **Use semibold (600) for headings** — More readable than bold (700)  
✅ **Use normal (400) for body** — Lightest weight for long text  
✅ **Increase line-height for long content** — Use `--leading-relaxed` (1.75)

### Don'ts

❌ **Don't use font sizes < 16px for body text**  
❌ **Don't use too many font weights** (max 3: 400, 600, 700)  
❌ **Don't use bold (700) for body text** — Too heavy for long reading  
❌ **Don't use tight line-height for body** — Minimum 1.5 for readability  
❌ **Don't rely on font style alone** — Combine with color, size, weight

---

## Testing Checklist

Before shipping typography changes:

- [ ] All body text >= 16px
- [ ] Line height >= 1.5 for body text
- [ ] Text contrast meets WCAG AA (4.5:1 for body, 3:1 for large text)
- [ ] Headings use semibold (600) or bold (700)
- [ ] No custom web fonts loaded (system fonts only)
- [ ] Tested on iOS Safari, Android Chrome, Desktop Chrome
