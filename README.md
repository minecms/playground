# MineCMS Playground

Демо-инстанс [MineCMS](https://github.com/minecms/minecms) и пример сайта поверх него.

Структура повторяет то, что получит пользователь после `pnpm create minecms`:

- `minecms/` — установка CMS со схемами и Docker-окружением для MySQL/PostgreSQL/MinIO.
- `demo/` — публичный сайт на Next.js 16, который потребляет API CMS через `@minecms/sdk`.

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
