'use client';
import Link from '../lib/link';
import { posterUrl } from '../lib/paths';
import { useUser, recommend } from '../lib/user';
import { formatRuntime, formatRating } from '../lib/format';
import { IconStar } from './Icons';
import { Reactions } from './SaveButton';

export default function ForYou({ movies }) {
  const u = useUser();

  // Последний открытый фильм без оценки — спрашиваем, смотрел ли человек его
  const ask = u.viewed
    .map((id) => movies.find((m) => m.id === id))
    .find((m) => m && !u.reactions[m.id] && !u.skipped.includes(m.id));

  const pool = ask ? movies.filter((m) => m.id !== ask.id) : movies;
  const { personal, picks } = recommend(pool, u, 2);

  if (!picks.length && !ask) return null;

  return (
    <section className="foryou" aria-label="Для вас">
      <div className="foryou__head">
        <h2 className="h2">Для вас</h2>
        <p className="muted">
          {personal
            ? 'Подобрано по вашим оценкам, сохранениям и просмотрам'
            : 'Пока вы ничего не оценили, показываем лучшее. Оценивайте фильмы, и подборка подстроится'}
        </p>
      </div>

      {ask && (
        <div className="ask">
          <img className="ask__poster" src={posterUrl(ask.id)} alt="" width={800} height={1200} />
          <p className="ask__text">
            Вы открывали «{ask.title}». <span className="muted">Уже посмотрели?</span>
          </p>
          <div className="ask__actions">
            <Reactions id={ask.id} size="sm" />
            <button type="button" className="ask__skip" onClick={() => u.skip(ask.id)}>Ещё не смотрел</button>
          </div>
        </div>
      )}

      <ul className="foryou__list">
        {picks.map(({ movie: m, reason }) => (
          <li key={m.id} className="pick">
            <Link href={`/movie/${m.id}`} className="pick__poster" tabIndex={-1} aria-hidden="true">
              <img src={posterUrl(m.id)} alt="" width={800} height={1200} />
            </Link>
            <div className="pick__body">
              {reason && <p className="pick__reason">{reason}</p>}
              <h3 className="pick__title">
                <Link href={`/movie/${m.id}`}>{m.title}</Link>
              </h3>
              <p className="card__meta">
                <span>{m.year}</span>
                {m.rating != null && (
                  <span className="card__rating"><IconStar /> {formatRating(m.rating)}</span>
                )}
                <span>{formatRuntime(m.runtime)}</span>
              </p>
              <ul className="genres genres--sm">
                {m.genres.map((g) => <li key={g}>{g}</li>)}
              </ul>
              <p className="pick__logline">{m.logline}</p>
              <div className="pick__actions">
                <Link href={`/movie/${m.id}`} className="btn btn--primary btn--sm">Подробнее</Link>
                <Reactions id={m.id} size="sm" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
