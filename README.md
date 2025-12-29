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

1. Start a local web server:
```bash
python3 -m http.server 8000
```

2. Open your browser and navigate to:
```
http://localhost:8000
```

### Alternative: Using Node.js

```bash
npx http-server -p 8000
```

## Project Structure

```
/
├── index.html          # Main HTML file
├── style.css           # Stylesheet
├── script.js           # JavaScript logic
├── data/
│   └── talks.json      # Talks data (41 talks)
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
