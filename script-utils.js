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

export function createTalkId(talk) {
  return `${talk.year}-${talk.place}`.toLowerCase().replace(/\s+/g, '-');
}

export function t(key, translations, currentLanguage) {
  return translations[currentLanguage][key] || key;
}
