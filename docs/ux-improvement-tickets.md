# UX Improvement Tickets for eferro-talks

Analysis performed on 2026-03-14 based on a comprehensive review of the site
structure, HTML, CSS, and JavaScript code.

---

## Ticket 1: Add skip-to-content link for keyboard and screen reader accessibility

**Type:** Accessibility / UX
**Priority:** High
**Labels:** `enhancement`, `accessibility`, `ux`

### Problem

The site lacks a "Skip to content" link, which is a fundamental accessibility
requirement (WCAG 2.1 Level A - Success Criterion 2.4.1). Keyboard and screen
reader users must tab through all header elements (logo, language toggle) on
every page before reaching the main content.

### Current Behavior

- Users navigating with keyboard must tab through all header elements before
  reaching the filters/content.
- On the detail page, users must tab through header + language toggle before
  the back link and content.
- No visible skip link appears when using Tab navigation.

### Expected Behavior

- A visually hidden link appears as the first focusable element on each page.
- When focused (via Tab), the link becomes visible at the top of the page.
- Clicking or pressing Enter on it moves focus directly to the `<main>` content
  area.

### Implementation Suggestions

1. Add `<a href="#main-content" class="skip-link">Skip to content</a>` as the
   first child of `<body>` in both `index.html` and `talk-detail.html`.
2. Add `id="main-content"` to the `<main>` element.
3. CSS: visually hide the link by default, show it on `:focus` with absolute
   positioning at the top.

### Files Affected

- `index.html`
- `talk-detail.html`
- `style.css`

### Acceptance Criteria

- [ ] Skip link is the first focusable element on both pages
- [ ] Link is visually hidden until focused
- [ ] Pressing Enter navigates focus to main content
- [ ] Both `index.html` and `talk-detail.html` include the skip link
- [ ] Translations for ES/EN are handled

---

## Ticket 2: Make entire talk card clickable to navigate to detail page

**Type:** UX
**Priority:** High
**Labels:** `enhancement`, `ux`

### Problem

Currently, users can only navigate to a talk detail page by clicking the small
"View full details" button at the bottom of each card. The entire card surface
area is wasted as a non-interactive element, which goes against user
expectations. Most modern card-based UIs make the whole card clickable.

### Current Behavior

- Talk cards show title, metadata, description, and links.
- Only the "View full details" button (when present) navigates to the detail
  page.
- Cards that lack `key_learning`/`key_points` content have no link to details
  at all.
- Hovering over the card changes the shadow but provides no cursor change,
  giving a false affordance.

### Expected Behavior

- Clicking anywhere on the card navigates to the talk detail page.
- The cursor changes to `pointer` when hovering over the card.
- External links (Blog, Video, Slides) remain independently clickable without
  triggering card navigation.
- Visual hover feedback (shadow elevation) aligns with the clickable behavior.

### Implementation Suggestions

- Wrap the card content (except external links) in an `<a>` tag, or
- Add a click event handler on the card that navigates to detail, with
  `stopPropagation` on external link clicks.
- Use CSS `cursor: pointer` on `.talk-card`.

### Files Affected

- `script.js` (`createTalkCard` function)
- `style.css`

### Acceptance Criteria

- [ ] Clicking any non-link area of a card navigates to the detail page
- [ ] External links (Blog, Video, Slides) still work independently
- [ ] Cursor shows pointer on card hover
- [ ] Keyboard accessible (Enter/Space on focused card navigates)
- [ ] All cards link to detail, not just those with `key_learning` content

---

## Ticket 3: Add a clear/reset all filters button

**Type:** UX
**Priority:** Medium
**Labels:** `enhancement`, `ux`

### Problem

When users apply multiple filters (year, language, type, core, search text),
there is no quick way to reset all filters at once. Users must manually clear
the search input and reset each dropdown individually.

### Current Behavior

- Users must individually reset each filter (3 dropdowns + 1 checkbox + 1 text
  input).
- No indication of how many filters are active.
- After filtering to zero results, recovery requires multiple interactions.

### Expected Behavior

- A "Clear filters" / "Limpiar filtros" button appears near the filter
  controls.
- The button is only visible/enabled when at least one filter is active.
- Clicking it resets all filters to their default values and shows all talks.

### Implementation Suggestions

- Add a button element inside `.controls` div, after `.filters` div.
- Style it as a subtle text button or secondary button.
- Add translations for both ES ("Limpiar filtros") and EN ("Clear filters").
- Show/hide based on whether any filter differs from default.

### Files Affected

- `index.html` (add button element)
- `script.js` (add clear logic, visibility toggle)
- `style.css` (styling)

### Acceptance Criteria

