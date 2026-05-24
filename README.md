# MineCMS Playground

Демонстрация полного пути пользователя [MineCMS](https://github.com/minecms/minecms): CMS-инстанс и публичный сайт на **реальных** схемах, миграциях и API — без mock-данных.

| Проект | Что это |
|---|---|
| [`minecms/`](./minecms/) | Пользовательский CMS-проект: схемы, конфиг, Docker (PostgreSQL, MinIO) |
| [`demo/`](./demo/) | Публичный сайт на Next.js через `@minecms/sdk` |

Структура повторяет результат `npm create @minecms/minecms-app`.

## Быстрый старт

```bash
docker compose up -d

# CMS: server + Studio на :3333 (/admin)
cd minecms && pnpm install && pnpm build:studio && pnpm dev

# Сайт :3000 (отдельный терминал)
cd demo && pnpm install && pnpm dev
```

1. Открой <http://localhost:3333/admin> → install-визард → создай документ.
2. Открой `http://localhost:3000` — сайт подтянет те же данные через SDK.

## Подробнее

- [minecms/README.md](./minecms/README.md) — схемы, env, медиа
- [demo/README.md](./demo/README.md) — env сайта
