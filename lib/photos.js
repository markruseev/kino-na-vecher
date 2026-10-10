// Фото актёров из Википедии. Запрашиваются на сервере при сборке страницы
// (на Vercel), поэтому браузер зрителя получает уже готовые ссылки.
// Если статьи нет, у неё нет фото или она явно про другого человека — остаются инициалы.

const OK_DESCRIPTION = /(actor|actress|voice|film|director|singer|musician|rapper|comedian|writer|author|journalist|skateboard|artist|photographer|bookseller|television|model|presenter)/i;

async function lookup(wiki) {
  const [lang, title] = wiki.split(':');
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  try {
    const res = await fetch(url, {
      headers: { 'Api-User-Agent': 'kino-na-vecher-prototype/0.1 (cast photos)' },
      next: { revalidate: 60 * 60 * 24 * 7 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const s = await res.json();
    if (s.type !== 'standard' || !s.thumbnail?.source) return null;
    if (s.description && !OK_DESCRIPTION.test(s.description)) return null;
    return { photo: s.thumbnail.source, photo_page: s.content_urls?.desktop?.page || null };
  } catch {
    return null;
  }
}

export async function withPhotos(cast) {
  return Promise.all(
    cast.map(async (p) => (p.wiki ? { ...p, ...(await lookup(p.wiki)) } : p)),
  );
}
