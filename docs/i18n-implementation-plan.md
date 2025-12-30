# Internationalization Implementation Plan

**Created**: 31/12/2024
**Status**: 📋 Ready to implement
**Approach**: Two-phase implementation

---

## Overview

Implement bilingual support (Spanish/English) for the talks website in two phases:
1. **Phase 1**: Quick fix with Spanish default (25 min)
2. **Phase 2**: Full language selector implementation (3-4 hours)

---

## Phase 1: Spanish Default (Quick Fix)

**Goal**: Get the site working immediately with Spanish translations
**Duration**: ~25 minutes
**Priority**: HIGH - Do this NOW

### Tasks

#### 1.1 Update `script.js` - Field References
- [ ] Create helper function `getTalkField(talk, fieldName, lang)`
- [ ] Default to Spanish (`_es` suffix)
- [ ] Fallback to English if Spanish not available
- [ ] Update all field references:
  - `talk.name` → `getTalkField(talk, 'name', 'es')`
  - `talk.description` → `getTalkField(talk, 'description', 'es')`
  - `talk.key_learning` → `getTalkField(talk, 'key_learning', 'es')`

#### 1.2 Update Search Functionality
- [ ] Update `applyFilters()` to use `_es` fields for search
- [ ] Ensure search works with Spanish content

#### 1.3 Update HTML Meta
- [ ] Change `<html lang="en">` to `<html lang="es">`
- [ ] Update page title and subtitle to Spanish

#### 1.4 Testing
- [ ] Verify all 41 talks display correctly
- [ ] Test search functionality
- [ ] Test filters (year, language, core)
- [ ] Check that talks without Spanish fallback to English

#### 1.5 Validation
- [ ] Run any existing validation tasks
- [ ] Check for JavaScript errors in console
- [ ] Verify JSON loads correctly

### Expected Outcome
- ✅ Site displays all content in Spanish
- ✅ All 41 talks show proper metadata
- ✅ Search and filters work correctly
- ✅ Clean, consistent user experience

---

## Phase 2: Language Selector (Full i18n)

**Goal**: Add professional bilingual support with user preference
**Duration**: ~3-4 hours
**Priority**: MEDIUM - Do when you have time

### Tasks

#### 2.1 UI Components (30 min)
- [ ] Add language toggle button to header
  - Position: Top right corner
  - Design: ES | EN toggle or flag icons
  - Accessible: ARIA labels, keyboard navigation
- [ ] Update CSS for toggle styling
  - Active state highlighting
  - Hover effects
  - Responsive design (mobile-friendly)

#### 2.2 State Management (45 min)
- [ ] Create language state management
  ```javascript
  let currentLanguage = 'es'; // default
  ```
- [ ] Implement `setLanguage(lang)` function
  - Update currentLanguage variable
  - Save to localStorage
  - Re-render talks
  - Update HTML lang attribute
- [ ] Load language preference on page load
  ```javascript
  currentLanguage = localStorage.getItem('preferredLanguage') || 'es';
  ```

#### 2.3 Update Helper Functions (30 min)
- [ ] Enhance `getTalkField()` to use `currentLanguage`
  ```javascript
  function getTalkField(talk, fieldName) {
    return talk[`${fieldName}_${currentLanguage}`] ||
           talk[`${fieldName}_en`] ||
           talk[fieldName] ||
           '';
  }
  ```
- [ ] Update all rendering functions to be language-aware

#### 2.4 Internationalize UI Labels (45 min)
- [ ] Create translations object for UI elements
  ```javascript
  const translations = {
    es: {
      title: 'Charlas',
      subtitle: 'Una colección de charlas y presentaciones de Eduardo Ferro',
      searchPlaceholder: 'Buscar charlas...',
      allYears: 'Todos los años',
      allLanguages: 'Todos los idiomas',
      coreOnly: 'Solo charlas core',
      talksCount: 'charlas',
      noResults: 'No se encontraron charlas',
      // ... more labels
    },
    en: {
      title: 'Talks',
      subtitle: 'A collection of talks and presentations by Eduardo Ferro',
      searchPlaceholder: 'Search talks...',
      allYears: 'All Years',
      allLanguages: 'All Languages',
      coreOnly: 'Core talks only',
      talksCount: 'talks',
      noResults: 'No talks found',
      // ... more labels
    }
  };
  ```
