let allTalks = [];
let filteredTalks = [];
let currentLanguage = localStorage.getItem('preferredLanguage') || 'es';

const translations = {
  es: {
    title: 'Charlas',
    subtitle: 'Una colección de charlas y presentaciones de Eduardo Ferro',
    searchPlaceholder: 'Buscar charlas...',
    searchLabel: 'Buscar charlas',
    allYears: 'Todos los años',
    filterByYear: 'Filtrar por año',
    allLanguages: 'Todos los idiomas',
    filterByLanguage: 'Filtrar por idioma',
    spanish: 'Español',
    english: 'Inglés',
    coreOnly: 'Solo charlas core',
    talksCount: 'charlas',
    loading: 'Cargando charlas...',
    noResults: 'No se encontraron charlas que coincidan con tus filtros.',
    errorLoading: 'Error al cargar las charlas. Por favor, recarga la página.'
  },
  en: {
    title: 'Talks',
    subtitle: 'A collection of talks and presentations by Eduardo Ferro',
    searchPlaceholder: 'Search talks...',
    searchLabel: 'Search talks',
    allYears: 'All Years',
    filterByYear: 'Filter by year',
    allLanguages: 'All Languages',
    filterByLanguage: 'Filter by language',
    spanish: 'Spanish',
    english: 'English',
    coreOnly: 'Core talks only',
    talksCount: 'talks',
    loading: 'Loading talks...',
    noResults: 'No talks found matching your filters.',
    errorLoading: 'Error loading talks. Please refresh the page.'
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

function updateUILanguage() {
  document.documentElement.lang = currentLanguage;
  document.getElementById('page-title').textContent = t('title');
  document.getElementById('page-subtitle').textContent = t('subtitle');
  document.getElementById('search-input').placeholder = t('searchPlaceholder');
  document.getElementById('search-input').setAttribute('aria-label', t('searchLabel'));
  document.getElementById('year-filter').setAttribute('aria-label', t('filterByYear'));
  document.getElementById('year-filter').options[0].textContent = t('allYears');
  document.getElementById('language-filter').setAttribute('aria-label', t('filterByLanguage'));
  document.getElementById('language-filter').options[0].textContent = t('allLanguages');
  document.getElementById('language-filter').options[1].textContent = t('spanish');
  document.getElementById('language-filter').options[2].textContent = t('english');
  document.querySelector('.checkbox-label span').textContent = t('coreOnly');

  const resultsCountText = document.querySelector('.results-count');
  const count = document.getElementById('results-count').textContent;
  resultsCountText.innerHTML = `<span id="results-count">${count}</span> ${t('talksCount')}`;
}

function setLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('preferredLanguage', lang);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === lang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-checked', isActive);
  });

  updateUILanguage();
  renderTalks();
}

async function loadTalks() {
  try {
    const response = await fetch('data/talks.json');
    if (!response.ok) {
      throw new Error('Failed to load talks data');
    }
    allTalks = await response.json();
    console.log('DEBUG loadTalks: Total talks loaded:', allTalks.length);
    console.log('DEBUG loadTalks: First talk:', allTalks[0]);
    console.log('DEBUG loadTalks: First talk keys:', Object.keys(allTalks[0]));
    console.log('DEBUG loadTalks: talk_language values:', allTalks.slice(0, 5).map(t => t.talk_language));
    filteredTalks = [...allTalks];
    initializeFilters();
    renderTalks();
  } catch (error) {
    console.error('Error loading talks:', error);
    document.getElementById('talks-container').innerHTML =
      `<div class="empty-state">${t('errorLoading')}</div>`;
  }
}

