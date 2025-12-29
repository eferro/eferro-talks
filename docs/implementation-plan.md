# Implementation Plan: Static Talks Site

## Objective

Create a minimalist static site to display all of Eduardo Ferro's talks, deployable on GitHub Pages, with a design similar to `eferro.github.io` and `eferro.net`.

## Current Status

- ✅ Talks data converted to JSON (`data/talks.json`)
- ✅ 41 talks with complete information:
  - Basic information: name, year, date, place, language
  - Links: blog, video, presentation
  - Content: description, key learning, key points
  - Metadata: coauthors, last modified, "core" flag

## Site Structure

```
/
├── index.html          # Main page with talks list
├── style.css           # Minimalist styles
├── script.js           # Filtering and rendering logic
├── data/
│   └── talks.json      # Talks data
└── docs/
    └── implementation-plan.md
```

## Design and Style

### Inspiration
- **eferro.github.io**: Minimalist design, simple project list
- **eferro.net**: Clean and professional blog style

### Design Features
- **Typography**: Clean sans-serif font (system fonts or similar)
- **Colors**: Minimalist scheme (white/black/grays) with possible dark mode
- **Language Display**: **CRITICAL** - Language indicator (Spanish/English) must be prominently visible on each talk card using clear visual distinction (badges, colors, or icons)
- **Layout**: 
  - Simple header with title
  - Talks list in card or list format
  - Minimalist footer
- **Responsive**: Mobile-first, adaptable to different screen sizes

## Features

### Phase 1: Basic View
- [ ] Display complete list of talks
- [ ] Sort by year (most recent first)
- [ ] Show basic information: name, year, place, language
- [ ] **CRITICAL: Prominently display language (Spanish/English) for each talk**
  - Language badge/indicator must be highly visible
  - Use clear visual distinction (colors, icons, or badges)
  - Language should be visible at a glance without reading the full card
- [ ] Links to blog, video, and presentation when available
- [ ] Visual indicator for "core" talks

### Phase 2: Filters and Search
- [ ] Filter by year
- [ ] Filter by language (Spanish/English)
- [ ] Filter by place/event
- [ ] Text search (name, description)
- [ ] Button to show only "core" talks

### Phase 3: Details and Improvements
- [ ] Detailed view for each talk (modal or separate page)
- [ ] Show complete description
- [ ] Show formatted key learning and key points
- [ ] Show coauthors when available
- [ ] Social sharing links

### Phase 4: Optimizations
- [ ] Lazy loading of images if added
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] Basic SEO (meta tags, Open Graph)
- [ ] Dark/light mode toggle

## Technical Implementation

### Technologies
- **HTML5**: Semantic structure
- **CSS3**: Modern styles, CSS variables for themes
- **Vanilla JavaScript**: No external dependencies
- **JSON**: Static data

### Code Structure

#### HTML (`index.html`)
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Eduardo Ferro - Talks</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Talks</h1>
    <!-- Filters here -->
  </header>
  <main>
    <div id="talks-container">
      <!-- Talks rendered here -->
    </div>
  </main>
  <footer>
    <!-- Minimalist footer -->
  </footer>
  <script src="script.js"></script>
