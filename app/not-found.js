import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="page wrap empty">
      <p className="empty__title">Такого фильма нет в каталоге</p>
      <p className="muted">Возможно, ссылка устарела.</p>
      <Link href="/" className="btn btn--primary">Открыть каталог</Link>
    </div>
  );
}
