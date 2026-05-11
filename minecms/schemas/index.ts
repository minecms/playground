import { home } from './home';
import { navigation } from './navigation';
import { pages } from './pages';

export { home, navigation, pages };

/**
 * Единый список схем проекта.
 * Подключается в `minecms.config.ts` и прокидывается в `defineConfig` / `schemasToSdkMap`.
 */
export const schemaTypes = [navigation, home, pages] as const;
