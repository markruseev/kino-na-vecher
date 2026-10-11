'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from '../lib/link';
import { warmUpYouTube } from '../lib/youtube';
import { EMBEDS_ALLOWED } from '../lib/paths';
import { useUser } from '../lib/user';
import { KIND_LABEL, plural } from '../lib/format';
import Toolbar from './Toolbar';
import ForYou from './ForYou';
import MovieCard from './MovieCard';
import {
  IconFilter, IconSearch, IconClose, IconShuffle,
} from './Icons';

const DURATIONS = [
  { id: 'any', label: 'Любая' },
  { id: 'short', label: 'До 1 ч 40 мин', test: (r) => r <= 100 },
  { id: 'mid', label: '1 ч 40 – 2 ч 10', test: (r) => r > 100 && r <= 130 },
  { id: 'long', label: 'Дольше 2 ч 10', test: (r) => r > 130 },
];

const SORTS = [
  { id: 'rating', label: 'Рейтинг', fn: (a, b) => (b.rating ?? 0) - (a.rating ?? 0) },
  { id: 'new', label: 'Новые', fn: (a, b) => b.year - a.year },
  { id: 'short', label: 'Короткие', fn: (a, b) => a.runtime - b.runtime },
];

const DEFAULTS = { genre: 'all', kind: 'all', duration: 'any', sort: 'rating' };

