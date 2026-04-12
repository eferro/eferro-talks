export function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function getTalkField(talk, fieldName, lang) {
  const langField = talk[`${fieldName}_${lang}`];
  if (langField) return langField;

  const fallbackLang = lang === 'es' ? 'en' : 'es';
  const fallbackField = talk[`${fieldName}_${fallbackLang}`];
  if (fallbackField) return fallbackField;

  return talk[fieldName] || '';
}

export function t(key, translations, currentLanguage) {
  return translations[currentLanguage][key] || key;
}

const INTERFACE_TO_CONTENT_LANGUAGE = {
  es: 'Spanish',
  en: 'English'
};

export function interfaceLanguageToContentFilter(interfaceLang) {
  return INTERFACE_TO_CONTENT_LANGUAGE[interfaceLang] || '';
}

export function filterTalks(talks, { year, language, type, core, search, lang }) {
  return talks.filter(talk => {
    if (year && talk.year !== year) return false;
    if (language && talk.talk_language !== language) return false;
    if (type && talk.type !== type) return false;
    if (core && !talk.core) return false;
    if (search) {
      const searchableText = [
        getTalkField(talk, 'name', lang),
        getTalkField(talk, 'description', lang),
        talk.place,
        getTalkField(talk, 'key_learning', lang)
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!searchableText.includes(search)) return false;
    }
    return true;
  });
}

export function countByType(talks) {
  return talks.reduce((acc, talk) => {
    const type = talk.type || 'unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
}

export function sortByYearDescending(talks) {
  return [...talks].sort((a, b) => {
    const yearA = parseInt(a.year) || 0;
    const yearB = parseInt(b.year) || 0;
    return yearB - yearA;
  });
}

export function updateMetaTag(name, content) {
  let meta = document.querySelector(`meta[name="${name}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', name);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}

export function updateOgTag(property, content) {
  let meta = document.querySelector(`meta[property="${property}"]`);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('property', property);
    document.head.appendChild(meta);
  }
  meta.setAttribute('content', content);
}
