import { posterUrl, EMBEDS_ALLOWED } from '../lib/paths';

// Фон шапки фильма. Источник выбирается по тому, что есть в movies.json:
//   media.trailer_mp4        — путь к видеофайлу в public/, крутится без звука по кругу
//   media.trailer_youtube_id — id ролика YouTube, встраивается без звука по кругу
//   media.stills             — массив путей к кадрам в public/, плавно сменяют друг друга
// Если ничего из этого нет, используется размытый постер с медленным движением.
export default function HeroBackdrop({ movie }) {
  const media = movie.media || {};

  if (media.trailer_mp4) {
    return (
      <div className="backdrop backdrop--media" aria-hidden="true">
        <video src={media.trailer_mp4} autoPlay muted loop playsInline poster={posterUrl(movie.id)} />
      </div>
    );
  }

  if (media.trailer_youtube_id && EMBEDS_ALLOWED) {
    const yt = media.trailer_youtube_id;
    const src = `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&mute=1&loop=1&playlist=${yt}&controls=0&playsinline=1&modestbranding=1&rel=0`;
    return (
      <div className="backdrop backdrop--media" aria-hidden="true">
        <iframe src={src} title="Трейлер" allow="autoplay; encrypted-media" tabIndex={-1} />
      </div>
    );
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
