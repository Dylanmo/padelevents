CSS Guidelines — padel-events

Purpose

- Provide practical CSS best practices tuned for this repo's single-file stylesheet approach (`assets/style.vN.css`).

Project constraints

- CSS is a single versioned file (e.g., `style.v1.css`). When making notable visual changes, increment the version and update `index.html` to avoid cache problems.
- No CSS preprocessors or build pipelines unless explicitly approved.

Contract

- Inputs: visual/UX change requests, CSS bugfixes.
- Outputs: readable, maintainable CSS; minimal risk of cascade conflicts; version bump when necessary.

Core rules

1. Versioning: Always add a new `style.v<N>.css` when changing public styles significantly. Keep `style.v1.css` as a historical artifact only if desired.
2. Organization: group rules by logical sections (layout, typography, components, utilities). Add a short header comment for each section.
3. Naming: prefer clear class names. Use simplified BEM convention (block\_\_element--modifier) for complex components, simple classes for utilities.
4. Specificity: keep selectors low-specificity. Prefer classes over IDs in selectors.
5. No global resets that break third-party components—keep resets scoped and minimal.
6. Avoid deep selector nesting; prefer flat, composable selectors.
7. Use modern layout (Flexbox, CSS Grid) over floats. Avoid hacks unless necessary.
8. Use custom properties (CSS variables) for design tokens (colors, spacing, typography).

## CSS Custom Properties (Design Tokens)

**Enforce custom properties** for consistency and easy theming:

```css
:root {
  /* Colors */
  --color-primary: #007bff;
  --color-primary-hover: #0056b3;
  --color-text: #333;
  --color-text-muted: #666;
  --color-bg: #fff;
  --color-bg-alt: #f8f9fa;
  --color-border: #dee2e6;
  --color-error: #dc3545;
  --color-success: #28a745;

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-body: system-ui, -apple-system, "Segoe UI", sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;

  /* Layout */
  --border-radius: 0.375rem;
  --transition-speed: 0.2s;
  --max-width-container: 1200px;
}

/* Use custom properties everywhere */
.button {
  background: var(--color-primary);
  color: var(--color-bg);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--border-radius);
  transition: background var(--transition-speed);
}

.button:hover {
  background: var(--color-primary-hover);
}
```

**Never use magic values** - define tokens for:

- All colors (including hover/focus/active states)
- Spacing/margins/padding
- Font sizes and weights
- Border radius values
- Transition/animation durations

## Responsive Design (Mobile-First)

**Always use mobile-first** media queries:

```css
/* ✅ GOOD - Mobile-first (default = mobile) */
.container {
  width: 100%;
  padding: var(--spacing-md);
}

@media (min-width: 768px) {
  .container {
    width: 750px;
    padding: var(--spacing-lg);
  }
}

@media (min-width: 1024px) {
  .container {
    width: 960px;
  }
}

/* ❌ BAD - Desktop-first (harder to maintain) */
.container {
  width: 1200px;
}
@media (max-width: 768px) {
  .container {
    width: 100%;
  }
}
```

**Breakpoint convention**:

```css
/* Mobile: default (no media query) */
/* Tablet: min-width: 768px */
/* Desktop: min-width: 1024px */
/* Large: min-width: 1280px */
```

## BEM Naming Convention

Use **simplified BEM** for complex components:

```css
/* Block - standalone component */
.event-card {
  display: flex;
  flex-direction: column;
}

/* Element - part of block (double underscore) */
.event-card__title {
  font-size: var(--font-size-lg);
  font-weight: bold;
}

.event-card__date {
  color: var(--color-text-muted);
}

/* Modifier - variant of block or element (double dash) */
.event-card--featured {
  border: 2px solid var(--color-primary);
}

.event-card--past {
  opacity: 0.6;
}
```

**Use simple classes** for single-purpose utilities:

```css
/* Utility classes (no BEM needed) */
.text-center {
  text-align: center;
}
.hidden {
  display: none;
}
.flex {
  display: flex;
}
.gap-md {
  gap: var(--spacing-md);
}
```

**When to use BEM**:

- ✅ Complex components with multiple child elements
- ✅ Components with variants/states
- ❌ Simple single-element styles
- ❌ Utility classes

Performance

- Keep file size small. Remove unused styles before bumping version.
- Combine font-face declarations carefully; prefer system fonts for smaller payloads if acceptable.
- Use compressed assets for images; prefer `srcset`/responsive images handled in HTML.

## Animation Performance

**Use GPU-accelerated properties** for smooth animations:

```css
/* ✅ GOOD - GPU-accelerated (transform, opacity) */
.modal {
  opacity: 0;
  transform: translateY(-20px);
  transition:
    opacity var(--transition-speed),
    transform var(--transition-speed);
}

.modal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ❌ BAD - Layout-shifting properties (slower) */
.modal {
  top: -20px;
  transition: top 0.3s; /* Forces reflow */
}
```

**Prefer**: `transform`, `opacity`, `filter`  
**Avoid animating**: `width`, `height`, `top`, `left`, `margin` (causes reflow)

## Dark Mode / Theming

**Use CSS custom properties** with `prefers-color-scheme`:

```css
:root {
  --color-bg: #fff;
  --color-text: #333;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
    --color-text: #f0f0f0;
  }
}

body {
  background: var(--color-bg);
  color: var(--color-text);
}
```

Accessibility & color

- Ensure color contrast (WCAG AA) for text.
- Avoid styling that relies solely on color to convey meaning; add clear text labels or icons.

Linting & tooling (MANDATORY)

- npx stylelint "assets/\*_/_.css" --fix
- npx prettier --check "_.html" "assets/\*\*/_.css" "assets/js/\*_/_.js"
- If Prettier reports issues: npx prettier --write "_.html" "assets/\*\*/_.css" "assets/js/\*_/_.js"

Release steps when changing CSS

1. Edit CSS locally.
2. Run stylelint and prettier; fix issues.
3. Bump CSS filename to next version (e.g., `style.v2.css`) if change is public-facing.
4. Update `<link href="assets/style.v2.css">` in `index.html`.
5. Add note in PR describing visual changes and confirm cache/versioning.

Checklist for PRs changing CSS

- [ ] Stylelint: PASS (auto-fixed where possible)
- [ ] Prettier: PASS
- [ ] CSS version bump included when appropriate
- [ ] No global specificity regressions introduced

References

- MDN CSS: https://developer.mozilla.org/docs/Web/CSS
- Stylelint: https://stylelint.io/
- web.dev CSS tips: https://web.dev/css

If you want, I can: add a `stylelint` config file tuned to this repo, or create a small CSS template header to paste into new versions (recommended). Ask if you'd like a preconfigured `.stylelintrc` added.
