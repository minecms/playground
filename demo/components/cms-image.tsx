import Image, { type ImageProps } from 'next/image';

/**
 * Обёртка над next/image для CMS-media.
 *
 * Media приходит как **signed URL** (presigned S3/MinIO с истекающей подписью
 * в query: X-Amz-Signature, X-Amz-Expires и т.п.). Next image optimizer
 * кеширует по полному URL, поэтому каждый новый запрос с новой подписью
 * становится cache-miss → бесполезный re-fetch. Поэтому `unoptimized` —
 * корректное поведение для signed-URL источников.
 *
 * Защита от arbitrary URL остаётся через `images.remotePatterns` в
 * `next.config.ts` (whitelist по origin).
 */
export function CmsImage(props: ImageProps) {
  return <Image {...props} unoptimized />;
}
