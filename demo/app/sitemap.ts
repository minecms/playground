import type { MetadataRoute } from 'next';
import { cms } from '@/lib/cms';
import { env } from '@/lib/env';

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/pages`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ];

  try {
    const { items } = await cms.pages.list({ limit: 500 });
    const pageEntries = items
      .filter((p) => p.published)
      .map<MetadataRoute.Sitemap[number]>((p) => ({
        url: `${base}/${p.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
      }));
    return [...staticEntries, ...pageEntries];
  } catch {
    return staticEntries;
  }
}