- [ ] Clear button appears only when filters are active
- [ ] Clicking resets all filters (dropdowns, checkbox, search)
- [ ] Results update immediately after clearing
- [ ] Button text is translated (ES/EN)
- [ ] Keyboard accessible

---

## Ticket 4: Persist filter state in URL query parameters

**Type:** UX
**Priority:** Medium
**Labels:** `enhancement`, `ux`

### Problem

Filter selections are not reflected in the URL. Users cannot bookmark a
filtered view, share a link to "core talks only", or use browser back/forward
to navigate filter history. Refreshing the page loses all filter state.

### Current Behavior

- URL is always `index.html` regardless of active filters.
- Refreshing the page resets all filters.
- Browser history does not track filter changes.

### Expected Behavior

- Filter changes update URL query parameters (e.g.,
  `?year=2024&type=talk&core=true&q=testing`).
- Loading a URL with query parameters restores the filter state.
- Browser back/forward buttons navigate through filter history.

### Implementation Suggestions

- Use `URLSearchParams` to read/write query parameters.
- On `applyFilters()`, update `window.history.replaceState` or `pushState`.
- On page load, read URL params and set filter values before initial render.

### Files Affected

- `script.js` (filter persistence logic)

### Acceptance Criteria

- [ ] Filter changes update URL query parameters
- [ ] Loading a URL with params restores filter state
- [ ] Browser back/forward navigates filter history
- [ ] Default filters produce a clean URL (no unnecessary params)

---

## Ticket 5: Remove console.log DEBUG statements from production code

**Type:** Bug / Code Quality
**Priority:** High
**Labels:** `bug`, `ux`

### Problem

The production JavaScript contains multiple `console.log("DEBUG ...")`
statements left from development. These pollute the browser console and look
unprofessional when users open Developer Tools.

### Current Behavior

In `script.js`:

- **Lines 107-113** (`loadTalks()`): Logs total talks count, first talk object,
  keys, and language values.
- **Lines 238-243** (`createTalkCard()`): Logs card debug info for every single
  talk card rendered.

This generates 40+ debug log entries on every page load.

### Expected Behavior

- No debug/development log statements in production code.
- Only `console.error` for actual error conditions should remain.

### Files Affected

- `script.js` (lines 107-113 and lines 238-243)

### Acceptance Criteria

- [ ] All `console.log("DEBUG` statements removed from `script.js`
- [ ] Error logging (`console.error`) in catch blocks is preserved
- [ ] No regression in functionality

---

## Ticket 6: Translate hardcoded English labels in detail page metadata

**Type:** i18n / UX
**Priority:** Medium
**Labels:** `bug`, `i18n`, `ux`

### Problem

The talk detail page has hardcoded English labels ("Year:", "Event:",
"Co-authors:", "Core Talk") in the metadata section that do not change when the
user switches to Spanish. This breaks the bilingual experience.

### Current Behavior

In `talk-detail.js`, `renderTalkDetail()` function (around line 120-123):

```javascript
${talk.year ? `<span class="meta-item"><strong>Year:</strong> ${talk.year}</span>` : ''}
${talk.place ? `<span class="meta-item"><strong>Event:</strong> ${escapeHtml(talk.place)}</span>` : ''}
${talk.coauthors ? `<span class="meta-item"><strong>Co-authors:</strong> ${escapeHtml(talk.coauthors)}</span>` : ''}
${talk.core ? `<span class="meta-badge core-badge">Core Talk</span>` : ''}
```

These labels remain in English regardless of the selected language.

### Expected Behavior

- "Year:" becomes "Año:" in Spanish
- "Event:" becomes "Evento:" in Spanish
- "Co-authors:" becomes "Coautores:" in Spanish
- "Core Talk" becomes "Charla Core" in Spanish

### Implementation Suggestions

- Add translation keys to the `translations` object in `talk-detail.js`.
- Replace hardcoded strings with `t()` function calls.

### Files Affected

- `talk-detail.js`

### Acceptance Criteria

- [ ] All metadata labels use the translation system
- [ ] Labels update when switching language
- [ ] Both ES and EN translations are correct

---

## Ticket 7: Add loading skeleton or spinner animation

**Type:** UX
**Priority:** Low
**Labels:** `enhancement`, `ux`

### Problem

When the page loads, users see plain text "Cargando charlas..." / "Loading
talks..." without any visual animation. This feels static and does not
communicate progress. On slower connections, the plain text loading state feels
broken.

### Current Behavior

- `index.html` shows `<div class="loading">Cargando charlas...</div>`.
- `talk-detail.html` shows `<div class="detail-loading">Loading talk
  details...</div>`.
- No animation, spinner, or skeleton UI.

### Expected Behavior

- A subtle loading animation (CSS spinner or skeleton cards) appears during data
  fetch.
