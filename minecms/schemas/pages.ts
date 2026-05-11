import { defineField, defineSchema } from '@minecms/core';

/**
 * Пример контент-модели «страница».
 *
 * Реальная схема пользователя живёт здесь. Studio построит по ней список и
 * форму, server создаст таблицу и CRUD-эндпоинты, SDK выведет тип документа.
 *
 * Внутри пользовательского проекта схема — это обычный TS-модуль, который
 * подключается к `minecms.config.ts`. Изменения в полях → авто-миграция при
 * следующем старте сервера (контроль через `MINECMS_AUTO_MIGRATE` и
 * `MINECMS_ALLOW_DATA_LOSS` для деструктивных диффов).
 *
 * Именование: всегда `name` (как у `home`). `pluralName` указывай только если
 * автоматическое `${name}s` не подходит (например category → categories).
 * Здесь `name: 'pages'` — осознанно множественное число (URL Studio: `/schema/pages`);
 * без явного `pluralName` получилось бы `pagess`.
 */
export const pages = defineSchema({
  name: 'pages',
  pluralName: 'pages',
  label: 'Страницы',
  icon: 'File01Icon',
  routeField: 'slug',
  timestamps: true,
  fields: {
    title: defineField.string({
      label: 'Заголовок',
      max: 160,
    }),
    slug: defineField.slug({
      label: 'URL-сегмент',
      source: 'title',
      unique: true,
      description: 'Используется в публичном URL: /<slug>. Генерируется из заголовка.',
    }),
    description: defineField.text({
      label: 'Описание',
      optional: true,
      max: 1000,
    }),
    mainImage: defineField.image({
      label: 'Главная картинка',
      optional: true,
      description: 'Используется как обложка страницы в списках и социальных карточках.',
      accept: ['image/png', 'image/jpeg', 'image/webp'],
    }),
    body: defineField.richText({
      label: 'Содержимое',
      optional: true,
    }),
    published: defineField.boolean({
      label: 'Опубликовано',
      default: false,
      description: 'Если выключено, страница не отображается на сайте.',
    }),
  },
});
