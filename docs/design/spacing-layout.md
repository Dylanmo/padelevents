# Spacing & Layout System

**Part of**: Visual Design Guidelines  
**Last Updated**: November 12, 2025

---

## Spacing Scale

**4px-based system** for consistent, harmonious spacing:

```css
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
```

---

## Usage Guidelines

### Tight Spacing (4–8px)

**Use for**:

- Icon + label pairs
- Tag/badge padding
- Related form elements (label + input)

```css
.icon-label {
  display: flex;
  align-items: center;
  gap: var(--space-2); /* 8px */
}
```

### Default Spacing (12–16px)

**Use for**:

- Card padding
- Button padding
- Section margins
- Between form fields

```css
.card {
  padding: var(--space-4); /* 16px */
}

.form-field + .form-field {
  margin-top: var(--space-4); /* 16px */
}
```

### Comfortable Spacing (20–24px)

**Use for**:

- Between major sections
- Bottom margin of headings
- Around CTAs

```css
section + section {
  margin-top: var(--space-6); /* 24px */
}

h2 {
  margin-bottom: var(--space-5); /* 20px */
}
```

### Generous Spacing (32–48px)

**Use for**:

- Page-level margins
- Major section breaks
- Hero spacing (desktop)

```css
.page-header {
  margin-bottom: var(--space-8); /* 32px */
}

@media (min-width: 768px) {
  .hero {
    padding: var(--space-12); /* 48px */
  }
}
```

---

## Container Widths

```css
--container-sm: 640px; /* Single column content */
--container-md: 768px; /* Tablet */
--container-lg: 1024px; /* Desktop */
--container-xl: 1280px; /* Wide desktop (max) */
```

**Usage**:

```css
.container {
  max-width: var(--container-xl);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding-left: var(--space-6);
    padding-right: var(--space-6);
  }
}
```

---

## Responsive Breakpoints

```css
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
```

**Mobile-first approach**:

```css
/* Base styles = mobile (< 640px) */
.component {
  padding: var(--space-4);
}

/* Tablet+ */
@media (min-width: 768px) {
  .component {
    padding: var(--space-6);
  }
}

/* Desktop+ */
@media (min-width: 1024px) {
  .component {
    padding: var(--space-8);
  }
}
```

---

## Layout Patterns

### Single Column (Mobile)

```css
.event-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
```

### Two-Column Grid (Tablet)

```css
@media (min-width: 640px) {
  .event-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
}
```

### Three-Column Grid (Desktop)

```css
@media (min-width: 1024px) {
  .event-list {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-6);
  }
}
```

---

## Touch Targets

**Minimum touch target size**: 44 × 44px (iOS/Android guideline)

```css
.btn {
  min-height: 44px;
  padding: var(--space-3) var(--space-6); /* 12px 24px */
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin: 12px; /* 20px + 12px margin on each side = 44px total */
}
```

**Test**: Use browser dev tools to measure hit area (should be >= 44px square).

---

## Vertical Rhythm

**Principle**: Maintain consistent spacing between elements for visual harmony.

```css
/* Example: Event card internal spacing */
.event-card {
  padding: var(--space-4);
}

.event-card__title {
  margin-bottom: var(--space-2); /* 8px */
}

.event-card__meta {
  margin-bottom: var(--space-3); /* 12px */
}

.event-card__actions {
  margin-top: var(--space-4); /* 16px */
}
```

**Result**: 4px increments create predictable, harmonious vertical flow.

---

## Usage Patterns

### Do's

✅ **Use spacing scale** — Always use CSS variables, not arbitrary values  
✅ **Double spacing for major breaks** — If default is 16px, use 32px for sections  
✅ **Increase spacing on larger screens** — More room = more breathing space  
✅ **Test on real devices** — Spacing feels different on mobile vs desktop

### Don'ts

❌ **Don't use arbitrary spacing** — Stick to the 4px scale  
❌ **Don't use negative margins** — Avoid layout hacks, use flexbox/grid  
❌ **Don't cram content** — Whitespace improves readability  
❌ **Don't forget touch targets** — Minimum 44px for interactive elements

---

## Testing Checklist

Before shipping layout changes:

- [ ] All spacing uses CSS variables from scale
- [ ] Touch targets >= 44px (measured in browser dev tools)
- [ ] Tested at 375px, 640px, 1024px widths
- [ ] Vertical rhythm is consistent (no random spacing)
- [ ] No horizontal scroll on mobile (375px width)
