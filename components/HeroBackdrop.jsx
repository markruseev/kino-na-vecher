import { posterUrl, EMBEDS_ALLOWED } from '../lib/paths';
import YouTubeBackdrop from './YouTubeBackdrop';

// Фон шапки фильма. Источник выбирается по тому, что есть в movies.json:
//   media.trailer_mp4        — путь к видеофайлу в public/, крутится без звука по кругу
//   media.trailer_youtube_id — id ролика YouTube, см. YouTubeBackdrop.jsx
//   media.stills             — массив путей к кадрам в public/, плавно сменяют друг друга
// Трейлер стартует с TRAILER_START секунды, чтобы пропустить заставки студий.
// Если ничего из этого нет, используется размытый постер с медленным движением.
const TRAILER_START = 5;

export default function HeroBackdrop({ movie }) {
  const media = movie.media || {};

  if (media.trailer_mp4) {
    return (
      <div className="backdrop backdrop--media" aria-hidden="true">
        <video src={`${media.trailer_mp4}#t=${TRAILER_START}`} autoPlay muted loop playsInline poster={posterUrl(movie.id)} />
      </div>
    );
  }

  if (media.trailer_youtube_id && EMBEDS_ALLOWED) {
    return <YouTubeBackdrop movieId={movie.id} videoId={media.trailer_youtube_id} />;
  }

  if (media.stills?.length) {
    const n = media.stills.length;
    return (
      <div className="backdrop backdrop--media backdrop--stills" aria-hidden="true">
        {media.stills.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            style={{ animationDuration: `${n * 6}s`, animationDelay: `${i * 6}s` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="backdrop backdrop--poster" aria-hidden="true">
      <img src={posterUrl(movie.id)} alt="" />
    </div>
  );
}
