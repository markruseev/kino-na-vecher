// Превью-версия роутинга: те же ссылки, но через #film-<id> и #saved внутри одной страницы
import React from 'react';

export function toHash(href) {
  const m = /^\/movie\/(\d+)/.exec(href);
  if (m) return `#film-${m[1]}`;
  if (href === '/saved') return '#saved';
  return '#catalog';
}

export default function Link({ href, children, ...rest }) {
  return React.createElement('a', { href: toHash(href), ...rest }, children);
}

export function useNavigate() {
  return (href) => { window.location.hash = toHash(href); };
}
