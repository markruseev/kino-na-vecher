export function posterUrl(id) {
  return `/posters/${id}.jpg`;
}

// На Vercel можно встраивать плеер YouTube; в статическом превью — нельзя
export const EMBEDS_ALLOWED = true;

export function youtubeWatchUrl(id) {
  return `https://www.youtube.com/watch?v=${id}`;
}
