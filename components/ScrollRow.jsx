'use client';
import { useEffect, useRef, useState } from 'react';
import { IconBack } from './Icons';
import { useDragScroll } from '../lib/dragScroll';

// Горизонтальная лента без видимой полосы прокрутки, с круглыми стрелками у заголовка
export default function ScrollRow({ title, listClass, children, footer }) {
  const ref = useRef(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  useDragScroll(ref);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => setEdges({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      el.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const go = (dir) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  const scrollable = !(edges.start && edges.end);

  return (
    <>
      <div className="row-head">
        <h2 className="h2">{title}</h2>
        {scrollable && (
          <div className="row-nav">
            <button type="button" className="round-btn round-btn--sm" aria-label="Назад" onClick={() => go(-1)} disabled={edges.start}>
              <IconBack />
            </button>
            <button type="button" className="round-btn round-btn--sm round-btn--flip" aria-label="Вперёд" onClick={() => go(1)} disabled={edges.end}>
              <IconBack />
            </button>
          </div>
        )}
      </div>
      <ul className={`no-scrollbar drag-scroll ${listClass}`} ref={ref}>{children}</ul>
      {footer}
    </>
  );
}
