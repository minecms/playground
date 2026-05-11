import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { CmsImage } from '@/components/cms-image';
import { ErrorState } from '@/components/error-state';
import { ArrowLeft } from '@/components/icons';
import { MotionButton } from '@/components/motion/button';
import { RichText } from '@/components/rich-text';
import { cms } from '@/lib/cms';
import { STUDIO_URL, toFriendlyError, type FriendlyError } from '@/lib/errors';
import type { PageDoc } from '@/types/cms';

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

// SSG: пре-рендер всех опубликованных страниц на build. Динамические
// и неопубликованные слаги попадут под revalidate-fetch.
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  try {
    const { items } = await cms.pages.list({ limit: 500 });
    return items.filter((p) => p.published).map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await cms.pages.get(slug);
    if (!page.published) return { title: 'Страница не опубликована', robots: { index: false } };
    const description = page.description ?? undefined;
    const ogImage = page.mainImage?.url;
    return {
      title: page.title,
      ...(description ? { description } : {}),
      openGraph: {
        title: page.title,
        ...(description ? { description } : {}),
        ...(ogImage ? { images: [{ url: ogImage }] } : {}),
      },
      twitter: {
        card: ogImage ? 'summary_large_image' : 'summary',
        title: page.title,
        ...(description ? { description } : {}),
        ...(ogImage ? { images: [ogImage] } : {}),
      },
    };
  } catch {
    return { title: 'Страница недоступна', robots: { index: false } };
  }
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;

  if (!slug) {
    return (
      <ArticleShell>
        <ErrorState
          variant="warn"
          error={{
            title: 'Не указан адрес страницы',
            description: 'URL не содержит slug страницы.',
            technical: 'slug=undefined',
          }}
        />
      </ArticleShell>
    );
  }

  let page: PageDoc | undefined;
  let error: FriendlyError | undefined;

  try {
    const item = await cms.pages.get(slug);
    if (!item.published) {
      error = {
        title: 'Страница пока не опубликована',
        description:
          'Документ существует, но флаг «Опубликовано» выключен. Включи его в Studio.',
        hint: STUDIO_URL,
        technical: `slug=${slug}, published=false`,
      };
    } else {
      page = item;
    }
  } catch (err) {
    error = toFriendlyError(err);
  }

  if (error) {
    return (
      <ArticleShell>
        <ErrorState variant="warn" error={error} />
      </ArticleShell>
    );
  }

  if (!page) {
    return (
      <ArticleShell>
        <ErrorState
          variant="error"
          error={{
            title: 'Страница недоступна',
            description: 'CMS не вернула данные. Попробуй обновить страницу.',
            technical: 'page=undefined',
          }}
        />
      </ArticleShell>
    );
  }

  return (
    <ArticleShell>
      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-4">
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {page.title}
          </h1>
          {page.description ? (
            <p className="max-w-prose text-lg leading-relaxed text-muted-foreground">
              {page.description}
            </p>
          ) : null}
        </header>

        {page.mainImage ? (
          <figure className="overflow-hidden rounded-xl border border-border bg-muted">
            <CmsImage
              src={page.mainImage.url}
              alt={page.mainImage.alt ?? page.title}
              width={page.mainImage.width ?? 1600}
              height={page.mainImage.height ?? 900}
              sizes="(min-width: 768px) 768px, 100vw"
              fetchPriority="high"
              className="block h-auto w-full"
            />
          </figure>
        ) : null}

        {page.body ? <RichText value={page.body} /> : null}
      </article>
    </ArticleShell>
  );
}

function ArticleShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <MotionButton asChild variant="ghost" size="sm" className="self-start px-2">
        <Link href="/">
          <ArrowLeft />
          На главную
        </Link>
      </MotionButton>
      {children}
    </div>
  );
}
