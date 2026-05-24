# MineCMS Playground

Демо-инстанс [MineCMS](https://github.com/minecms/minecms) и пример сайта поверх него.

Структура повторяет то, что получит пользователь после `pnpm create minecms`:

- `minecms/` — установка CMS со схемами и Docker-окружением для MySQL/PostgreSQL/MinIO.
- `demo/` — публичный сайт на Next.js 16, который потребляет API CMS через `@minecms/sdk`.

## Правила

`playground/` — демонстрационный пользовательский путь, не часть монорепо MineCMS.

**Запрещено:**

1. Mock-данные, фейки, hardcoded-ответы — только реальные схемы → миграции → БД → API.
2. Редактировать пакеты CMS из playground (symlink'и в `node_modules/@minecms/*` — правки только в `minecms/`).
3. Активировать UI-dev-режим Studio (`MINECMS_DEV_MODE=ui`) — он только для разработки админки в `minecms/apps/studio/`.
4. Менять структуру `@minecms/*` — новые поля и компоненты добавляются в монорепо `minecms/`.

**Разрешено:** схемы в `minecms/schemas/`, конфиг `minecms.config.ts`, код сайта в `demo/`, `docker-compose.yml` и `.env.example`.

## Быстрый старт

```bash
# Поднять локальные сервисы (Postgres + MinIO)
docker compose up -d

# CMS (сервер на :3001, Studio на :5173)
cd minecms && pnpm install && pnpm dev

# Демо-сайт на :3000
cd ../demo && pnpm install && pnpm dev
```

## Лицензия

Apache-2.0. См. [LICENSE](../minecms/LICENSE) основного репозитория.
