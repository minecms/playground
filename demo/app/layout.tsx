import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { env, mediaOrigins } from '@/lib/env';
import { loadMenu } from '@/lib/menu';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: { default: 'MineCMS · Demo', template: '%s · MineCMS' },
  description: 'Демонстрация публичного сайта-потребителя MineCMS.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'MineCMS · Demo',
    title: 'MineCMS · Demo',
    description: 'Демонстрация публичного сайта-потребителя MineCMS.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MineCMS · Demo',
    description: 'Демонстрация публичного сайта-потребителя MineCMS.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0b',
  colorScheme: 'dark',
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const menu = await loadMenu();

  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <head>
        {/* Запросы к CMS API идут только из server-component'ов на этапе
            сборки/SSR; клиент к нему не обращается, поэтому preconnect к
            API не нужен. Картинки из media-хранилищ грузятся в браузере,
            им и нужен preconnect — без crossOrigin, т.к. <img> без CORS. */}
        {mediaOrigins.map((origin) => (
          <link key={origin} rel="preconnect" href={origin} />
        ))}
      </head>
      <body
        className={`${inter.variable} flex min-h-screen flex-col bg-background font-sans text-foreground antialiased`}>
        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-background focus-visible:px-4 focus-visible:py-2 focus-visible:text-foreground focus-visible:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring">
          К основному содержимому
        </a>
        <Header menu={menu} />
        <main id="main" className="flex-1">
          <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
