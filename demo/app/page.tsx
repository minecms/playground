import { ErrorState } from '@/components/error-state';
import { RichText } from '@/components/rich-text';
import { cms } from '@/lib/cms';
import { STUDIO_URL, toFriendlyError } from '@/lib/errors';

// ISR: первый запрос рендерит, дальше 60 секунд отдаём из кеша.
// Студия меняет контент → пользователь видит свежее не позже чем через минуту.
export const revalidate = 60;

export default async function HomePage() {
  try {
    const { items } = await cms.home.list({ limit: 1 });
    const doc = items[0];

    if (!doc) {
      return (
        <ErrorState
          variant="info"
          error={{
            title: 'Главная ещё не заполнена',
            description:
              'В Studio открой тип «Главная» (singleton), создай документ и сохрани поля.',
            hint: STUDIO_URL,
            technical: 'home: пустая таблица',
          }}
        />
      );
    }

    return (
      <article className="flex flex-col gap-8">
        <header className="flex flex-col gap-3 border-b border-border/60 pb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Главная
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {doc.title}
          </h1>
        </header>
        <RichText value={doc.body} />
      </article>
    );
  } catch (err) {
    return <ErrorState variant="warn" error={toFriendlyError(err)} />;
  }
}
