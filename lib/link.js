'use client';
// Обёртка над роутингом Next.js. Для статической превью-сборки этот модуль
// подменяется файлом preview/link.js — компоненты остаются общими.
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';

export default NextLink;

export function useNavigate() {
  const router = useRouter();
  return (href) => router.push(href);
}
