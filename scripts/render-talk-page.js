const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

function escapeHtml(text) {
  if (text === null || text === undefined || text === '') return '';
  return String(text).replace(/[&<>"']/g, ch => HTML_ESCAPES[ch]);
}

function escapeAttr(text) {
  return escapeHtml(text);
}

function pickPrimaryLang(talk) {
  return talk.talk_language === 'Spanish' ? 'es' : 'en';
}

function getField(talk, field, lang) {
  const primary = talk[`${field}_${lang}`];
  if (primary) return primary;
  const otherLang = lang === 'es' ? 'en' : 'es';
  const fallback = talk[`${field}_${otherLang}`];
  if (fallback) return fallback;
  return talk[field] || '';
}

function languageBadge(lang) {
  return lang === 'es' ? 'ES' : 'EN';
}

function renderLinks(talk) {
  const items = [];
  if (talk.blog) {
    items.push(
      `<a href="${escapeAttr(talk.blog)}" target="_blank" rel="noopener noreferrer" class="detail-link">📝 Blog</a>`
    );
  }
  if (talk.video) {
    items.push(
      `<a href="${escapeAttr(talk.video)}" target="_blank" rel="noopener noreferrer" class="detail-link">🎥 Video</a>`
    );
  }
  if (talk.presentation) {
    items.push(
      `<a href="${escapeAttr(talk.presentation)}" target="_blank" rel="noopener noreferrer" class="detail-link">📊 Slides</a>`
    );
  }
  if (items.length === 0) return '';
  return `<section class="detail-section detail-links-section">
        <h2>Links</h2>
        <div class="detail-links">${items.join('\n          ')}</div>
      </section>`;
}

function renderMeta(talk) {
  const parts = [];
  if (talk.year)
    parts.push(`<span class="meta-item"><strong>Year:</strong> ${escapeHtml(talk.year)}</span>`);
  if (talk.place)
    parts.push(`<span class="meta-item"><strong>Event:</strong> ${escapeHtml(talk.place)}</span>`);
  if (talk.coauthors)
    parts.push(
      `<span class="meta-item"><strong>Co-authors:</strong> ${escapeHtml(talk.coauthors)}</span>`
    );
  if (talk.core) parts.push('<span class="meta-badge core-badge">Core Talk</span>');
  return parts.join('\n        ');
}

function trimToMeta(text, max = 200) {
  const clean = String(text || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + '…';
}

export function renderTalkPageHtml(talk, opts = {}) {
  const siteUrl = (opts.siteUrl || '').replace(/\/$/, '');
  const lang = pickPrimaryLang(talk);
  const name = getField(talk, 'name', lang);
  const description = getField(talk, 'description', lang);
  const keyLearning = getField(talk, 'key_learning', lang);
  const keyPoints = getField(talk, 'key_points', lang);

  const canonical = `${siteUrl}/talks/${talk.slug}/`;
  const ogImage = `${siteUrl}/assets/images/logo-horizontal.png`;
  const metaDescription = trimToMeta(description || name);

  const language = talk.talk_language || 'Unknown';
  const languageClass = language.toLowerCase();

  return `<!doctype html>
<html lang="${lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="../../assets/images/favicon.png" />
    <title>${escapeHtml(name)}</title>
    <meta name="description" content="${escapeAttr(metaDescription)}">
    <link rel="canonical" href="${escapeAttr(canonical)}">
    <meta property="og:title" content="${escapeAttr(name)}">
    <meta property="og:description" content="${escapeAttr(metaDescription)}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="${escapeAttr(canonical)}">
    <meta property="og:image" content="${escapeAttr(ogImage)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttr(name)}">
    <meta name="twitter:description" content="${escapeAttr(metaDescription)}">
    <meta name="twitter:image" content="${escapeAttr(ogImage)}">
    <link rel="stylesheet" href="../../style.css" />
  </head>
  <body>
    <header>
      <div class="header-container">
        <div class="header-logo">
          <a href="../../index.html"><img src="../../assets/images/logo-horizontal.png" alt="Eduardo Ferro's Talks" class="logo-img" /></a>
        </div>
      </div>
    </header>

    <main class="detail-main">
      <div class="detail-container">
        <a href="../../index.html" class="back-link">← Back to all talks</a>

        <article class="talk-detail">
          <header class="detail-header">
            <div class="detail-title-container">
              <h1 class="detail-title">${escapeHtml(name)}</h1>
              <span class="language-badge ${escapeAttr(languageClass)}">${languageBadge(lang)}</span>
            </div>
            <div class="detail-meta">
        ${renderMeta(talk)}
            </div>
          </header>

          ${
            description
              ? `<section class="detail-section">
            <h2>Description</h2>
            <div class="detail-content"><p>${escapeHtml(description)}</p></div>
          </section>`
              : ''
          }

          ${
            keyLearning
              ? `<section class="detail-section key-learning-section">
            <h2>🎯 Key Learning</h2>
            <div class="detail-content markdown-content"><p>${escapeHtml(keyLearning)}</p></div>
          </section>`
              : ''
          }

          ${
            keyPoints
              ? `<section class="detail-section key-points-section">
            <h2>📋 Key Points</h2>
            <div class="detail-content markdown-content"><pre>${escapeHtml(keyPoints)}</pre></div>
          </section>`
              : ''
          }

          ${renderLinks(talk)}
        </article>
      </div>
    </main>

    <footer>
      <div>
        <p>© <span>${new Date().getFullYear()}</span> Eduardo Ferro (eferro). All rights reserved. <a href="https://www.eferro.net" target="_blank" rel="noopener noreferrer">Visit my website</a></p>
      </div>
    </footer>
  </body>
</html>
`;
}
