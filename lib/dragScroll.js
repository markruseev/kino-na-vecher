'use client';
import { useEffect } from 'react';

// Горизонтальная лента управляется мышью:
//  - зажать кнопку и тянуть — лента едет за курсором (клик по карточке после перетаскивания не срабатывает);
//  - вертикальное колесо над лентой листает её вбок, а у края ленты страница снова прокручивается как обычно.
// На тачскринах всё остаётся нативным (свайп).
export function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    let down = false;
    let moved = false;
    let startX = 0;
    let startLeft = 0;
    let idle = null;

    let gestureFrom = null;

    const freeSnap = () => {
      if (gestureFrom === null) gestureFrom = el.scrollLeft;
      el.classList.add('is-scrolling');
    };

    // Доводим ленту до ближайшей карточки в сторону движения, иначе крупный слайд
    // «отпрыгивает» назад при любом сдвиге меньше половины ширины.
    const settle = () => {
      const from = gestureFrom ?? el.scrollLeft;
      gestureFrom = null;
      const now = el.scrollLeft;
      const dir = Math.sign(now - from);
      const base = el.firstElementChild?.offsetLeft || 0;
      const stops = [...el.children].map((c) => c.offsetLeft - base);
      const max = el.scrollWidth - el.clientWidth;
      let candidates = stops;
      if (dir > 0) candidates = stops.filter((x) => x > from + 1);
      if (dir < 0) candidates = stops.filter((x) => x < from - 1);
      if (!candidates.length) candidates = stops;
      let target = candidates.reduce((a, b) => (Math.abs(b - now) < Math.abs(a - now) ? b : a), candidates[0]);
      target = Math.max(0, Math.min(max, target));
      el.scrollTo({ left: target, behavior: 'smooth' });
      setTimeout(() => el.classList.remove('is-scrolling'), 450);
    };

    const restoreSnap = () => {
      clearTimeout(idle);
      idle = setTimeout(settle, 140);
    };

    const onDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true;
      moved = false;
      gestureFrom = null;
      startX = e.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (!moved && Math.abs(dx) < 5) return;
      if (!moved) {
        moved = true;
        freeSnap();
        el.classList.add('is-dragging');
      }
      el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false;
      el.classList.remove('is-dragging');
      if (moved) restoreSnap();
    };
    // После перетаскивания гасим клик, чтобы не открыть карточку случайно
    const onClick = (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };
    const onDragStart = (e) => e.preventDefault();

    const onWheel = (e) => {
      if (e.ctrlKey) return;
      const dominant = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : 0;
      if (!dominant) return; // горизонтальный жест тачпада браузер обработает сам
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;
      const atStart = el.scrollLeft <= 0 && dominant < 0;
      const atEnd = el.scrollLeft >= max - 1 && dominant > 0;
      if (atStart || atEnd) return;
      e.preventDefault();
      freeSnap();
      el.scrollLeft += e.deltaMode === 1 ? dominant * 32 : dominant;
      restoreSnap();
    };

    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('click', onClick, true);
    el.addEventListener('dragstart', onDragStart);
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      clearTimeout(idle);
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('click', onClick, true);
      el.removeEventListener('dragstart', onDragStart);
      el.removeEventListener('wheel', onWheel);
    };
  }, [ref]);
}