function initializeFilters() {
  const yearFilter = document.getElementById('year-filter');
  const years = [...new Set(allTalks.map(talk => talk.year).filter(Boolean))].sort((a, b) => b - a);
  
  years.forEach(year => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearFilter.appendChild(option);
  });
  
  yearFilter.addEventListener('change', applyFilters);
  document.getElementById('language-filter').addEventListener('change', applyFilters);
  document.getElementById('core-filter').addEventListener('change', applyFilters);
  document.getElementById('search-input').addEventListener('input', applyFilters);
}

function applyFilters() {
  const yearFilter = document.getElementById('year-filter').value;
  const languageFilter = document.getElementById('language-filter').value;
  const coreFilter = document.getElementById('core-filter').checked;
  const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
  
  filteredTalks = allTalks.filter(talk => {
    if (yearFilter && talk.year !== yearFilter) return false;
    if (languageFilter && talk.talk_language !== languageFilter) return false;
    if (coreFilter && !talk.core) return false;
    if (searchQuery) {
      const searchableText = [
        getTalkField(talk, 'name'),
        getTalkField(talk, 'description'),
        talk.place,
        getTalkField(talk, 'key_learning')
      ].filter(Boolean).join(' ').toLowerCase();
      if (!searchableText.includes(searchQuery)) return false;
    }
    return true;
  });
  
  renderTalks();
}

function renderTalks() {
  const container = document.getElementById('talks-container');
  const resultsCount = document.getElementById('results-count');
  
  if (filteredTalks.length === 0) {
    container.innerHTML = `<div class="empty-state">${t('noResults')}</div>`;
    resultsCount.textContent = '0';
    return;
  }
  
  resultsCount.textContent = filteredTalks.length;
  
  const sortedTalks = [...filteredTalks].sort((a, b) => {
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;
    return yearB - yearA;
  });
  
  const fragment = document.createDocumentFragment();
  
  sortedTalks.forEach(talk => {
    const card = createTalkCard(talk);
    fragment.appendChild(card);
  });
  
  container.innerHTML = '';
  container.appendChild(fragment);
}

function createTalkCard(talk) {
  const card = document.createElement('article');
  card.className = `talk-card${talk.core ? ' core' : ''}`;

  const language = talk.talk_language || 'Unknown';
  console.log('DEBUG createTalkCard:', {
    name: talk.name_es ? talk.name_es.substring(0, 30) : 'N/A',
    talk_language: talk.talk_language,
    language: language,
    allKeys: Object.keys(talk)
  });
  const languageClass = language.toLowerCase();
  
  card.innerHTML = `
    <div class="talk-header">
      <h2 class="talk-title">${escapeHtml(getTalkField(talk, 'name'))}</h2>
      <span class="language-badge ${languageClass}" aria-label="Language: ${language}">
        ${language === 'Spanish' ? 'ES' : language === 'English' ? 'EN' : language}
      </span>
    </div>
    
    <div class="talk-meta">
      ${talk.year ? `<span class="meta-item"><span class="meta-badge">${talk.year}</span></span>` : ''}
      ${talk.place ? `<span class="meta-item">📍 ${escapeHtml(talk.place)}</span>` : ''}
      ${talk.core ? `<span class="meta-item"><span class="meta-badge core-badge">Core</span></span>` : ''}
    </div>
    
    ${getTalkField(talk, 'description') ? `<p class="talk-description">${escapeHtml(getTalkField(talk, 'description'))}</p>` : ''}
    
    <div class="talk-links">
      ${talk.blog ? `<a href="${talk.blog}" target="_blank" rel="noopener noreferrer" class="talk-link">📝 Blog</a>` : ''}
      ${talk.video ? `<a href="${talk.video}" target="_blank" rel="noopener noreferrer" class="talk-link">🎥 Video</a>` : ''}
      ${talk.presentation ? `<a href="${talk.presentation}" target="_blank" rel="noopener noreferrer" class="talk-link">📊 Slides</a>` : ''}
    </div>
  `;
  
  return card;
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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

  updateUILanguage();
  loadTalks();

  document.getElementById('current-year').textContent = new Date().getFullYear();
});

