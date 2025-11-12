# Accessibility Guidelines

**Part of**: Visual Design Guidelines  
**Last Updated**: November 12, 2025  
**Target**: WCAG 2.1 Level AA compliance

---

## Color Contrast

### Text Contrast Requirements

**WCAG AA Standards**:

- **Normal text** (< 18px): **4.5:1** minimum
- **Large text** (>= 18px or 14px bold): **3:1** minimum
- **UI components** (buttons, borders): **3:1** minimum

### Current Palette Compliance

**On white background (#ffffff)**:

- ✅ `--color-text-primary` (#111827): **15.5:1** (excellent)
- ✅ `--color-text-secondary` (#6b7280): **5.2:1** (passes AA)
- ⚠️ `--color-text-tertiary` (#9ca3af): **3.2:1** (use for large text only)
- ⚠️ `--color-primary` (#10b981): **3.1:1** (use for UI elements, not body text)

### Testing Tools

**Browser DevTools**:

- Chrome: Inspect > Color Picker > Contrast Ratio
- Firefox: Accessibility Inspector > Color Contrast

**Online Tools**:

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Contrast Ratio Calculator](https://contrast-ratio.com/)

**Automated Testing**:

```bash
# axe DevTools browser extension
# WAVE browser extension
```

---

## Keyboard Navigation

### Focus States

**All interactive elements must have visible focus**:

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

### Tab Order

**Follow logical reading order** (top to bottom, left to right):

```html
<!-- Good: Logical tab order -->
<nav>...</nav>
<main>...</main>
<aside>...</aside>
<footer>...</footer>

<!-- Bad: Skip links out of order -->
<main>...</main>
<nav>...</nav>
<!-- Don't put nav after main -->
```

### Skip Links

**Allow keyboard users to skip navigation**:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>

<nav>...</nav>

<main id="main-content">...</main>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-primary);
  color: white;
  padding: var(--space-2) var(--space-4);
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

---

## ARIA Labels & Attributes

### Button Labels

**Provide context for icon-only buttons**:

```html
<!-- Good -->
<button aria-label="Add event to Google Calendar">📅 Add to Calendar</button>

<!-- Bad -->
<button>📅</button>
```

### Toggle States

**Indicate current state**:

```html
<!-- Filter chip -->
<label class="filter-chip">
  <input type="checkbox" aria-checked="false" />
  <span>Thonglor Padel</span>
</label>

<!-- Level button -->
<button class="level-btn" aria-pressed="false">Beginner 0–2</button>
```

### Live Regions

**Announce dynamic content updates**:

```html
<div role="status" aria-live="polite" aria-atomic="true">Loading events...</div>

<!-- Changes to: -->
<div role="status" aria-live="polite" aria-atomic="true">Loaded 12 events</div>
```

**Use cases**:

- Loading states
- Error messages
- Success confirmations
- Filter result counts

---

## Semantic HTML

### Use Proper Elements

```html
<!-- Good: Semantic structure -->
<header>
  <nav>...</nav>
</header>

<main>
  <article class="event-card">
    <h3>Event Title</h3>
    <time datetime="2025-11-15T18:00">Fri 15 Nov • 18:00</time>
  </article>
</main>

<footer>...</footer>

<!-- Bad: Generic divs -->
<div class="header">
  <div class="nav">...</div>
</div>
```

### Heading Hierarchy

**Don't skip levels**:

```html
<!-- Good -->
<h1>Padel Events Bangkok</h1>
<h2>Thonglor Padel Club</h2>
<h3>Mixed Doubles Tournament</h3>

<!-- Bad: Skip from h1 to h3 -->
<h1>Padel Events Bangkok</h1>
<h3>Mixed Doubles Tournament</h3>
```

---

## Touch Targets

### Minimum Size

**iOS/Android guideline**: 44 × 44px minimum

```css
.btn {
  min-height: 44px;
  padding: var(--space-3) var(--space-6);
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
  margin: 12px; /* 20px + 12px margin = 44px total */
}
```

### Spacing Between Targets

**Minimum 8px gap between interactive elements**:

```css
.filter-chips {
  display: flex;
  gap: var(--space-2); /* 8px */
}
```

---

## Forms & Inputs

### Labels

**Always associate labels with inputs**:

```html
<!-- Good: Explicit association -->
<label for="email">Email Address</label>
<input type="email" id="email" name="email" />

<!-- Bad: No association -->
<label>Email Address</label>
<input type="email" name="email" />
```

### Error Messages

**Link errors to inputs**:

```html
<label for="email">Email Address</label>
<input
  type="email"
  id="email"
  aria-describedby="email-error"
  aria-invalid="true"
/>
<span id="email-error" class="error"> Please enter a valid email address </span>
```

---

## Images & Media

### Alt Text

**Provide meaningful descriptions**:

```html
<!-- Good: Descriptive alt text -->
<img src="padel-court.jpg" alt="Outdoor padel court at Thonglor Padel Club" />

<!-- Bad: Generic alt text -->
<img src="image1.jpg" alt="Image" />

<!-- Decorative images: Empty alt -->
<img src="decorative-line.svg" alt="" />
```

### SVG Icons

**Add titles for screen readers**:

```html
<svg aria-labelledby="calendar-icon-title">
  <title id="calendar-icon-title">Calendar icon</title>
  <!-- SVG paths -->
</svg>
```

---

## Motion & Animation

### Respect User Preferences

**Disable animations for users who prefer reduced motion**:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Don't Rely on Hover

**Ensure functionality works without hover** (for touch devices):

```css
/* Bad: Hover-only disclosure */
.menu-item:hover .submenu {
  display: block;
}

/* Good: Click/tap to open */
.menu-item[aria-expanded="true"] .submenu {
  display: block;
}
```

---

## Screen Reader Testing

### Tools

**Desktop**:

- **macOS**: VoiceOver (Cmd + F5)
- **Windows**: NVDA (free), JAWS (paid)
- **Linux**: Orca

**Mobile**:

- **iOS**: VoiceOver (Settings > Accessibility)
- **Android**: TalkBack (Settings > Accessibility)

### Test Scenarios

1. **Navigate with Tab key** — Can you reach all interactive elements?
2. **Activate with Enter/Space** — Do buttons work without mouse?
3. **Use screen reader** — Is content announced logically?
4. **Zoom to 200%** — Does layout remain usable?
5. **Use high contrast mode** — Is content still visible?

---

## Checklist (Before Shipping)

- [ ] Color contrast >= 4.5:1 for text, 3:1 for UI elements
- [ ] All interactive elements have visible `:focus-visible` styles
- [ ] Touch targets >= 44 × 44px
- [ ] All images have appropriate `alt` text
- [ ] Forms have associated `<label>` elements
- [ ] Buttons have descriptive `aria-label` if text-only is unclear
- [ ] Heading hierarchy follows logical order (h1 → h2 → h3)
- [ ] Tested with keyboard navigation (Tab, Enter, Space)
- [ ] Tested with screen reader (VoiceOver, NVDA, or TalkBack)
- [ ] No horizontal scroll at 375px width
- [ ] Content remains readable at 200% zoom
- [ ] Animations respect `prefers-reduced-motion`

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Checklist](https://webaim.org/standards/wcag/checklist)
- [A11y Project](https://www.a11yproject.com/)
- [MDN Accessibility Guide](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
