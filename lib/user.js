'use client';
// Всё, что сервис знает о пользователе, хранится в localStorage этого браузера:
// сохранённые фильмы, оценки (-1 — разбитое сердце, 1 — сердце, 2 — три сердца), история просмотров
// и фильмы, про которые человек сказал «ещё не смотрел».
import { useSyncExternalStore } from 'react';

const KEY = 'kv-user';
const EMPTY = Object.freeze({ saved: [], reactions: {}, viewed: [], skipped: [] });
let cache = null;
const listeners = new Set();

function read() {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    cache = raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(patch) {
  cache = { ...read(), ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* хранилище недоступно — держим данные в памяти */
  }
  listeners.forEach((l) => l());
}

function subscribe(l) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function markViewed(id) {
  const cur = read();
  if (cur.viewed[0] === id) return;
  write({ viewed: [id, ...cur.viewed.filter((x) => x !== id)].slice(0, 30) });
}

export function useUser() {
  const u = useSyncExternalStore(subscribe, read, () => EMPTY);
  return {
    ...u,
    isSaved: (id) => u.saved.includes(id),
    reaction: (id) => u.reactions[id] || 0,
    toggleSave: (id) => {
      const cur = read().saved;
      write({ saved: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] });
    },
    // Повторное нажатие той же оценки снимает её
    react: (id, value) => {
      const next = { ...read().reactions };
      if (next[id] === value) delete next[id];
      else next[id] = value;
      write({ reactions: next });
    },
    skip: (id) => write({ skipped: [...new Set([...read().skipped, id])] }),
  };
}

// Персональная подборка: веса жанров и форматов по лайкам, сохранениям и просмотрам
export function recommend(movies, u, limit = 2) {
  const byId = Object.fromEntries(movies.map((m) => [m.id, m]));
  const weights = new Map();
  const add = (m, w) => {
    if (!m) return;
    m.genres.forEach((g) => weights.set(g, (weights.get(g) || 0) + w));
    weights.set(`kind:${m.kind}`, (weights.get(`kind:${m.kind}`) || 0) + w / 2);
  };
  Object.entries(u.reactions).forEach(([id, r]) => add(byId[id], r === 2 ? 5 : r > 0 ? 3 : -2));
  u.saved.forEach((id) => add(byId[id], 1.5));
  u.viewed.slice(0, 10).forEach((id) => add(byId[id], 0.5));

  const personal = weights.size > 0;
  const liked = Object.keys(u.reactions).filter((id) => u.reactions[id] > 0).map((id) => byId[id]).filter(Boolean);

  const picks = movies
    .filter((m) => !u.reactions[m.id] && !u.saved.includes(m.id))
    .map((m) => ({
      m,
      score: m.genres.reduce((s, g) => s + (weights.get(g) || 0), 0)
        + (weights.get(`kind:${m.kind}`) || 0)
        + (m.rating || 0) * 0.4,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ m }) => ({ movie: m, reason: reasonFor(m, liked, personal) }));

  return { personal, picks };
}

function reasonFor(m, liked, personal) {
  if (!personal) return 'Один из самых высоко оценённых фильмов подборки';
  const match = liked
    .map((l) => ({ l, n: l.genres.filter((g) => m.genres.includes(g)).length }))
    .sort((a, b) => b.n - a.n)[0];
  if (match && match.n > 0) return `Похож на «${match.l.title}», который вам понравился`;
  return null;
}
