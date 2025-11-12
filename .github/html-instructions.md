---
applyTo:
  - "**/*.html"
---

HTML Guidelines — padel-events

Purpose

- Short, practical HTML best practices tailored to this repo (single-page app: `index.html`).
- Keep HTML semantic, accessible, performant, and secure.

Project constraints (follow these first)

- This repo is frontend-only. `index.html` contains all UI + inline JS per project architecture.
- No build step. Do not introduce bundlers or new npm-based toolchains without prior agreement.
- CSS file is versioned (e.g. `assets/style.v1.css`). When making breaking style changes increment the filename and update the link in `index.html`.

Contract (what a PR touching HTML should deliver)

- Inputs: updated `index.html` (or minor static pages). Any data coming from the external API is considered untrusted.
- Outputs: valid, semantic HTML; no inline script injection vectors; accessible markup.
- Error modes: lint failures, accessibility regressions, or introducing XSS vectors.

Core rules (HTML)

1. Use semantic elements: `<main>`, `<header>`, `<nav>`, `<section>`, `<article>`, `<footer>`.
2. Keep content structure meaningful: headings must be hierarchical (H1 → H2 → H3).
3. Avoid empty or generic `<div>`/`<span>` when semantic elements apply.
4. Prefer declarative attributes (e.g., `rel="preload"`, `loading="lazy"` on images where appropriate).
5. Include meaningful `alt` on images. If purely decorative, use `alt=""`.
6. Forms: use `<label for>` for every input; use appropriate input types (email, tel, date).
7. Keep DOM size reasonable. Avoid rendering very large lists without pagination or sample previews.

## SEO & Metadata

### Essential Meta Tags

Include these in `<head>` for better search visibility and social sharing:

```html
<!-- Primary Meta Tags -->
<meta
  name="description"
  content="Find and add padel events in Bangkok to your calendar. Filter by club and skill level."
/>
<meta name="keywords" content="padel, Bangkok, events, calendar, sports" />

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://padelevents.com" />
<meta property="og:title" content="Padel Events Calendar - Bangkok" />
<meta
  property="og:description"
  content="Personalized padel event calendar for Bangkok clubs. Filter by level and add to Google Calendar."
/>
<meta
  property="og:image"
  content="https://padelevents.com/assets/og-image.png"
/>

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content="https://padelevents.com" />
<meta name="twitter:title" content="Padel Events Calendar - Bangkok" />
<meta
  name="twitter:description"
  content="Find padel events in Bangkok and add them to your calendar"
/>
<meta
  name="twitter:image"
  content="https://padelevents.com/assets/og-image.png"
/>
```

### Structured Data (JSON-LD)

For event listings, include schema.org markup for Google rich snippets:

```html
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "name": "Padel Match - Mid-Intermediate",
    "startDate": "2025-11-15T18:00:00+07:00",
    "endDate": "2025-11-15T20:00:00+07:00",
    "location": {
      "@type": "Place",
      "name": "Thonglor Padel Club",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bangkok",
        "addressCountry": "TH"
      }
    },
    "offers": {
      "@type": "Offer",
      "availability": "https://schema.org/InStock"
    }
  }
</script>
```

**Note**: Generate this dynamically for each event (implement in JS modules).

Accessibility (A11y)

- Follow WAI/WCAG principles: Perceivable, Operable, Understandable, Robust.
- Add `aria-*` only when necessary; prefer native semantics first.
- Ensure keyboard navigation: focusable elements, skip-to-content link if page length justifies it.
- Color contrast: check against WCAG AA (tools: web.dev contrast checker).

Security (XSS & data handling)

- Treat API-returned data as untrusted. When injecting text, use textContent or proper encoding; never write raw untrusted HTML into the page.
- Avoid using `innerHTML` with untrusted input. If templating via strings is necessary, sanitize using a vetted sanitizer (note: adding an external lib is a breaking change — ask first).
- Do not use `eval()`, `new Function()`, or similar constructs.

Performance

- Keep critical CSS small and ensure `style.v1.css` is linked in `<head>` and page-critical CSS is prioritized.
- Use `<link rel="preload" as="style">` if switching CSS versions leads to perceived delay.
- Use `loading="lazy"` on non-critical images.

## Progressive Enhancement

Provide graceful fallbacks for users without JavaScript:

```html
<noscript>
  <div class="noscript-warning">
    <p>
      This app requires JavaScript to function. Please enable JavaScript in your
      browser.
    </p>
    <p>
      Alternatively, view events at:
      <a href="mailto:info@padelevents.com">info@padelevents.com</a>
    </p>
  </div>
</noscript>
```

**Best practice**: If critical content can be rendered server-side or statically, do so. Use JS for enhancements only.

Linting & Validation (MANDATORY after each change)

- Run these locally before PRs (this matches the project policy):
  - npx htmlhint index.html
  - npx stylelint "assets/\*_/_.css" --fix
  - npx eslint "assets/js/\*_/_.js" --fix # run only if an ESLint config is present; otherwise document the skip
  - npx prettier --check "_.html" "assets/\*\*/_.css" "assets/js/\*_/_.js"
  - If Prettier reports issues: npx prettier --write "_.html" "assets/\*\*/_.css" "assets/js/\*_/_.js"

Checklist for PRs changing HTML

- [ ] HTMLHint: PASS
- [ ] Prettier: formatted (or changed files include formatting updates)
- [ ] No inline untrusted HTML insertion
- [ ] Accessibility quick-check: headings order, alt text, keyboard nav
- [ ] If CSS version changed, `assets/style.vX.css` added and `index.html` updated

Notes & links

- MDN HTML reference: https://developer.mozilla.org/docs/Web/HTML
- WAI accessibility intro: https://www.w3.org/WAI/fundamentals/accessibility-intro
- web.dev (Google) best practices: https://web.dev

If you'd like, I can add a small HTML template snippet for this repo (a minimal, well-commented `index.html` header) or add a GitHub Action to run HTMLHint / Prettier on PRs — say the word.
