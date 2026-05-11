import { MineCMSError } from '@minecms/sdk';

export interface FriendlyError {
  title: string;
  description: string;
  hint?: string;
  technical: string;
}

const STUDIO_URL = process.env.NEXT_PUBLIC_STUDIO_URL ?? 'http://localhost:5173';

export function toFriendlyError(err: unknown): FriendlyError {
  const technical = describe(err);

  if (err instanceof MineCMSError) {
    if (err.status === 503) {
      return {
        title: 'CMS ещё не настроена',
        description: 'Открой Studio и пройди установку — после этого данные появятся здесь.',
        hint: `${STUDIO_URL}/install`,
        technical,
      };
    }
    if (err.status === 404) {
      return {
        title: 'Не найдено',
        description: 'Такого документа нет в CMS — возможно, он не опубликован или удалён.',
        technical,
      };
    }
    if (err.status >= 500) {
      return {
        title: 'CMS временно недоступна',
        description: 'Сервер ответил ошибкой. Обнови страницу через несколько секунд.',
        hint: STUDIO_URL,
        technical,
      };
    }
    return { title: 'Ошибка запроса', description: 'CMS вернула некорректный ответ.', technical };
  }

  if (err instanceof Error && /fetch failed|network/i.test(err.message)) {
    return {
      title: 'Нет связи с CMS',
      description: `Не удалось достучаться до ${process.env.NEXT_PUBLIC_CMS_URL ?? 'CMS'}.`,
      technical,
    };
  }

  return { title: 'Что-то пошло не так', description: 'Попробуй обновить страницу.', technical };
}

function describe(err: unknown): string {
  if (err instanceof MineCMSError) return `${err.name}: ${err.message} (HTTP ${err.status}, ${err.code})`;
  if (err instanceof Error) return `${err.name}: ${err.message}`;
  return typeof err === 'string' ? err : 'Unknown error';
}

export { STUDIO_URL };
