import { createClient } from '@minecms/sdk';
import { env } from '@/lib/env';
import type { HomeDoc, NavigationDoc, PageDoc } from '@/types/cms';

const url = env.NEXT_PUBLIC_CMS_URL;

interface ListResult<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

interface ListOpts {
  limit?: number;
  offset?: number;
}

// SDK в runtime использует только schema.name; field-инспекция нужна ему
// для type inference, который здесь подменён локальными типами из @/types/cms.
const baseClient = createClient({
  url,
  schemas: {
    home: { name: 'home' },
    pages: { name: 'pages' },
    navigation: { name: 'navigation' },
  } as never,
});

export const cms = baseClient as unknown as {
  home: { list(opts?: ListOpts): Promise<ListResult<HomeDoc>> };
  pages: {
    list(opts?: ListOpts): Promise<ListResult<PageDoc>>;
    get(slug: string): Promise<PageDoc>;
  };
  navigation: { list(opts?: ListOpts): Promise<ListResult<NavigationDoc>> };
};
