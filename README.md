# MineCMS Playground

Демонстрация полного пути пользователя [MineCMS](https://github.com/minecms/minecms): CMS-инстанс и публичный сайт на **реальных** схемах, миграциях и API — без mock-данных.

| Проект | Что это |
|---|---|
| [`minecms/`](./minecms/) | Пользовательский CMS-проект: схемы, конфиг, Docker (PostgreSQL, MinIO) |
| [`demo/`](./demo/) | Публичный сайт на Next.js через `@minecms/sdk` |

Структура повторяет результат `npx create-minecms-app`.

## Быстрый старт

```bash
docker compose up -d

# CMS: server :3333, Studio :5173
cd minecms && pnpm install && pnpm dev

# Сайт :3000 (отдельный терминал)
cd demo && pnpm install && pnpm dev
```

1. Открой Studio → install-визард → создай документ.
2. Открой `http://localhost:3000` — сайт подтянет те же данные через SDK.

## Подробнее

- [minecms/README.md](./minecms/README.md) — схемы, env, медиа
- [demo/README.md](./demo/README.md) — env сайта
