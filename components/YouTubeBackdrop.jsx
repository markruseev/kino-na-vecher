'use client';
import { useEffect, useRef, useState } from 'react';
import { posterUrl } from '../lib/paths';
import { loadYouTubeApi } from '../lib/youtube';

// Трейлер на фоне шапки через YouTube IFrame API, а не через простой embed:
//  - без параметров loop/playlist, поэтому YouTube не рисует кнопки «предыдущее / следующее видео»;
//  - повтор делаем сами: на конце ролика перематываем на START и запускаем снова, заставки не повторяются;
//  - плеер увеличен и обрезан краями блока, так что заголовок, логотип и полоски по краям уходят за кадр;
//  - пока видео не заиграло, виден размытый постер, плеер плавно проявляется — без чёрного экрана и спиннера;
//  - pointer-events: none, поэтому наведение и клики не вызывают паузу и оверлеи.
const START = 5;

export default function YouTubeBackdrop({ movieId, videoId }) {
  const holder = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let player = null;
    let cancelled = false;
    loadYouTubeApi().then((YT) => {
      if (cancelled || !holder.current) return;
      player = new YT.Player(holder.current, {
        videoId,
        host: 'https://www.youtube-nocookie.com',
        playerVars: {
          autoplay: 1,
          mute: 1,
          start: START,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
        },
        events: {
          onReady: (e) => {
            e.target.mute();
            e.target.setPlaybackQuality?.('hd720');
            e.target.playVideo();
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.PLAYING) {
              // небольшая задержка: даём YouTube убрать стартовую плашку с названием
              setTimeout(() => !cancelled && setPlaying(true), 600);
            }
            if (e.data === YT.PlayerState.ENDED) {
              e.target.seekTo(START, true);
              e.target.playVideo();
            }
          },
        },
      });
    }).catch(() => { /* YouTube недоступен — остаётся постер */ });
    return () => {
      cancelled = true;
      try { player?.destroy(); } catch { /* уже уничтожен */ }
    };
  }, [videoId]);

  return (
    <div className="backdrop backdrop--media backdrop--yt" aria-hidden="true">
      <img className="backdrop__fallback" src={posterUrl(movieId)} alt="" />
      <div className={`yt-frame${playing ? ' yt-frame--on' : ''}`}>
        <div ref={holder} />
      </div>
    </div>
  );
}
