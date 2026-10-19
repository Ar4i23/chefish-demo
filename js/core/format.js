export function formatPrice(tetri, lang = 'ru') {
  if (!Number.isInteger(tetri)) return lang === 'en' ? 'Price to be confirmed' : lang === 'ka' ? 'ფასი დასაზუსტებელია' : 'Цена уточняется';
  const amount = (tetri / 100).toFixed(2);
  return `${amount} ₾`;
}

export function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

export function localized(value, lang) {
  if (typeof value === 'string') return value;
  return value?.[lang] ?? value?.ru ?? '';
}
