import { defineStudioStructure } from '@minecms/core';

/**
 * Структура второго сайдбара Studio (порядок типов и разделители).
 * Отдельно от модели контента: это навигация, не `defineSchema`.
 */
export const contentStructure = defineStudioStructure({
  title: 'Контент',
  items: [
    { kind: 'schema', name: 'home' },
    { kind: 'schema', name: 'navigation' },
    { kind: 'divider' },
    { kind: 'schema', name: 'pages' },
  ],
});
