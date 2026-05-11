import { z } from 'zod';

const schema = z.object({
  NEXT_PUBLIC_CMS_URL: z.string().url().default('http://localhost:3333'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  // Список origin-ов media-хранилищ (S3/MinIO/CDN) через запятую.
  // По умолчанию — локальный MinIO из playground.
  NEXT_PUBLIC_MEDIA_ORIGINS: z
    .string()
    .default('http://127.0.0.1:9000,http://localhost:9000'),
});

const parsed = schema.safeParse({
  NEXT_PUBLIC_CMS_URL: process.env.NEXT_PUBLIC_CMS_URL,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_MEDIA_ORIGINS: process.env.NEXT_PUBLIC_MEDIA_ORIGINS,
});

if (!parsed.success) {
  // Fail fast: лучше упасть при старте, чем рендерить с битой конфигурацией.
  console.error('[demo/env] invalid environment:', z.treeifyError(parsed.error));
  throw new Error('Invalid environment configuration');
}

export const env = parsed.data;

/**
 * Уникальные origin-ы media-хранилищ для preconnect/dns-prefetch.
 * Используются в `<head>` чтобы ускорить загрузку картинок, рендеримых
 * клиентом (`<CmsImage>`), не подключая CMS API.
 */
export const mediaOrigins: string[] = Array.from(
  new Set(
    env.NEXT_PUBLIC_MEDIA_ORIGINS.split(',')
      .map((o) => o.trim())
      .filter((o) => o.length > 0),
  ),
);
