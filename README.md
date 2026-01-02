# eferro-talks

A minimalist static site showcasing Eduardo Ferro's talks and presentations.

## Features

- **41 talks** with complete information
- **Prominent language indicators** - Clear visual distinction between Spanish (ES) and English (EN) talks
- **Filtering** by year, language, and core talks
- **Search functionality** across talk titles, descriptions, and content
- **Responsive design** - Works on desktop, tablet, and mobile
- **Minimalist design** inspired by eferro.github.io and eferro.net

## Local Development

### Quick Start

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm start
```

3. Open your browser and navigate to:

```
http://localhost:8000
```

## Testing

Run tests:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

Watch mode for TDD:

```bash
npm run test:watch
```

## Project Structure

```
/
├── index.html          # Main HTML file
├── style.css           # Stylesheet
├── script.js           # JavaScript logic
├── script-utils.js     # Testable utility functions
├── talk-detail.js      # Talk detail page logic
├── data/
│   └── talks.json      # Talks data (41 talks)
├── tests/
│   └── frontend/
│       └── script.test.js  # Unit tests
└── docs/
    └── implementation-plan.md
```

## Language Distribution

- **Spanish**: 38 talks
- **English**: 3 talks

## Deployment

The site is designed to be deployed on GitHub Pages. Simply push the files to your repository and enable GitHub Pages in the repository settings.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Last 2 versions of each browser
- Progressive enhancement for older browsers
