'use client';
// Однократная загрузка YouTube IFrame API. Скрипт можно начать грузить заранее
// (например, пока человек смотрит каталог), тогда на странице фильма трейлер стартует быстрее.
let promise = null;

export function loadYouTubeApi() {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (promise) return promise;
  promise = new Promise((resolve, reject) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve(window.YT);
    };
    const s = document.createElement('script');
    s.src = 'https://www.youtube.com/iframe_api';
    s.async = true;
    s.onerror = () => { promise = null; reject(new Error('YouTube API failed')); };
    document.head.appendChild(s);
  });
  return promise;
}

// Прогрев: заранее открываем соединения и, когда браузер свободен, грузим API
export function warmUpYouTube() {
  if (typeof window === 'undefined') return;
  const hosts = ['https://www.youtube-nocookie.com', 'https://www.youtube.com', 'https://i.ytimg.com', 'https://www.google.com'];
  hosts.forEach((href) => {
    if (document.querySelector(`link[rel="preconnect"][href="${href}"]`)) return;
    const l = document.createElement('link');
    l.rel = 'preconnect';
    l.href = href;
    l.crossOrigin = '';
    document.head.appendChild(l);
  });
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 1500));
  idle(() => { loadYouTubeApi().catch(() => {}); });
}
