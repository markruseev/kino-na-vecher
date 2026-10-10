const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export function IconFilter(p) {
  return (
    <svg {...base} {...p}>
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </svg>
  );
}

export function IconSearch(p) {
  return (
    <svg {...base} {...p}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.2-4.2" />
    </svg>
  );
}

export function IconClose(p) {
  return (
    <svg {...base} {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconBack(p) {
  return (
    <svg {...base} {...p}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function IconBookmark({ filled, ...p }) {
  return (
    <svg {...base} {...p} fill={filled ? 'currentColor' : 'none'}>
      <path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function IconPlay(p) {
  return (
    <svg {...base} {...p} fill="currentColor" stroke="none">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
    </svg>
  );
}

export function IconStar(p) {
  return (
    <svg {...base} width={14} height={14} {...p} fill="currentColor" stroke="none">
      <path d="M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.85L12 16.9l-5.25 2.75 1-5.85L3.5 9.7l5.9-.9z" />
    </svg>
  );
}

export function IconShuffle(p) {
  return (
    <svg {...base} {...p}>
      <path d="M4 7h3c4 0 6 10 10 10h3M4 17h3c1.6 0 2.8-1.6 3.9-3.6M13.1 9.6C14.2 8.1 15.4 7 17 7h3" />
      <path d="M18 4l3 3-3 3M18 14l3 3-3 3" />
    </svg>
  );
}

export function IconSun(p) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.6 4.6 6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" />
    </svg>
  );
}

export function IconMoon(p) {
  return (
    <svg {...base} {...p}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  );
}

export function IconThumbUp({ filled, ...p }) {
  return (
    <svg {...base} {...p} fill={filled ? 'currentColor' : 'none'}>
      <path d="M7 10v10H4.5A1.5 1.5 0 0 1 3 18.5v-7A1.5 1.5 0 0 1 4.5 10H7zm0 0 4-7a2.2 2.2 0 0 1 2.9 2.6L13 10h5.6a2 2 0 0 1 2 2.4l-1.4 6A2 2 0 0 1 17.2 20H7" />
    </svg>
  );
}

const HEART = 'M12 20.5s-7.5-4.6-7.5-10.4A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.8c0 5.8-7.5 10.4-7.5 10.4z';

export function IconHeart({ filled, ...p }) {
  return (
    <svg {...base} {...p} fill={filled ? 'currentColor' : 'none'}>
      <path d={HEART} />
    </svg>
  );
}

export function IconHeartBroken({ filled, ...p }) {
  return (
    <svg {...base} {...p}>
      <path d={HEART} fill={filled ? 'currentColor' : 'none'} />
      <path d="M12 7.3 10.4 11l2.6 1.6-1.8 3.6" stroke={filled ? 'var(--bg)' : 'currentColor'} />
    </svg>
  );
}

// Три сердца треугольником: одно сверху, два снизу
export function IconHearts({ filled, ...p }) {
  const f = filled ? 'currentColor' : 'none';
  const pos = [[6, -2], [1, 7.4], [11, 7.4]];
  return (
    <svg {...base} {...p}>
      {pos.map(([x, y]) => (
        <path key={`${x}-${y}`} d={HEART} fill={f} strokeWidth={3.2} transform={`translate(${x} ${y}) scale(0.5)`} />
      ))}
    </svg>
  );
}

export function IconArrow(p) {
  return (
    <svg {...base} width={14} height={14} {...p}>
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  );
}
