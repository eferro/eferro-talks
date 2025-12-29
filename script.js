let allTalks = [];
let filteredTalks = [];

async function loadTalks() {
  try {
    const response = await fetch('data/talks.json');
    if (!response.ok) {
      throw new Error('Failed to load talks data');
    }
    allTalks = await response.json();
    filteredTalks = [...allTalks];
    initializeFilters();
    renderTalks();
  } catch (error) {
    console.error('Error loading talks:', error);
    document.getElementById('talks-container').innerHTML = 
      '<div class="empty-state">Error loading talks. Please refresh the page.</div>';
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
    if (languageFilter && talk.language !== languageFilter) return false;
    if (coreFilter && !talk.core) return false;
    if (searchQuery) {
      const searchableText = [
        talk.name,
        talk.description,
        talk.place,
        talk.key_learning
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
    container.innerHTML = '<div class="empty-state">No talks found matching your filters.</div>';
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
  
  const language = talk.language || 'Unknown';
  const languageClass = language.toLowerCase();
  
  card.innerHTML = `
    <div class="talk-header">
      <h2 class="talk-title">${escapeHtml(talk.name)}</h2>
      <span class="language-badge ${languageClass}" aria-label="Language: ${language}">
        ${language === 'Spanish' ? 'ES' : language === 'English' ? 'EN' : language}
      </span>
    </div>
    
    <div class="talk-meta">
      ${talk.year ? `<span class="meta-item"><span class="meta-badge">${talk.year}</span></span>` : ''}
      ${talk.place ? `<span class="meta-item">📍 ${escapeHtml(talk.place)}</span>` : ''}
      ${talk.core ? `<span class="meta-item"><span class="meta-badge core-badge">Core</span></span>` : ''}
    </div>
    
    ${talk.description ? `<p class="talk-description">${escapeHtml(talk.description)}</p>` : ''}
    
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
  loadTalks();
  // Set current year in footer
  document.getElementById('current-year').textContent = new Date().getFullYear();
});

