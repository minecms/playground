import { defineField, defineSchema } from '@minecms/core';

/**
 * Singleton: одна запись «Главная» без списка.
 *
 * Система как у `page`: всегда `name` (= id в URL/API/БД). Поле `type` не нужно —
 * логический тип в API совпадает с `name`. `singleton: true` — не коллекция, а одна строка.
 */
export const home = defineSchema({
  name: 'home',
  label: 'Главная',
  singleton: true,
  order: -10,
  icon: 'Home01Icon',
  fields: {
    title: defineField.string({
      label: 'Заголовок',
      max: 200,
    }),
    body: defineField.richText({
      label: 'Контент',
      optional: true,
      features: [
        'bold',
        'italic',
        'strike',
        'underline',
        'code',
        'highlight',
        'link',
        'heading',
        'bulletList',
        'orderedList',
        'taskList',
        'blockquote',
        'codeBlock',
        'horizontalRule',
        'textAlign',
        'subscript',
        'superscript',
        'image',
        'table',
      ],
    }),
  },
});