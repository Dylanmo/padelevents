# Component Design Specifications

**Part of**: Visual Design Guidelines  
**Last Updated**: November 12, 2025

---

## Event Cards

### Mobile Layout (< 640px)

**Visual Structure**:
```
┌─────────────────────────────────────┐
│ 📍 Section Header: Club Name       │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ Event Title (18px, semibold)    │ │
│ │ Fri 15 Nov • 18:00–20:00        │ │
│ │ 📍 Club • 🥇 Level 3–4          │ │
│ │                                 │ │
│ │ [Add to Calendar] [Download ICS]│ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ (next event)                    │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**HTML Structure**:
```html
<section class="club-section">
  <h2 class="club-section__header">📍 Thonglor Padel Club</h2>
  
  <article class="event-card">
    <h3 class="event-card__title">Mixed Doubles Tournament</h3>
    
    <div class="event-card__meta">
      <time class="event-card__datetime">Fri 15 Nov • 18:00–20:00</time>
      <div class="event-card__details">
        <span class="event-card__club">📍 Thonglor Padel</span>
        <span class="event-card__level">🥇 Level 3–4</span>
      </div>
    </div>
    
    <div class="event-card__actions">
      <button class="btn btn-primary" aria-label="Add event to Google Calendar">
        Add to Calendar
      </button>
      <button class="btn btn-secondary" aria-label="Download ICS file">
        Download ICS
      </button>
    </div>
  </article>
</section>
```

**CSS**:
```css
.club-section {
  margin-bottom: var(--space-8);
}

.club-section__header {
  font-size: var(--text-xl);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--space-4);
  padding: 0 var(--space-4);
}

.event-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: var(--space-4);
  margin: 0 var(--space-4) var(--space-4);
}

.event-card__title {
  font-size: var(--text-lg);
  font-weight: var(--weight-semibold);
  color: var(--color-text-primary);
  line-height: var(--leading-tight);
  margin-bottom: var(--space-2);
}

.event-card__datetime {
  display: block;
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--space-2);
}

.event-card__details {
  display: flex;
  gap: var(--space-3);
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
}

.event-card__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

@media (min-width: 375px) {
  .event-card__actions {
    flex-direction: row;
  }
}
```

### Desktop Layout (>= 640px)

**Grid Layout**:
```css
@media (min-width: 640px) {
  .club-section {
    padding: 0 var(--space-6);
  }
  
  .event-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-4);
  }
  
  .event-card {
    margin: 0; /* Remove horizontal margins in grid */
  }
}

