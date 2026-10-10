'use client';
import { useEffect, useState } from 'react';

const KEY = 'kv-theme';

// Скрипт для <head>: применяет сохранённую тему до первой отрисовки, без вспышки
export const themeInitScript = `try{var t=localStorage.getItem('${KEY}');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}catch(e){}`;

function current() {
  const set = document.documentElement.dataset.theme;
  if (set === 'dark' || set === 'light') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState(null);
  useEffect(() => setTheme(current()), []);
  const toggle = () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { window.localStorage.setItem(KEY, next); } catch { /* без сохранения */ }
    setTheme(next);
  };
  return { theme, toggle };
}