- The animation provides visual feedback that the page is working.
- Loading state transitions smoothly to content.

### Implementation Suggestions

Option A: CSS spinner next to loading text. Option B: Skeleton cards (gray
placeholder cards that pulse) matching the card layout. CSS-only solution
preferred (no additional JS libraries).

### Files Affected

- `style.css` (animation styles)
- Optionally `index.html` and `talk-detail.html` (enhanced loading markup)

### Acceptance Criteria

- [ ] Loading state includes visual animation
- [ ] Animation is CSS-only (no additional dependencies)
- [ ] Smooth transition from loading to content
- [ ] Works on both index and detail pages

---

## Ticket 8: Highlight search matches in talk cards

**Type:** UX
**Priority:** Low
**Labels:** `enhancement`, `ux`

### Problem

When users search for talks, the matching text is not highlighted in the
results. Users cannot quickly see why a particular talk matched their search
query, especially when the match is in the description or key learning content
rather than the title.

### Current Behavior

- Search filters talks correctly.
- No visual indication of where the search term appears in the displayed
  content.
- Users must re-read the entire card to find the matching text.

### Expected Behavior

- Matching text in title and description is highlighted (e.g., with a yellow
  background or bold text).
- Highlighting updates as the search query changes.
- Highlighting is removed when the search field is cleared.

### Implementation Suggestions

- After filtering, wrap matching text in `<mark>` elements.
- Use CSS to style `mark` elements with a subtle background color.
- Ensure HTML escaping is maintained (highlight after escaping, not before).

### Files Affected

- `script.js` (`createTalkCard` or `renderTalks`)
- `style.css` (`mark` element styling)

### Acceptance Criteria

- [ ] Search matches highlighted in title and description
- [ ] Highlighting updates in real-time with search input
- [ ] Highlighting removed when search cleared
- [ ] No XSS vulnerability introduced
- [ ] Works with special characters in search terms

---

## Ticket 9: Improve empty state with actionable suggestions

**Type:** UX
**Priority:** Low
**Labels:** `enhancement`, `ux`

### Problem

When filters produce no results, the empty state message
("No se encontraron charlas que coincidan con tus filtros.") provides no
guidance on how to find content. Users are left without clear next steps.

### Current Behavior

- A single text message appears: "No talks found matching your filters."
- No suggestions or actions provided.
- Users must manually figure out which filter to change.

### Expected Behavior

- Empty state shows which filters are active.
- Provides actionable suggestions (e.g., "Try removing the year filter" or
  "Clear all filters").
- Includes a direct "Clear all filters" button within the empty state.
- Optionally shows the total number of available talks.

### Implementation Suggestions

- Enhance `renderTalks()` empty state to include active filter summary.
- Add a "Clear filters" button in the empty state.
- Show total talk count: "0 results from 41 talks."

### Files Affected

- `script.js` (`renderTalks` function)
- `style.css` (enhanced empty state styling)

### Acceptance Criteria

- [ ] Empty state shows active filter information
- [ ] Clear filters button included in empty state
- [ ] Message is translated (ES/EN)
- [ ] Total available talks count shown

---

## Ticket 10: Add sorting options for talks listing

**Type:** UX
**Priority:** Low
**Labels:** `enhancement`, `ux`

### Problem

Talks are always sorted by year descending (newest first). Users have no
ability to sort by other criteria such as name, event, or type. This limits
content discovery.

### Current Behavior

- Talks are always sorted by year (newest first) in `renderTalks()`.
- No UI for changing sort order.

### Expected Behavior

- A sort control (dropdown or toggle buttons) near the filter controls.
- Sort options: Year (newest first), Year (oldest first), Name (A-Z),
  Name (Z-A), Type.
- Selected sort persists during filter changes.

### Implementation Suggestions

- Add a `<select>` or button group for sort options.
- Move sorting logic out of `renderTalks()` into a dedicated function.
- Add translation keys for sort option labels.

### Files Affected

- `index.html` (sort control UI)
- `script.js` (sorting logic)
- `style.css` (sort control styling)

### Acceptance Criteria

- [ ] Sort control visible near filters
- [ ] At least 4 sort options available
- [ ] Sort persists across filter changes
- [ ] Sort labels translated (ES/EN)
- [ ] Default sort remains Year (newest first)

---

## Summary by Priority

| Priority | Tickets | Description |
| -------- | ------- | ----------- |
| High     | #1, #2, #5 | Accessibility skip link, clickable cards, remove debug logs |
| Medium   | #3, #4, #6 | Clear filters, URL state, i18n fix |
| Low      | #7, #8, #9, #10 | Loading skeleton, search highlighting, empty state, sorting |
