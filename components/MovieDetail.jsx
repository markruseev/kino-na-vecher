import Link from '../lib/link';
import { posterUrl, youtubeWatchUrl } from '../lib/paths';
import {
  formatDate, formatRuntime, formatRating, formatMoney,
  RESULT_LABEL, avgRating, plural,
} from '../lib/format';
import Toolbar from './Toolbar';
import MovieCard from './MovieCard';
import SaveButton, { RateBar } from './SaveButton';
import {
  IconBack, IconPlay, IconStar, IconArrow,
} from './Icons';
import HeroBackdrop from './HeroBackdrop';
import ScrollRow from './ScrollRow';
import ExpandableText from './ExpandableText';

const ROLES = [
  ['directors', 'Режиссёр'],
  ['screenwriters', 'Сценарий'],
  ['cinematographers', 'Оператор'],
  ['composers', 'Музыка'],
  ['editors', 'Монтаж'],
  ['producers', 'Продюсеры'],
  ['production_companies', 'Производство'],
];

export default function MovieDetail({ movie: m, similar = [] }) {
  const id = m.identification;
  const d = m.details;
  const c = m.content;
  const kp = m.ratings?.kinopoisk;
  const imdb = m.ratings?.imdb;
  const yt = m.media?.trailer_youtube_id;
  const trailerUrl = yt ? youtubeWatchUrl(yt) : m.links?.official_trailer?.url;
  const awards = m.recognition?.awards || [];
  const age = d.age_ratings?.[0]?.rating;
  const wins = awards.filter((a) => a.result === 'win').length;
  const rating = avgRating(m.ratings);
  const ratingTitle = [kp && `Кинопоиск ${formatRating(kp.value)}`, imdb && `IMDb ${formatRating(imdb.value)}`]
    .filter(Boolean).join(' · ');

  return (
    <article className="film">
      <section className="hero">
        <HeroBackdrop movie={m} />
        <div className="wrap hero__inner">
          <Toolbar>
            <Link href="/" className="round-btn" aria-label="Назад к каталогу">
              <IconBack />
            </Link>
          </Toolbar>

          <header className="film__hero">
            <div className="film__poster">
              <img
                src={posterUrl(m.id)}
                alt={`Постер фильма «${id.title_ru}»`}
                width={m.poster?.width || 800}
                height={m.poster?.height || 1200}
              />
            </div>

            <div className="film__head">
              <h1 className="film__title">{id.title_ru}</h1>
              {id.title_original !== id.title_ru && (
                <p className="film__original">{id.title_original}</p>
              )}

              <ul className="genres" aria-label="Жанры">
                {d.genres.map((g) => <li key={g}>{g}</li>)}
              </ul>

              <p className="film__meta">
                {[id.year, d.countries.join(', '), formatRuntime(d.runtime_minutes), age]
                  .filter(Boolean)
                  .map((x) => <span key={x}>{x}</span>)}
              </p>

              {rating != null && (
                <div className="rating" title={ratingTitle}>
                  <span className="rating__value">
                    <IconStar width={22} height={22} />
                    {formatRating(rating)}
                  </span>
                  <span className="rating__label">Средняя оценка<br />Кинопоиска и IMDb</span>
                </div>
              )}

              <p className="film__logline">{c.logline}</p>

              <div className="film__actions">
                {trailerUrl && (
                  <a className="btn btn--primary" href={trailerUrl} target="_blank" rel="noreferrer">
                    <IconPlay width={16} height={16} />
                    Трейлер
                  </a>
                )}
                <SaveButton id={m.id} primary={!trailerUrl} />
              </div>

              <RateBar id={m.id} />
            </div>
          </header>
        </div>
      </section>

      <div className="wrap">
        <section className="film__about">
          <h2 className="h2">О фильме</h2>
          <ExpandableText text={c.synopsis} lines={3} />
        </section>

        {m.cast.length > 0 && (
          <section className="cast" aria-label="В ролях">
            <ScrollRow
              title="В ролях"
              listClass="cast__row"
              footer={m.cast.some((p) => p.photo) && <p className="note">Фото — из Википедии.</p>}
            >
              {m.cast.map((p) => (
                <li key={p.name_original} className="actor">
                  <span className="actor__photo" aria-hidden="true">
                    {p.photo
                      ? <img src={p.photo} alt="" loading="lazy" referrerPolicy="no-referrer" />
                      : <span>{initials(p.name_ru)}</span>}
                  </span>
                  <span className="actor__name">{p.name_ru}</span>
                </li>
              ))}
            </ScrollRow>
          </section>
        )}

        {similar.length > 0 && (
          <section className="similar">
            <h2 className="h2">Похожие фильмы</h2>
            <ul className="grid grid--similar">
              {similar.map((s) => <li key={s.id}><MovieCard movie={s} /></li>)}
            </ul>
          </section>
        )}

        <section className="details">
          <h2 className="h2">Подробности</h2>
          <div className="tiles">
          <Section title="Съёмочная группа" teaser={`Режиссёр: ${(m.creators.directors || []).join(', ')}`}>
            <dl className="kv">
              {ROLES.map(([key, label]) => {
                const v = m.creators[key];
                return v && v.length ? <Row key={key} k={label}>{v.join(', ')}</Row> : null;
              })}
              {m.creators.source_material && (
                <Row k="Первоисточник">
                  {m.creators.source_material.title}, {m.creators.source_material.form},
                  {' '}{m.creators.source_material.author}, {m.creators.source_material.year}
                </Row>
              )}
            </dl>
            {m.creators.credit_notes && <p className="note">{m.creators.credit_notes}</p>}
          </Section>

          {m.context?.text && (
            <Section
              title="Контекст и факты"
              teaser={m.context.facts?.[0]?.text || `${m.context.facts?.length || 0} ${plural(m.context.facts?.length || 0, 'факт', 'факта', 'фактов')}`}
            >
              <p className="prose">{m.context.text}</p>
              {m.context.facts?.length > 0 && (
                <>
                  <h3 className="tile__sub">Интересные факты</h3>
                  <ul className="facts">
                    {m.context.facts.map((x) => <li key={x.text}>{x.text}</li>)}
                  </ul>
                </>
              )}
            </Section>
          )}

          {awards.length > 0 && (
            <Section title="Награды" teaser={wins ? `${wins} ${plural(wins, 'победа', 'победы', 'побед')}` : `${awards.length} ${plural(awards.length, 'номинация', 'номинации', 'номинаций')}`}>
              <ul className="awards">
                {awards.map((a) => (
                  <li key={`${a.event}-${a.category}`}>
                    <span className="awards__year">{a.year}</span>
                    <span className="awards__text">
                      <span>{a.event} · {a.category}</span>
                      <span className="muted">{a.recipient}</span>
                    </span>
                    <span className={`tag tag--${a.result}`}>{RESULT_LABEL[a.result] || a.result}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          <Section title="Премьеры и сборы" teaser={[m.release.world_premiere?.event, m.release.world_premiere?.year].filter(Boolean).join(', ')}>
            <dl className="kv">
              <ReleaseRow k="Мировая премьера" r={m.release.world_premiere} />
              <ReleaseRow k="Премьера в России" r={m.release.russian_premiere} />
              {(m.release.additional_releases || []).map((r) => (
                <ReleaseRow key={r.date + r.event} k={formatDate(r.date)} r={{ ...r, date: null }} />
              ))}
              <Row k="Бюджет">
                {m.finances.budget
                  ? `${m.finances.budget.estimated ? '≈ ' : ''}${formatMoney(m.finances.budget.amount, m.finances.budget.currency)}`
                  : 'Нет данных'}
              </Row>
              <Row k="Сборы в мире">
                {m.finances.worldwide_gross
                  ? formatMoney(m.finances.worldwide_gross.amount, m.finances.worldwide_gross.currency)
                  : 'Нет данных'}
              </Row>
            </dl>
            {[m.finances.budget?.coverage_note, m.finances.worldwide_gross?.coverage_note]
              .filter(Boolean)
              .map((n) => <p key={n} className="note">{n}</p>)}
          </Section>

          </div>
          <div className="ext-links">
            <span className="muted">Ещё больше о фильме</span>
            <a className="ext-link" href={id.kinopoisk_url} target="_blank" rel="noreferrer">Кинопоиск <IconArrow /></a>
            <a className="ext-link" href={id.imdb_url} target="_blank" rel="noreferrer">IMDb <IconArrow /></a>
          </div>
        </section>
      </div>
    </article>
  );
}

// Подробность-плитка: в закрытом виде заголовок и одна строка, открытая растягивается на всю ширину
function Section({ title, teaser, preview, children }) {
  return (
    <details className="tile">
      <summary>
        <span className="tile__text">
          <span className="tile__title">{title}</span>
          {preview}
          {teaser && <span className="tile__teaser">{teaser}</span>}
        </span>
        <span className="tile__icon" aria-hidden="true" />
      </summary>
      <div className="tile__body">{children}</div>
    </details>
  );
}

function initials(name) {
  const w = name.split(/\s+/).filter(Boolean);
  return ((w[0]?.[0] || '') + (w.length > 1 ? w[w.length - 1][0] : '')).toUpperCase();
}

function cap(t) {
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
}

function Row({ k, children }) {
  return (
    <div className="kv__row">
      <dt>{k}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function ReleaseRow({ k, r }) {
  if (!r) return null;
  const date = formatDate(r.date) || (r.year ? String(r.year) : null);
  return (
    <Row k={k}>
      {[date, r.event].filter(Boolean).join(' · ')}
    </Row>
  );
}