- [ ] Update HTML to use translation function
  ```javascript
  function t(key) {
    return translations[currentLanguage][key] || key;
  }
  ```
- [ ] Update all static text to use `t()` function

#### 2.5 Event Handlers (30 min)
- [ ] Add click handler for language toggle
  ```javascript
  toggleButton.addEventListener('click', () => {
    const newLang = currentLanguage === 'es' ? 'en' : 'es';
    setLanguage(newLang);
  });
  ```
- [ ] Update active state visual feedback
- [ ] Handle keyboard shortcuts (optional)
  - `Alt+L` or `Ctrl+Shift+L` to toggle language

#### 2.6 URL Parameters Support (Optional - 30 min)
- [ ] Support `?lang=es` or `?lang=en` in URL
- [ ] Parse on page load
- [ ] Update URL when language changes (history.pushState)
- [ ] Enable deep linking with language preference

#### 2.7 Testing (45 min)
- [ ] Test language toggle functionality
- [ ] Verify localStorage persistence
- [ ] Test all UI elements change language
- [ ] Test search in both languages
- [ ] Test filters in both languages
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile testing (responsive behavior)
- [ ] Accessibility testing (screen readers, keyboard navigation)

#### 2.8 Documentation (15 min)
- [ ] Update README with i18n information
- [ ] Document how to add new languages
- [ ] Document translation object structure

---

## Technical Implementation Details

### Phase 1: Helper Function

```javascript
/**
 * Get a field value from a talk in the specified language
 * @param {Object} talk - The talk object
 * @param {string} fieldName - The field name without language suffix
 * @param {string} lang - Language code ('es' or 'en')
 * @returns {string|Array} The field value
 */
function getTalkField(talk, fieldName, lang = 'es') {
  // Try requested language
  const langField = talk[`${fieldName}_${lang}`];
  if (langField) return langField;

  // Fallback to opposite language
  const fallbackLang = lang === 'es' ? 'en' : 'es';
  const fallbackField = talk[`${fieldName}_${fallbackLang}`];
  if (fallbackField) return fallbackField;

  // Fallback to field without suffix (legacy)
  return talk[fieldName] || '';
}
```

### Phase 2: Language Toggle HTML

```html
<div class="language-toggle" role="radiogroup" aria-label="Language selection">
  <button
    id="lang-es"
    class="lang-btn active"
    role="radio"
    aria-checked="true"
    data-lang="es">
    ES
  </button>
  <button
    id="lang-en"
    class="lang-btn"
    role="radio"
    aria-checked="false"
    data-lang="en">
    EN
  </button>
</div>
```

### Phase 2: Language Toggle CSS

```css
.language-toggle {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem;
}

.lang-btn {
  padding: 0.5rem 1rem;
  border: 2px solid var(--border-color);
  background: transparent;
  cursor: pointer;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.lang-btn:hover {
  background: var(--hover-bg);
}

.lang-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}
```

---

## Data Model Reference

### Current Talk Object Structure

```json
{
  "id": "2025-desapego-radical",
  "year": "2025",
  "core": true,
  "talk_language": "Spanish",
  "name_en": "Keynote: Radical Detachment in the AI Era",
  "name_es": "Keynote: Desapego radical en la era de la IA",
  "description_en": "Edu Ferro explores...",
  "description_es": "Edu Ferro explora...",
  "key_learning_en": "...",
  "key_learning_es": "...",
  "key_points_en": ["...", "..."],
  "key_points_es": ["...", "..."],
  "video": "https://...",
  "presentation": "https://...",
  "blog": "https://...",
  "place": "BarcelonaSoftwareCrafters",
  "coauthors": null
}
```

