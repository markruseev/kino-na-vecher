import data from '../data/movies.json';
import { filmKind, avgRating } from './format';

export const collectedOn = data.collected_on;

export const movies = data.movies.map((m) => ({
  ...m,
  id: String(m.identification.kinopoisk_id),
  kind: filmKind(m.identification.film_type),
}));

export function getMovie(id) {
  return movies.find((m) => m.id === String(id)) || null;
}

export function getNeighbours(id) {
  const i = movies.findIndex((m) => m.id === String(id));
  if (i < 0) return { prev: null, next: null };
  const pick = (m) => ({ id: m.id, title: m.identification.title_ru });
  return {
    prev: pick(movies[(i - 1 + movies.length) % movies.length]),
    next: pick(movies[(i + 1) % movies.length]),
  };
}

// Короткая карточка для каталога — всё, что нужно клиенту для фильтров
export function toCard(m) {
  return {
    id: m.id,
    title: m.identification.title_ru,
    original: m.identification.title_original,
    year: m.identification.year,
    kind: m.kind,
    genres: m.details.genres,
    countries: m.details.countries,
    runtime: m.details.runtime_minutes,
    rating: avgRating(m.ratings),
    logline: m.content.logline,
    directors: m.creators.directors || [],
    trailer: m.media?.trailer_youtube_id
      ? `https://www.youtube.com/watch?v=${m.media.trailer_youtube_id}`
      : m.links?.official_trailer?.url || null,
  };
}

// Похожие фильмы считаются только по полям из movies.json:
// общие жанры, тот же формат, общие страны и режиссёры.
export function getSimilar(id, limit = 4) {
  const base = getMovie(id);
  if (!base) return [];
  const overlap = (a = [], b = []) => a.filter((x) => b.includes(x)).length;
  return movies
    .filter((m) => m.id !== base.id)
    .map((m) => ({
      m,
      score:
        overlap(base.details.genres, m.details.genres) * 3
        + (base.kind === m.kind ? 2 : 0)
        + overlap(base.details.countries, m.details.countries)
        + overlap(base.creators.directors, m.creators.directors) * 5,
    }))
    .sort((a, b) => b.score - a.score
      || (avgRating(b.m.ratings) ?? 0) - (avgRating(a.m.ratings) ?? 0))
    .slice(0, limit)
    .map(({ m }) => toCard(m));
}
