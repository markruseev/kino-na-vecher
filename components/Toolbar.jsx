'use client';
import Link from '../lib/link';
import { useUser } from '../lib/user';
import { useTheme } from '../lib/theme';
import Logo from './Logo';
import { IconBookmark, IconSun, IconMoon } from './Icons';

// Верхняя строка: логотип, слот для управления страницей, справа сохранённые и тема
export default function Toolbar({ children, savedActive = false }) {
  const { saved } = useUser();
  const { theme, toggle } = useTheme();
  return (
    <div className="toolbar">
      <Logo />
      <div className="toolbar__controls">{children}</div>
      <div className="toolbar__end">
        <Link
          href={savedActive ? '/' : '/saved'}
          className={`round-btn${savedActive ? ' round-btn--on' : ''}`}
          aria-label={savedActive ? 'Ко всем фильмам' : 'Сохранённые фильмы'}
          title="Сохранённые"
        >
          <IconBookmark filled={savedActive} />
          {saved.length > 0 && <span className="round-btn__badge">{saved.length}</span>}
        </Link>
        <button
          type="button"
          className="round-btn"
          onClick={toggle}
          aria-label={theme === 'dark' ? 'Включить светлую тему' : 'Включить тёмную тему'}
          title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        >
          {theme === 'dark' ? <IconSun /> : <IconMoon />}
        </button>
      </div>
    </div>
  );
}
