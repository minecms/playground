import { defineField, defineSchema } from '@minecms/core';

/**
 * Singleton «Навигация сайта»: одна запись, единственное поле — дерево пунктов.
 *
 * Дерево — `array` из `union`-варианта:
 * - `link` — внешняя ссылка `{ title, url, openInNewTab }`;
 * - `page` — ссылка на документ `pages` через `reference` (можно переопределить
 *   подпись через `title`, иначе берётся `pages.title`);
 * - `group` — заголовок группы с подпунктами (рекурсия одного уровня:
 *   подпункты — `link` или `page`, без вложенных групп; ограничение для UX,
 *   глубокая рекурсия union-в-union пока не поддерживается в редакторе).
 *
 * Поле `items` помечено `optional: true`, чтобы добавление к существующим
 * navigation-документам не считалось destructive change на уровне drizzle-kit.
 */
export const navigation = defineSchema({
  name: 'navigation',
  label: 'Навигация',
  singleton: true,
  order: -15,
  icon: 'Menu01Icon',
  fields: {
    items: defineField.array({
      label: 'Пункты меню',
      optional: true,
      max: 32,
      of: defineField.union({
        label: 'Пункт',
        variants: {
          link: defineField.object({
            label: 'Внешняя ссылка',
            fields: {
              title: defineField.string({ label: 'Текст', max: 120 }),
              url: defineField.string({
                label: 'URL',
                description: 'Абсолютный URL (https://…) или путь сайта (/about).',
                max: 500,
              }),
              openInNewTab: defineField.boolean({
                label: 'Открывать в новой вкладке',
                default: false,
              }),
            },
          }),
          page: defineField.object({
            label: 'Страница сайта',
            fields: {
              title: defineField.string({
                label: 'Текст',
                description: 'Если не указан — используется заголовок страницы.',
                max: 120,
                optional: true,
              }),
              ref: defineField.reference({ label: 'Страница', to: ['pages'] }),
            },
          }),
          group: defineField.object({
            label: 'Группа',
            fields: {
              title: defineField.string({ label: 'Заголовок группы', max: 120 }),
              children: defineField.array({
                label: 'Подпункты',
                max: 24,
                of: defineField.union({
                  label: 'Подпункт',
                  variants: {
                    link: defineField.object({
                      label: 'Внешняя ссылка',
                      fields: {
                        title: defineField.string({ label: 'Текст', max: 120 }),
                        url: defineField.string({ label: 'URL', max: 500 }),
                        openInNewTab: defineField.boolean({
                          label: 'Открывать в новой вкладке',
                          default: false,
                        }),
                      },
                    }),
                    page: defineField.object({
                      label: 'Страница сайта',
                      fields: {
                        title: defineField.string({
                          label: 'Текст',
                          max: 120,
                          optional: true,
                        }),
                        ref: defineField.reference({ label: 'Страница', to: ['pages'] }),
                      },
                    }),
                  },
                }),
              }),
            },
          }),
        },
      }),
    }),
  },
});
