'use client';
import { useState } from 'react';

// Длинный текст показывается первыми строками, остальное по кнопке
export default function ExpandableText({ text, lines = 3 }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="expand">
      <p
        className={`prose${open ? '' : ' prose--clamped'}`}
        style={open ? undefined : { WebkitLineClamp: lines }}
      >
        {text}
      </p>
      <button type="button" className="expand__btn" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        {open ? 'Свернуть' : 'Читать полностью'}
      </button>
    </div>
  );
}
