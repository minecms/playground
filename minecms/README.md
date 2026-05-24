# MineCMS — playground (CMS-инстанс)

Демонстрационный пользовательский путь для MineCMS: реальные схемы, реальная БД, реальный API. Это **не** часть монорепо MineCMS — это образец того, что получит пользователь, поставивший CMS у себя.

> Никаких mock-данных, фейков и hardcoded-ответов. Контент живёт в реальной PostgreSQL и отдаётся через `@minecms/server`.

## Что внутри

```
playground/minecms/
├── package.json            # file:-зависимости от @minecms/{core,server,sdk,studio}
├── tsconfig.json
├── .env.example            # PostgreSQL 16 по умолчанию
├── minecms.config.ts       # defineConfig({ database, schemas, server })
└── schemas/
    └── pages.ts            # пример схемы `pages` (title + slug + description + body + published)
```

## Установка

Требуется Node 24 LTS и Docker (или внешняя PostgreSQL 16).

```bash
cd playground/minecms
cp .env.example .env
# Поправь SESSION_SECRET и DATABASE_URL по необходимости.

# Поднять БД:
cd ..
docker compose up -d
cd minecms

pnpm install
```

`pnpm install` создаёт symlinks:

- `node_modules/@minecms/core` → `../../minecms/packages/core`
- `node_modules/@minecms/server` → `../../minecms/apps/server`
- `node_modules/@minecms/studio` → `../../minecms/apps/studio`
- `node_modules/@minecms/sdk` → `../../minecms/packages/sdk`

> При публикации MineCMS в npm эти ссылки превратятся в обычные `^x.y.z`-зависимости. Сейчас — `file:` для удобной разработки.

## Запуск

В двух терминалах:

```bash
# Терминал 1 — backend (Fastify + tRPC + REST на 3333)
pnpm dev

# Терминал 2 — Studio (Vite на 5173)
pnpm dev:studio
```

При первом запуске Studio откроется на `/install` — пройди визард:
1. Шаг 1 «База данных» — драйвер и URL уже подставлены из `.env`.
2. Шаг 2 «Администратор» — e-mail и пароль для будущего входа.
3. Шаг 3 «Готово» — переход на `/login`.

После логина в `/dashboard` появится карточка схемы `Страницы`. Создай документ — он попадёт в реальную таблицу `pages` в БД.

## Schemas-as-code

Контент-модель описывается в `schemas/pages.ts` через `defineSchema` + `defineField`. Любое изменение полей применяется к БД **автоматически** при следующем старте сервера (через `drizzle-kit/api`):

| ENV-флаг | Что управляет |
|---|---|
| `MINECMS_AUTO_MIGRATE=true` | применять диффы при старте (по умолчанию) |
| `MINECMS_ALLOW_DATA_LOSS=false` | разрешать DROP/RENAME колонок и `ADD UNIQUE` на существующих данных. По умолчанию `false` — сервер всё равно применит безопасные `CREATE TABLE` и `ADD COLUMN nullable`, опасные пропустит и сообщит в логе. |

## Медиа (Phase 13)

Локально файлы хранятся в **MinIO** (S3-совместимый сервис из `playground/docker-compose.yml`). В production достаточно поменять `S3_*` переменные в `.env` на ваш AWS S3 / Cloudflare R2 / Backblaze B2 / Yandex Object Storage и т.п. — код менять не нужно.

```bash
# 1. Запустить MinIO + Postgres
cd playground
docker compose up -d

# 2. Bucket `minecms-media` создаётся автоматически контейнером `minio-init`.
#    MinIO Console:        http://localhost:9001  (логин `minecms` / `minecms-secret`)
#    MinIO S3 endpoint:    http://localhost:9000
```

Загруженные файлы появляются:

- в Studio → раздел «Медиа» (иконка картинки в левом рельсе) — список с превью, alt-text, удаление;
- в форме страницы → поле «Главная картинка» (dropzone «Drag or paste image here» + кнопки `Upload` / `Select`).

Размер файла ограничен `MEDIA_MAX_FILE_SIZE` в `.env` (по умолчанию 25 MB). Поддерживаемые форматы — `image/png`, `image/jpeg`, `image/webp`, `image/gif`.

## Подключение публичного сайта

Сайт-потребитель живёт в `playground/demo/`. Он тянет данные через `@minecms/sdk`:

```ts
import { createClient } from '@minecms/sdk';
import { pages } from '../../minecms/schemas/pages';

const cms = createClient({
  url: 'http://localhost:3333',
  schemas: { pages },
});

const { items } = await cms.pages.list();
//        ^? тип выводится из defineSchema, никаких ручных интерфейсов
```
