const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

// Даты в данных хранятся как "DDMMYYYY"
export function formatDate(raw) {
  if (!raw || raw.length !== 8) return null;
  const d = Number(raw.slice(0, 2));
  const m = Number(raw.slice(2, 4));
  const y = raw.slice(4);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

export function formatRuntime(min) {
  if (!min) return '—';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} мин`;
  return m ? `${h} ч ${m} мин` : `${h} ч`;
}

export function endTime(start, min) {
  const [h, m] = start.split(':').map(Number);
  const total = h * 60 + m + (min || 0);
  const eh = Math.floor(total / 60) % 24;
  const em = total % 60;
  return `${String(eh).padStart(2, '0')}:${String(em).padStart(2, '0')}`;
}

export function formatNumber(n) {
  return new Intl.NumberFormat('ru-RU').format(n);
}

export function formatMoney(amount, currency) {
  try {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      notation: amount >= 1_000_000 ? 'compact' : 'standard',
      maximumFractionDigits: amount >= 1_000_000 ? 1 : 0,
    }).format(amount);
  } catch {
    return `${formatNumber(amount)} ${currency}`;
  }
}

// Средняя оценка Кинопоиска и IMDb (обе по шкале 10), с округлением до десятой
export function avgRating(ratings) {
  const vals = [ratings?.kinopoisk?.value, ratings?.imdb?.value].filter((v) => v != null);
  if (!vals.length) return null;
  return Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 10) / 10;
}

export function formatRating(v) {
  return v == null ? '—' : v.toFixed(1).replace('.', ',');
}

export function filmKind(type) {
  if (!type) return 'feature';
  if (type.includes('анимац')) return 'animation';
  if (type.includes('документ')) return 'documentary';
  return 'feature';
}

export const KIND_LABEL = {
  feature: 'Игровое кино',
  animation: 'Анимация',
  documentary: 'Документальное',
};

export const RESULT_LABEL = { win: 'Победа', nomination: 'Номинация' };

export const FIELD_LABEL = {
  'details.countries': 'Страны производства',
  'details.runtime_minutes': 'Длительность',
  'details.aspect_ratio': 'Формат кадра',
  'details.age_ratings': 'Возрастной рейтинг',
  'details.languages': 'Языки',
  'identification.year': 'Год',
  'release': 'Даты выхода',
  'release.russian_premiere': 'Премьера в России',
  'release.russian_premiere.date': 'Дата премьеры в России',
  'release.russian_premiere.year': 'Год премьеры в России',
  'release.world_premiere': 'Мировая премьера',
  'finances': 'Финансы',
  'finances.worldwide_gross': 'Мировые сборы',
  'finances.budget': 'Бюджет',
  'creators.composers': 'Композитор',
  'creators.source_material': 'Литературная основа',
  'creators.cinematographers': 'Оператор',
  'creators.screenwriters': 'Сценаристы',
  'recognition.awards': 'Награды',
};

export function plural(n, one, few, many) {
  const n10 = n % 10;
  const n100 = n % 100;
  if (n10 === 1 && n100 !== 11) return one;
  if (n10 >= 2 && n10 <= 4 && (n100 < 12 || n100 > 14)) return few;
  return many;
}
