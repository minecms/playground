import { cms } from '@/lib/cms';
import type { NavigationItem, PageDoc } from '@/types/cms';

export type MenuLeaf =
  | { kind: 'link'; title: string; url: string; openInNewTab: boolean }
  | { kind: 'page'; title: string; slug: string };

export type MenuNode = MenuLeaf | { kind: 'group'; title: string; children: MenuLeaf[] };

/** Подгружает singleton `navigation` + список страниц, собирает дерево меню. */
export async function loadMenu(): Promise<MenuNode[]> {
  const [pagesResult, navResult] = await Promise.all([
    cms.pages.list({ limit: 200 }).catch(() => null),
    cms.navigation.list({ limit: 1 }).catch(() => null),
  ]);

  const pageById = new Map<string, PageDoc>();
  for (const p of pagesResult?.items ?? []) pageById.set(String(p.id), p);

  const navItems = navResult?.items[0]?.items;
  return Array.isArray(navItems) ? buildNodes(navItems, pageById) : [];
}

function buildNodes(items: NavigationItem[], pageById: Map<string, PageDoc>): MenuNode[] {
  const out: MenuNode[] = [];
  for (const raw of items) {
    if (raw.kind === 'link') {
      const leaf = toLink(raw);
      if (leaf) out.push(leaf);
    } else if (raw.kind === 'page') {
      const leaf = toPage(raw, pageById);
      if (leaf) out.push(leaf);
    } else if (raw.kind === 'group') {
      const title = raw.title?.trim();
      if (!title) continue;
      const children: MenuLeaf[] = [];
      for (const child of raw.children ?? []) {
        const leaf = child.kind === 'link' ? toLink(child) : toPage(child, pageById);
        if (leaf) children.push(leaf);
      }
      if (children.length > 0) out.push({ kind: 'group', title, children });
    }
  }
  return out;
}

function toLink(raw: Extract<NavigationItem, { kind: 'link' }>): MenuLeaf | null {
  const title = raw.title?.trim();
  const url = raw.url?.trim();
  if (!title || !url) return null;
  return { kind: 'link', title, url, openInNewTab: raw.openInNewTab === true };
}

function toPage(
  raw: Extract<NavigationItem, { kind: 'page' }>,
  pageById: Map<string, PageDoc>,
): MenuLeaf | null {
  if (raw.ref === null || raw.ref === undefined) return null;
  const page = pageById.get(String(raw.ref));
  if (!page?.published) return null;
  const title = raw.title?.trim() || page.title;
  return { kind: 'page', title, slug: page.slug };
}
