import { defineConfig, schemasToSdkMap } from '@minecms/core';
import { schemaTypes } from './schemas';
import { contentStructure } from './structure';

/**
 * Корневой конфиг playground-инстанса MineCMS.
 *
 * Server динамически импортирует этот файл (`MINECMS_CONFIG=./minecms.config.ts`),
 * валидирует и применяет схемы к БД. Studio по этим же схемам строит UI.
 *
 * `database.url` берётся из ENV (см. `.env.example`) — никаких секретов в коде.
 */
export default defineConfig({
  database: {
    driver: 'postgres',
  },
  schemas: [...schemaTypes],
  studioStructure: contentStructure,
  server: {
    port: 3333,
    cors: ['http://localhost:5173', 'http://localhost:3000'],
  },
});

/**
 * Карта для `createClient`: ключи = `schema.name`, источник — тот же `schemaTypes`.
 */
export const schemas = schemasToSdkMap(schemaTypes);
