import Link from 'next/link';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Nav } from '@/components/layout/nav';
import type { MenuNode } from '@/lib/menu';

interface HeaderProps {
  menu: MenuNode[];
}

export function Header({ menu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:gap-6 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-widest text-foreground no-underline transition-colors hover:text-foreground/80">
          MineCMS · Demo
        </Link>
        <div className="hidden md:block">
          <Nav menu={menu} />
        </div>
        <MobileNav menu={menu} />
      </div>
    </header>
  );
}
