let currentLanguage = localStorage.getItem('preferredLanguage') || 'es';

const translations = {
  es: {
    backToTalks: '← Volver a todas las charlas',
    description: 'Descripción',
    keyLearning: '🎯 Aprendizaje Clave',
    keyPoints: '📋 Puntos Clave',
    links: 'Enlaces',
    blog: 'Blog',
    video: 'Video',
    slides: 'Presentación',
    loadingError: 'Error al cargar los detalles de la charla.',
    notFound: 'Charla no encontrada.',
    metadata: 'Información'
  },
  en: {
    backToTalks: '← Back to all talks',
    description: 'Description',
    keyLearning: '🎯 Key Learning',
    keyPoints: '📋 Key Points',
    links: 'Links',
    blog: 'Blog',
    video: 'Video',
    slides: 'Slides',
    loadingError: 'Error loading talk details.',
    notFound: 'Talk not found.',
    metadata: 'Information'
  }
};

function t(key) {
  return translations[currentLanguage][key] || key;
}

function getTalkField(talk, fieldName, lang = currentLanguage) {
  const langField = talk[`${fieldName}_${lang}`];
  if (langField) return langField;

  const fallbackLang = lang === 'es' ? 'en' : 'es';
  const fallbackField = talk[`${fieldName}_${fallbackLang}`];
  if (fallbackField) return fallbackField;

  return talk[fieldName] || '';
}

function parseMarkdown(text) {
  if (!text) return '';
  marked.setOptions({
    breaks: true,
    gfm: true,
    sanitize: false,
    smartLists: true
  });
  return marked.parse(text);
}

function getTalkIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function createTalkId(talk) {
  return `${talk.year}-${talk.place}`.toLowerCase().replace(/\s+/g, '-');
}

async function loadTalkDetail() {
  const talkId = getTalkIdFromUrl();

  if (!talkId) {
    showError(t('notFound'));
    return;
  }

  try {
    const response = await fetch('data/talks.json');
    if (!response.ok) throw new Error('Failed to load talks');

    const talks = await response.json();
    const talk = talks.find(t => createTalkId(t) === talkId);

    if (!talk) {
      showError(t('notFound'));
      return;
    }

    renderTalkDetail(talk);
  } catch (error) {
    console.error('Error loading talk:', error);
    showError(t('loadingError'));
  }
}

function showError(message) {
  const container = document.querySelector('.talk-detail');
  container.innerHTML = `<div class="error-message">${message}</div>`;
}

function renderTalkDetail(talk) {
  const container = document.querySelector('.talk-detail');

  const name = getTalkField(talk, 'name');
  const description = getTalkField(talk, 'description');
  const keyLearning = getTalkField(talk, 'key_learning');
  const keyPoints = getTalkField(talk, 'key_points');

  const language = talk.talk_language || 'Unknown';
  const languageClass = language.toLowerCase();

  container.innerHTML = `
    <header class="detail-header">
      <div class="detail-title-container">
        <h1 class="detail-title">${escapeHtml(name)}</h1>
        <span class="language-badge ${languageClass}">
          ${language === 'Spanish' ? 'ES' : language === 'English' ? 'EN' : language}
        </span>
      </div>

      <div class="detail-meta">
        ${talk.year ? `<span class="meta-item"><strong>Year:</strong> ${talk.year}</span>` : ''}
        ${talk.place ? `<span class="meta-item"><strong>Event:</strong> ${escapeHtml(talk.place)}</span>` : ''}
        ${talk.coauthors ? `<span class="meta-item"><strong>Co-authors:</strong> ${escapeHtml(talk.coauthors)}</span>` : ''}
        ${talk.core ? `<span class="meta-badge core-badge">Core Talk</span>` : ''}
      </div>
    </header>

    ${
      description
        ? `
      <section class="detail-section">
        <h2>${t('description')}</h2>
        <div class="detail-content">
          <p>${escapeHtml(description)}</p>
        </div>
      </section>
    `
        : ''
    }

    ${
      keyLearning
        ? `
      <section class="detail-section key-learning-section">
        <h2>${t('keyLearning')}</h2>
        <div class="detail-content markdown-content">
          ${parseMarkdown(keyLearning)}
        </div>
      </section>
    `
        : ''
    }

    ${
      keyPoints
        ? `
      <section class="detail-section key-points-section">
        <h2>${t('keyPoints')}</h2>
        <div class="detail-content markdown-content">
          ${parseMarkdown(keyPoints)}
        </div>
      </section>
    `
        : ''
    }

    ${
      talk.blog || talk.video || talk.presentation
        ? `
      <section class="detail-section detail-links-section">
        <h2>${t('links')}</h2>
        <div class="detail-links">
          ${talk.blog ? `<a href="${talk.blog}" target="_blank" rel="noopener noreferrer" class="detail-link">📝 ${t('blog')}</a>` : ''}
          ${talk.video ? `<a href="${talk.video}" target="_blank" rel="noopener noreferrer" class="detail-link">🎥 ${t('video')}</a>` : ''}
          ${talk.presentation ? `<a href="${talk.presentation}" target="_blank" rel="noopener noreferrer" class="detail-link">📊 ${t('slides')}</a>` : ''}
        </div>
      </section>
    `
        : ''
    }
  `;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('preferredLanguage', lang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-checked', isActive);
  });

  document.documentElement.lang = lang;
  document.getElementById('page-title').textContent = t('description');
  document.getElementById('back-link').textContent = t('backToTalks');

  loadTalkDetail();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === currentLanguage;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-checked', isActive);

    btn.addEventListener('click', () => {
      setLanguage(btn.dataset.lang);
    });
  });

  loadTalkDetail();
  document.getElementById('current-year').textContent = new Date().getFullYear();
});