export default function Catalog({ movies, mode = 'all' }) {
  const navigate = useNavigate();
  const { saved: savedIds } = useUser();
  const savedMode = mode === 'saved';
  const [query, setQuery] = useState('');
  const [f, setF] = useState(DEFAULTS);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);

  const set = (patch) => setF((cur) => ({ ...cur, ...patch }));

  // Пока человек выбирает фильм, заранее готовим плеер трейлеров
  useEffect(() => { if (EMBEDS_ALLOWED) warmUpYouTube(); }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); } };
    const onDown = (e) => {
      if (!panelRef.current?.contains(e.target) && !btnRef.current?.contains(e.target)) setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [open]);

  const genres = useMemo(() => {
    const count = new Map();
    movies.forEach((m) => m.genres.forEach((g) => count.set(g, (count.get(g) || 0) + 1)));
    return [...count.entries()].sort((a, b) => b[1] - a[1]).map(([g]) => g);
  }, [movies]);

  const kinds = useMemo(() => [...new Set(movies.map((m) => m.kind))], [movies]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const dur = DURATIONS.find((d) => d.id === f.duration);
    const sorter = SORTS.find((s) => s.id === f.sort).fn;
    return movies
      .filter((m) => f.genre === 'all' || m.genres.includes(f.genre))
      .filter((m) => f.kind === 'all' || m.kind === f.kind)
      .filter((m) => !dur.test || dur.test(m.runtime))
      .filter((m) => !savedMode || savedIds.includes(m.id))
      .filter((m) => !q || [m.title, m.original, ...m.directors, m.logline]
        .join(' ').toLowerCase().includes(q))
      .sort(sorter);
  }, [movies, query, f, savedIds, savedMode]);

  // Активные фильтры показываем маленькими чипами под строкой поиска
  const active = [
    f.genre !== 'all' && { key: 'genre', label: cap(f.genre) },
    f.kind !== 'all' && { key: 'kind', label: KIND_LABEL[f.kind] },
    f.duration !== 'any' && { key: 'duration', label: DURATIONS.find((d) => d.id === f.duration).label },
  ].filter(Boolean);

  function pickRandom() {
    const pool = list.length ? list : movies;
    navigate(`/movie/${pool[Math.floor(Math.random() * pool.length)].id}`);
  }

  return (
    <div className="page wrap">
      <Toolbar savedActive={savedMode}>
          <button
            ref={btnRef}
            type="button"
            className={`round-btn${open ? ' round-btn--on' : ''}`}
            aria-label="Фильтры"
            aria-expanded={open}
            aria-controls="filters"
            onClick={() => setOpen((v) => !v)}
          >
            <IconFilter />
            {active.length > 0 && <span className="round-btn__badge">{active.length}</span>}
          </button>
          <label className="search" htmlFor="search">
            <IconSearch />
            <input
              id="search"
              type="search"
              placeholder="Фильм, режиссёр, сюжет"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
          </label>

          {open && (
            <>
              <div className="sheet-backdrop" aria-hidden="true" />
              <div className="panel" id="filters" ref={panelRef} role="dialog" aria-label="Фильтры">
                <div className="panel__head">
                  <span className="panel__title">Фильтры</span>
                  <button type="button" className="icon-btn" aria-label="Закрыть" onClick={() => setOpen(false)}>
                    <IconClose />
                  </button>
                </div>

                <Group label="Сортировка">
                  {SORTS.map((s) => (
                    <Chip key={s.id} on={f.sort === s.id} onClick={() => set({ sort: s.id })}>{s.label}</Chip>
                  ))}
                </Group>
                <Group label="Жанр">
                  <Chip on={f.genre === 'all'} onClick={() => set({ genre: 'all' })}>Все</Chip>
                  {genres.map((g) => (
                    <Chip key={g} on={f.genre === g} onClick={() => set({ genre: g })}>{cap(g)}</Chip>
                  ))}
                </Group>
                <Group label="Формат">
                  <Chip on={f.kind === 'all'} onClick={() => set({ kind: 'all' })}>Любой</Chip>
                  {kinds.map((k) => (
                    <Chip key={k} on={f.kind === k} onClick={() => set({ kind: k })}>{KIND_LABEL[k]}</Chip>
                  ))}
                </Group>
                <Group label="Длительность">
                  {DURATIONS.map((d) => (
                    <Chip key={d.id} on={f.duration === d.id} onClick={() => set({ duration: d.id })}>{d.label}</Chip>
                  ))}
                </Group>
                <Group label="Не знаете, что выбрать">
                  <Chip on={false} onClick={pickRandom}>
                    <IconShuffle width={16} height={16} />
                    Случайный фильм
                  </Chip>
                </Group>

                <div className="panel__foot">
                  <button type="button" className="btn btn--ghost" onClick={() => setF(DEFAULTS)}>Сбросить</button>
                  <button type="button" className="btn btn--primary" onClick={() => setOpen(false)}>
                    {list.length
                      ? `Показать ${list.length} ${plural(list.length, 'фильм', 'фильма', 'фильмов')}`
                      : 'Нет фильмов'}
                  </button>
                </div>
              </div>
            </>
          )}
      </Toolbar>

      {active.length > 0 && (
        <div className="active">
          {active.map((a) => (
            <button
              key={a.key}
              type="button"
              className="active__chip"
              onClick={() => set({ [a.key]: DEFAULTS[a.key] })}
              aria-label={`Убрать фильтр ${a.label}`}
            >
              {a.label}
              <IconClose width={14} height={14} />
            </button>
          ))}
        </div>
      )}

      {savedMode && (
        <div className="section-head">
          <h1 className="h1">Сохранённые</h1>
          <p className="muted">
            {savedIds.length
              ? `${savedIds.length} ${plural(savedIds.length, 'фильм', 'фильма', 'фильмов')} на потом`
              : 'Здесь появятся фильмы, которые вы сохраните'}
          </p>
        </div>
      )}

      {!savedMode && !query && !active.length && <ForYou movies={movies} />}

      {!savedMode && !query && !active.length && list.length > 0 && (
        <h2 className="h2 section-title">Все фильмы</h2>
      )}

      {list.length ? (
        <ul className="grid">
          {list.map((m) => (
            <li key={m.id}><MovieCard movie={m} /></li>
          ))}
        </ul>
      ) : (
        <div className="empty">
          <p className="empty__title">
            {savedMode && !savedIds.length ? 'Пока ничего не сохранено' : 'Ничего не нашлось'}
          </p>
          <p className="muted">
            {savedMode && !savedIds.length
              ? 'Откройте фильм и нажмите «Сохранить», он появится здесь.'
              : 'Попробуйте другой запрос или уберите часть фильтров.'}
          </p>
          {savedMode ? (
            <button type="button" className="btn btn--ghost" onClick={() => navigate('/')}>Ко всем фильмам</button>
          ) : (
            <button type="button" className="btn btn--ghost" onClick={() => { setF(DEFAULTS); setQuery(''); }}>
              Показать все фильмы
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Group({ label, children }) {
  return (
    <div className="group" role="group" aria-label={label}>
      <span className="group__label">{label}</span>
      <div className="group__chips">{children}</div>
    </div>
  );
}

function Chip({ on, onClick, children }) {
  return (
    <button type="button" className={`chip${on ? ' chip--on' : ''}`} aria-pressed={on} onClick={onClick}>
      {children}
    </button>
  );
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
