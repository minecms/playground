/**
 * Типы документов, которые сайт ждёт от CMS. Декларируются на стороне
 * потребителя (аналог codegen-обвязки в headless-CMS клиентах): сервер
 * отвечает за HTTP-контракт, фронт — за типизацию ожидаемых полей.
 */

export interface ImageAsset {
  assetId: number;
  alt: string | null;
  url: string;
  width: number | null;
  height: number | null;
  mimeType: string;
}

export interface HomeDoc {
  id: number;
  title: string;
  body: unknown;
}

export interface PageDoc {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  mainImage: ImageAsset | null;
  body: unknown;
  published: boolean;
}

export type NavigationItem =
  | { kind: 'link'; title: string; url: string; openInNewTab?: boolean }
  | { kind: 'page'; ref: number | string | null; title?: string }
  | { kind: 'group'; title: string; children: Array<Exclude<NavigationItem, { kind: 'group' }>> };

export interface NavigationDoc {
  id: number;
  items: NavigationItem[];
}
