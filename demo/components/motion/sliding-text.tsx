'use client';

import { motion, type Transition, type Variants, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Двухслойный sliding: верхний слой уезжает вверх, нижний дубль въезжает снизу.
// Низкий damping даёт лёгкий перелёт на коротком ходе.
// `initial` / `whileHover` НЕ задаются здесь — компонент рассчитан на
// variant propagation от родителя (motion(Link) / motion.a / motion.button),
// чтобы наведение на всю «кнопку» (вместе с паддингом) запускало анимацию,
// а не только наведение на сам текст.
const SPRING: Transition = { type: 'spring', stiffness: 340, damping: 13, mass: 0.58 };
const OVERSHOOT = '128%';

const variantsTop: Variants = {
  initial: { y: 0 },
  hovered: { y: `-${OVERSHOOT}` },
};

const variantsBottom: Variants = {
  initial: { y: OVERSHOOT },
  hovered: { y: 0 },
};

export interface SlidingTextProps {
  children: ReactNode;
  className?: string;
}

export function SlidingText({ children, className }: SlidingTextProps) {
  const reduced = useReducedMotion();

  // Уважаем prefers-reduced-motion: для пользователей с этой настройкой
  // отдаём статичный текст без эффекта.
  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={cn('relative inline-block overflow-hidden whitespace-nowrap', className)}>
      <motion.span variants={variantsTop} transition={SPRING} className="block">
        {children}
      </motion.span>
      <motion.span
        aria-hidden="true"
        variants={variantsBottom}
        transition={SPRING}
        className="absolute inset-0 block">
        {children}
      </motion.span>
    </span>
  );
}
