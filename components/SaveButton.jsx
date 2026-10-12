'use client';
import { useEffect } from 'react';
import { useUser, markViewed } from '../lib/user';
import {
  IconBookmark, IconHeart, IconHeartBroken, IconHearts,
} from './Icons';

export default function SaveButton({ id, primary = false }) {
  const { isSaved, toggleSave } = useUser();
  const saved = isSaved(id);
  return (
    <button
      type="button"
      className={`btn ${saved ? 'btn--saved' : primary ? 'btn--primary' : 'btn--ghost'}`}
      aria-pressed={saved}
      onClick={() => toggleSave(id)}
    >
      <IconBookmark filled={saved} />
      {saved ? 'Сохранено' : 'Сохранить'}
    </button>
  );
}

export const REACTIONS = [
  { value: -1, label: 'Не понравилось', Icon: IconHeartBroken, cls: 'nope' },
  { value: 1, label: 'Понравилось', Icon: IconHeart, cls: 'like' },
  { value: 2, label: 'Очень понравилось', Icon: IconHearts, cls: 'love' },
];

// Три кнопки оценки. Повторное нажатие снимает оценку.
export function Reactions({ id, size = 'md', onRate }) {
  const { reaction, react } = useUser();
  const r = reaction(id);
  return (
    <div className={`reactions reactions--${size}`} role="group" aria-label="Оценка">
      {REACTIONS.map(({ value, label, Icon, cls }) => (
        <button
          key={value}
          type="button"
          className={`rate__btn rate__btn--${cls}${r === value ? ' rate__btn--on' : ''}`}
          aria-pressed={r === value}
          aria-label={label}
          title={label}
          onClick={() => { react(id, value); onRate?.(value); }}
        >
          <Icon filled={r === value} />
        </button>
      ))}
    </div>
  );
}

// «Уже смотрели?» на странице фильма. Заодно отмечает, что карточку открывали.
export function RateBar({ id }) {
  const { reaction } = useUser();
  const r = reaction(id);
  useEffect(() => { markViewed(id); }, [id]);
  const current = REACTIONS.find((x) => x.value === r);
  return (
    <div className="rate">
      <span className="rate__label">{current ? current.label : 'Уже смотрели? Оцените'}</span>
      <Reactions id={id} />
    </div>
  );
}