### Fields to Translate

| Field | Has `_en` | Has `_es` | Notes |
|-------|-----------|-----------|-------|
| `name` | ✅ | ✅ | All 41 talks |
| `description` | ✅ (20) | ✅ (20) | Only talks with content |
| `key_learning` | ✅ (20) | ✅ (20) | Only talks with content |
| `key_points` | ✅ (20) | ✅ (20) | Array, only talks with content |
| `place` | ❌ | ❌ | No translation (proper noun) |
| `year` | ❌ | ❌ | No translation (number) |
| `talk_language` | ❌ | ❌ | Metadata, not translated |

---

## Testing Checklist

### Phase 1 Testing
- [ ] All 41 talks display in Spanish
- [ ] Talks without `_es` fallback to `_en`
- [ ] Search finds talks by Spanish content
- [ ] Filters work correctly
- [ ] No JavaScript console errors
- [ ] No broken UI elements

### Phase 2 Testing
- [ ] Toggle switches language
- [ ] Preference persists after reload
- [ ] All UI labels change language
- [ ] Search works in both languages
- [ ] Filters work in both languages
- [ ] URL parameter support works (if implemented)
- [ ] Mobile responsive
- [ ] Accessibility compliant
- [ ] Cross-browser compatible

---

## Rollback Plan

If issues arise during implementation:

### Phase 1 Rollback
- Revert `script.js` to use `talk.name`, `talk.description`, etc.
- Change `<html lang="es">` back to `<html lang="en">`

### Phase 2 Rollback
- Remove language toggle button
- Remove language state management
- Keep `getTalkField()` with hardcoded 'es' default
- Remove translations object

---

## Success Metrics

### Phase 1
- ✅ 100% of talks display correct Spanish content
- ✅ 0 JavaScript errors
- ✅ Search functionality works
- ✅ Filters work correctly

### Phase 2
- ✅ Language toggle works smoothly
- ✅ Preference persists across sessions
- ✅ Both languages display correctly
- ✅ UI fully translated
- ✅ No performance degradation
- ✅ Passes accessibility audit

---

## Timeline

| Phase | Tasks | Duration | When |
|-------|-------|----------|------|
| Phase 1 | Spanish default | 25 min | NOW |
| Phase 2.1 | UI components | 30 min | Later |
| Phase 2.2 | State management | 45 min | Later |
| Phase 2.3 | Helper functions | 30 min | Later |
| Phase 2.4 | UI translations | 45 min | Later |
| Phase 2.5 | Event handlers | 30 min | Later |
| Phase 2.6 | URL parameters (optional) | 30 min | Optional |
| Phase 2.7 | Testing | 45 min | Later |
| Phase 2.8 | Documentation | 15 min | Later |
| **Total Phase 1** | | **25 min** | |
| **Total Phase 2** | | **3h 40min** | |

---

## Next Steps

1. **Review this plan** - Confirm approach
2. **Start Phase 1** - Implement Spanish default (~25 min)
3. **Test Phase 1** - Verify everything works
4. **Commit Phase 1** - Git commit with descriptive message
5. **Schedule Phase 2** - When you have 4 hours available
6. **Implement Phase 2** - Full bilingual support
7. **Test Phase 2** - Comprehensive testing
8. **Deploy** - Go live with bilingual support

---

## Questions to Answer Before Starting

- [ ] Do you want to start with Phase 1 now?
- [ ] Should we also translate UI labels in Phase 1? (adds ~15 min)
- [ ] Any specific design preferences for the language toggle in Phase 2?
- [ ] Do you want URL parameter support in Phase 2?
- [ ] Any other languages planned for the future?

---

**Ready to start implementation?** Let me know and I'll begin with Phase 1!
