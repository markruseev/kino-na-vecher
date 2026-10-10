'use client';
import Link from '../lib/link';
import { posterUrl } from '../lib/paths';
import { useUser } from '../lib/user';
import { formatRuntime, formatRating } from '../lib/format';
import { IconBookmark, IconStar } from './Icons';

export default function MovieCard({ movie: m }) {
  const { isSaved } = useUser();
  const saved = isSaved(m.id);
  return (
    <Link href={`/movie/${m.id}`} className="card">
      <div className="card__poster">
        <img
          src={posterUrl(m.id)}
          alt={`Постер фильма «${m.title}»`}
          width={800}
          height={1200}
          loading="lazy"
        />
        {saved && (
          <span className="card__marks">
            {saved && (
              <span className="card__mark" title="Сохранено">
                <IconBookmark filled width={15} height={15} />
              </span>
            )}
          </span>
        )}
      </div>
      <h2 className="card__title">{m.title}</h2>
      <p className="card__meta">
        <span>{m.year}</span>
        {m.rating != null && (
          <span className="card__rating" title="Средняя оценка Кинопоиска и IMDb">
            <IconStar /> {formatRating(m.rating)}
          </span>
        )}
        <span>{formatRuntime(m.runtime)}</span>
      </p>
    </Link>
  );
}