@media (min-width: 1024px) {
  .event-list {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

---

## Filters

### Club Filter Chips

**Visual States**:
- Default: White background, gray border
- Hover: Green border
- Active/Checked: Green background (light), green border, green text

**HTML**:
```html
<div class="filter-group">
  <h3 class="filter-group__label">Select Clubs</h3>
  <div class="filter-chips">
    <label class="filter-chip">
      <input type="checkbox" class="filter-chip__input" value="thonglor" aria-checked="false">
      <span class="filter-chip__label">Thonglor Padel</span>
    </label>
    <!-- Repeat for each club -->
  </div>
</div>
```

**CSS**:
```css
.filter-group {
  margin-bottom: var(--space-6);
}

.filter-group__label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-3);
}

.filter-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  padding: var(--space-2) var(--space-4);
  border: 2px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-bg-card);
  cursor: pointer;
  transition: all var(--transition-base);
  user-select: none;
}

.filter-chip__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.filter-chip:hover {
  border-color: var(--color-primary);
}

.filter-chip__input:checked + .filter-chip,
.filter-chip--active {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  color: var(--color-primary);
  font-weight: var(--weight-medium);
}

.filter-chip:focus-within {
  outline: 2px solid var(--color-border-focus);
  outline-offset: 2px;
}
```

### Level Filter Buttons

**Visual States**:
- Default: White background, gray border
- Active: Green background, white text

**HTML**:
```html
<div class="filter-group">
  <h3 class="filter-group__label">Select Levels</h3>
  <div class="level-filters">
    <button class="level-btn" data-level="0-2" aria-pressed="false">
      <span class="level-btn__label">Beginner</span>
      <span class="level-btn__range">0–2</span>
    </button>
    <!-- Repeat for each level -->
  </div>
</div>
```

**CSS**:
```css
.level-filters {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
}

@media (min-width: 640px) {
  .level-filters {
    grid-template-columns: repeat(4, 1fr);
  }
}

.level-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-3) var(--space-2);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-bg-card);
  cursor: pointer;
  transition: all var(--transition-base);
  min-height: 64px;
}

.level-btn__label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  margin-bottom: var(--space-1);
}

.level-btn__range {
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.level-btn:hover {
  border-color: var(--color-primary);
}

.level-btn--active,
.level-btn[aria-pressed="true"] {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text-inverse);
}

.level-btn--active .level-btn__range {
  color: rgba(255, 255, 255, 0.8);
}
```

---

## Buttons

### Primary Button (CTA)

**Use for**: Main actions (Add to Calendar, Submit, Confirm)

```css
.btn-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 8px;
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  padding: var(--space-3) var(--space-6);
  min-height: 44px;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:disabled {
  background: var(--color-border);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
}
```

### Secondary Button

**Use for**: Alternative actions (Download ICS, Cancel)

```css
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: 8px;
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  padding: var(--space-3) var(--space-6);
  min-height: 44px;
  cursor: pointer;
  transition: all var(--transition-base);
}

.btn-secondary:hover {
  background: var(--color-primary-light);
}

.btn-secondary:active {
  transform: scale(0.98);
}
```

### Text Button

**Use for**: Tertiary actions (View Details, Learn More)

```css
.btn-text {
  background: transparent;
  color: var(--color-primary);
  border: none;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  padding: var(--space-2) var(--space-3);
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.btn-text:hover {
  color: var(--color-primary-hover);
}
```

---

## Form Elements

### Input Fields

```css
.input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: var(--text-base);
  color: var(--color-text-primary);
  background: var(--color-bg-card);
  transition: border-color var(--transition-base);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.input::placeholder {
  color: var(--color-text-tertiary);
}

.input:disabled {
  background: var(--color-bg-page);
  color: var(--color-text-tertiary);
  cursor: not-allowed;
}
```

### Select Dropdown

```css
.select {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: var(--text-base);
  background: var(--color-bg-card);
  cursor: pointer;
}
```

---

## Loading States

### Skeleton Loader (for event cards)

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--color-bg-page) 0%,
    #f0f0f0 50%,
    var(--color-bg-page) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.skeleton-card {
  padding: var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.skeleton-title {
  height: 24px;
  width: 70%;
  margin-bottom: var(--space-2);
}

.skeleton-text {
  height: 16px;
  width: 50%;
  margin-bottom: var(--space-2);
}

.skeleton-button {
  height: 44px;
  width: 100%;
  margin-top: var(--space-4);
}
```

---

## Error & Success States

### Error Message

```css
.alert-error {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: #fef2f2;
  border: 1px solid var(--color-error);
  border-radius: 8px;
  color: #991b1b;
}

.alert-error::before {
  content: '⚠️';
  font-size: var(--text-lg);
}
```

### Success Message

```css
.alert-success {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: #f0fdf4;
  border: 1px solid var(--color-success);
  border-radius: 8px;
  color: #166534;
}

.alert-success::before {
  content: '✓';
  font-size: var(--text-lg);
}
```

---

## Implementation Notes

**When adding a new component**:
1. Add HTML structure to this file
2. Add CSS to `assets/style.v1.css`
3. Update visual guidelines if introducing new patterns
4. Test on mobile (375px) before desktop
5. Check color contrast with browser dev tools
6. Validate with htmlhint, stylelint before commit
