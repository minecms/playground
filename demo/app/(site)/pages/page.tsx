import { ErrorState } from '@/components/error-state';
import { PageCard } from '@/components/page-card';
import { cms } from '@/lib/cms';
import { STUDIO_URL, toFriendlyError, type FriendlyError } from '@/lib/errors';
import type { PageDoc } from '@/types/cms';

export const metadata = { title: 'Страницы' };
export const revalidate = 60;

export default async function PagesIndexPage() {
  let items: PageDoc[] = [];
  let error: FriendlyError | undefined;

  try {
    const result = await cms.pages.list({ limit: 200 });
    items = result.items.filter((p) => p.published);
    items.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
  } catch (err) {
    error = toFriendlyError(err);
  }

  if (error) return <ErrorState variant="warn" error={error} />;

  if (items.length === 0) {
    return (
      <ErrorState
        variant="info"
        error={{
          title: 'Пока нет опубликованных страниц',
          description: 'Создай страницу в Studio, отметь «Опубликовано» — она появится в списке.',
          hint: STUDIO_URL,
          technical: 'pages: пустой список',
        }}
      />
    );
  }

  return (
    <section className="flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Каталог
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground">
          Страницы
        </h1>
        <p className="max-w-prose text-sm text-muted-foreground">
          Все опубликованные документы типа «Страницы» из CMS.
        </p>
      </header>

      <ul className="grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2">
        {items.map((page) => (
          <li key={page.slug} className="m-0">
            <PageCard
              slug={page.slug}
              title={page.title}
              description={page.description}
              image={
                page.mainImage
                  ? {
                      url: page.mainImage.url,
                      alt: page.mainImage.alt ?? null,
                      width: page.mainImage.width,
                      height: page.mainImage.height,
                    }
                  : null
              }
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
