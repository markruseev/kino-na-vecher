import './globals.css';
import { themeInitScript } from '../lib/theme';

export const metadata = {
  title: { default: 'Кино на вечер', template: '%s · Кино на вечер' },
  description: 'Прототип сервиса для поиска фильма на вечер: каталог и подробные карточки фильмов.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Unbounded:wght@600;800&display=swap"
        />
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