</body>
</html>
```

#### CSS (`style.css`)
- CSS variables for colors and spacing
- Grid/Flexbox for responsive layout
- Styles for talk cards
- Filter styles
- Media queries for responsive design

#### JavaScript (`script.js`)
- Load data from `data/talks.json`
- Talk rendering function
- Filtering functions
- Search functions
- Event handling

## Implementation Steps

### Step 1: Basic HTML Structure
1. Create `index.html` with semantic structure
2. Header with title
3. Container for talks
4. Basic footer

### Step 2: Base CSS Styles
1. Basic CSS reset
2. CSS variables for colors and typography
3. Layout styles (header, main, footer)
4. Basic typography styles

### Step 3: Data Loading and Rendering
1. Function to load `talks.json`
2. Function to render a talk
3. Function to render all talks
4. Sorting by year (descending)

### Step 4: Talk Card Styles
1. Minimalist card design
2. **Prominent language indicator**:
   - Large, visible language badge (Spanish/English)
   - Use distinct colors or icons for each language
   - Position language badge prominently (top-right corner or header area)
   - Ensure language is readable and stands out from other elements
3. Styles for links (blog, video, presentation)
4. Visual indicator for "core" talks
5. Badges for year and place

### Step 5: Basic Filters
1. UI for filters (year, language)
2. Filtering logic
3. View update on filter
4. Results counter

### Step 6: Search
1. Search field
2. Text search logic
3. Highlight found terms (optional)

### Step 7: Detailed View
1. Modal or detail page
2. Show complete information
3. Format key points (bulleted list)
4. Close/back button

### Step 8: Responsive Design
1. Media queries for mobile
2. Layout adjustments for tablets
3. Typography optimization for different sizes

### Step 9: Final Optimizations
1. Accessibility (ARIA labels, roles)
2. SEO (meta tags, Open Graph)
3. Performance (optional minification)
4. HTML/CSS validation

### Step 10: GitHub Pages Configuration
1. Create `.nojekyll` if necessary
2. Configure `gh-pages` or `main` branch for deploy
3. Verify all assets are served correctly

## Technical Considerations

### Data Loading
- Use `fetch()` to load `talks.json`
- Handle loading errors
- Show loading state while fetching data

### Performance
- Efficient rendering (use DocumentFragment)
- Debounce search if implemented in real-time
- Lazy loading if images are added in the future

### Compatibility
- Compatible with modern browsers (last 2 versions)
- Fallback for older browsers if necessary
- Progressive enhancement

### Accessibility
- Semantic HTML
- ARIA labels where necessary
- Keyboard navigation
- Adequate color contrast
- Alternative texts for icons

## JSON Data Structure

Each talk has the following structure:
```json
{
  "name": "Talk title",
  "year": "2025",
  "date": "date or null",
  "blog": "URL or null",
  "language": "Spanish/English",
  "video": "URL or null",
  "presentation": "URL or null",
  "place": "Event name",
  "coauthors": "Names or null",
  "last_modified": "Date",
  "core": true/false,
  "description": "Complete description",
  "key_learning": "Key learning",
  "key_points": "Formatted key points"
}
```

## Next Steps

1. ✅ Create implementation plan
2. ⏳ Create basic HTML structure
3. ⏳ Implement base CSS styles
4. ⏳ Implement data loading and rendering
5. ⏳ Add filters and search
6. ⏳ Implement detailed view
7. ⏳ Optimize and polish
8. ⏳ Configure GitHub Pages

## Language Display Requirements

**CRITICAL**: The language of each talk (Spanish/English) must be clearly and prominently displayed. This is a key requirement for the site.

### Visual Requirements for Language Indicator:
- **Visibility**: Language badge must be immediately visible without reading the entire card
- **Position**: Place language indicator in a prominent location (e.g., top-right corner, header area, or as a colored border)
- **Design Options**:
  - Colored badges with text "ES" / "EN" or "Spanish" / "English"
  - Flag icons (optional, but ensure they're clear)
  - Colored borders or background accents
  - Combination of text and color coding
- **Accessibility**: Ensure language indicator is accessible via screen readers
- **Consistency**: Use the same language indicator style throughout the site

### Implementation Suggestions:
- Use CSS classes like `.language-spanish` and `.language-english` for styling
- Consider using distinct colors (e.g., blue for English, red/orange for Spanish)
- Make language badge large enough to be noticed but not overwhelming
- Test visibility on different screen sizes and backgrounds

## Notes

- Keep the design minimalist and clean
- **Language visibility is a top priority** - ensure it's clear and prominent
- Prioritize simplicity over complex features
- Ensure the site is fast and lightweight
- Follow accessible design principles
