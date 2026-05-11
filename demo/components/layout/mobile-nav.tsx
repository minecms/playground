'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import type { MenuLeaf, MenuNode } from '@/lib/menu';
import { cn } from '@/lib/utils';

interface MobileNavProps {
  menu: MenuNode[];
}

export function MobileNav({ menu }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Закрываем drawer при переходе на другую страницу.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (menu.length === 0) return null;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Открыть меню">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-72 flex-col gap-0 p-0 sm:w-80">
        <SheetHeader className="border-b border-border/60 px-6 py-4 text-left">
          <SheetTitle className="text-sm font-semibold uppercase tracking-widest">
            Навигация
          </SheetTitle>
          <SheetDescription className="sr-only">
            Основное меню сайта
          </SheetDescription>
        </SheetHeader>
        <nav aria-label="Мобильное меню" className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-1">
            {menu.map((node, index) => (
              <li key={nodeKey(node, index)}>
                {node.kind === 'group' ? (
                  <MobileGroup node={node} pathname={pathname} />
                ) : (
                  <MobileLeafLink leaf={node} pathname={pathname} />
                )}
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function MobileGroup({
  node,
  pathname,
}: {
  node: Extract<MenuNode, { kind: 'group' }>;
  pathname: string | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <p className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {node.title}
      </p>
      <ul className="flex flex-col gap-1">
        {node.children.map((child, index) => (
          <li key={nodeKey(child, index)}>
            <MobileLeafLink leaf={child} pathname={pathname} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MobileLeafLink({
  leaf,
  pathname,
}: {
  leaf: MenuLeaf;
  pathname: string | null;
}) {
  const target = leaf.kind === 'link' && leaf.openInNewTab ? '_blank' : undefined;
  const href = leaf.kind === 'page' ? `/${leaf.slug}` : leaf.url;
  const isInternal = isInternalHref(href);
  const isActive = isInternal && pathname === href;

  const linkClass = cn(
    'flex min-h-11 items-center rounded-md px-3 text-base font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
    isActive && 'bg-accent/50 text-accent-foreground',
  );

  if (isInternal && !target) {
    return (
      <Link href={href} className={linkClass} aria-current={isActive ? 'page' : undefined}>
        {leaf.title}
      </Link>
    );
  }
  return (
    <a
      href={href}
      className={linkClass}
      {...(target ? { target, rel: 'noreferrer noopener' } : {})}>
      {leaf.title}
    </a>
  );
}

function isInternalHref(href: string): boolean {
  return href.startsWith('/') || href.startsWith('#') || href.startsWith('?');
}

function nodeKey(node: MenuNode | MenuLeaf, index: number): string {
  if (node.kind === 'page') return `page:${node.slug}`;
  if (node.kind === 'link') return `link:${node.url}:${index}`;
  return `group:${node.title}:${index}`;
}
