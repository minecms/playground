'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationMenu as NavigationMenuPrimitive } from 'radix-ui';
import { ChevronDown } from '@/components/icons';
import { SlidingText } from '@/components/motion/sliding-text';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import type { MenuLeaf, MenuNode } from '@/lib/menu';

interface NavProps {
  menu: MenuNode[];
}

// motion.create оборачивает любой React-компонент, прокидывая motion-пропсы
// (initial/whileHover/variants) в корневой DOM-элемент компонента.
const MotionLink = motion.create(Link);

export function Nav({ menu }: NavProps) {
  if (menu.length === 0) return null;

  return (
    <NavigationMenu>
      <NavigationMenuList>
        {menu.map((node, index) => (
          <NavigationMenuItem key={nodeKey(node, index)}>
            {node.kind === 'group' ? <NavGroup node={node} /> : <NavLeafLink leaf={node} />}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function NavGroup({ node }: { node: Extract<MenuNode, { kind: 'group' }> }) {
  return (
    <>
      <NavigationMenuPrimitive.Trigger asChild>
        <motion.button
          type="button"
          initial="initial"
          whileHover="hovered"
          className={cnTrigger}>
          <SlidingText>{node.title}</SlidingText>
          <ChevronDown
            aria-hidden="true"
            className="relative top-px ml-1 size-3 transition duration-300 group-data-[state=open]:rotate-180"
          />
        </motion.button>
      </NavigationMenuPrimitive.Trigger>
      <NavigationMenuContent>
        <ul className="grid w-56 gap-1 p-2">
          {node.children.map((child, index) => (
            <li key={nodeKey(child, index)}>
              <NavLeafLink leaf={child} />
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </>
  );
}

function NavLeafLink({ leaf }: { leaf: MenuLeaf }) {
  const pathname = usePathname();
  const target = leaf.kind === 'link' && leaf.openInNewTab ? '_blank' : undefined;
  const href = leaf.kind === 'page' ? `/${leaf.slug}` : leaf.url;
  const isInternal = isInternalHref(href);
  const isActive = isInternal && pathname === href;
  const ariaCurrent = isActive ? ('page' as const) : undefined;

  // Внутренний URL без открытия в новой вкладке → Next Link
  // (client-side навигация, prefetch, без full reload).
  if (isInternal && !target) {
    return (
      <NavigationMenuLink
        asChild
        active={isActive}
        className={navigationMenuTriggerStyle()}>
        <MotionLink
          href={href}
          aria-current={ariaCurrent}
          initial="initial"
          whileHover="hovered">
          <SlidingText>{leaf.title}</SlidingText>
        </MotionLink>
      </NavigationMenuLink>
    );
  }

  // Внешний URL или target="_blank" → нативный <a>.
  return (
    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
      <motion.a
        href={href}
        initial="initial"
        whileHover="hovered"
        {...(target ? { target, rel: 'noreferrer noopener' } : {})}>
        <SlidingText>{leaf.title}</SlidingText>
      </motion.a>
    </NavigationMenuLink>
  );
}

// Internal — root-relative path (`/...`), anchor (`#...`) или query (`?...`).
// Внешним считаем всё с протоколом/доменом, mailto:, tel: и т.д.
function isInternalHref(href: string): boolean {
  return href.startsWith('/') || href.startsWith('#') || href.startsWith('?');
}

// Один источник pill-стиля для group-trigger: тот же, что и у link-pill.
const cnTrigger = `${navigationMenuTriggerStyle()} group`;

function nodeKey(node: MenuNode | MenuLeaf, index: number): string {
  if (node.kind === 'page') return `page:${node.slug}`;
  if (node.kind === 'link') return `link:${node.url}:${index}`;
  return `group:${node.title}:${index}`;
}
