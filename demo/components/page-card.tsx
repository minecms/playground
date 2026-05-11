'use client';

import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { CmsImage } from '@/components/cms-image';
import { cn } from '@/lib/utils';

export interface PageCardImage {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
}

export interface PageCardProps {
  slug: string;
  title: string;
  description: string | null;
  image: PageCardImage | null;
  className?: string;
}

export function PageCard({ slug, title, description, image, className }: PageCardProps) {
  const reduced = useReducedMotion();
  return (
    <motion.article
      {...(reduced ? {} : { whileHover: { y: -4 } })}
      transition={{ type: 'spring', stiffness: 320, damping: 24, mass: 0.5 }}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-foreground/30',
        className,
      )}>
      <Link
        href={`/${slug}`}
        className="block no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <div className="relative aspect-video w-full overflow-hidden bg-muted">
          {image ? (
            <motion.div
              initial={{ scale: 1 }}
              {...(reduced ? {} : { whileHover: { scale: 1.03 } })}
              transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              className="absolute inset-0">
              <CmsImage
                src={image.url}
                alt={image.alt ?? title}
                fill
                sizes="(min-width: 640px) 360px, 100vw"
                className="object-cover"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-wider text-muted-foreground">
              Без обложки
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 p-5">
          <h3 className="text-base font-medium tracking-tight text-card-foreground">
            {title}
          </h3>
          {description ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </Link>
    </motion.article>
  )
}
