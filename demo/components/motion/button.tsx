'use client';

import { Slot } from '@radix-ui/react-slot';
import { motion, type HTMLMotionProps, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';

export type MotionButtonProps = HTMLMotionProps<'button'> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

const HOVER = { scale: 1.02, y: -1 } as const;
const TAP = { scale: 0.97 } as const;
const SPRING = { type: 'spring' as const, stiffness: 420, damping: 26, mass: 0.6 };

export function MotionButton({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: MotionButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const reduced = useReducedMotion();
  const motionProps = reduced ? {} : { whileHover: HOVER, whileTap: TAP };

  if (asChild) {
    return (
      <motion.span className="inline-flex" {...motionProps} transition={SPRING}>
        <Slot data-slot="motion-button" className={classes}>
          {props.children as ReactNode}
        </Slot>
      </motion.span>
    );
  }

  return (
    <motion.button
      data-slot="motion-button"
      className={classes}
      {...motionProps}
      transition={SPRING}
      {...props}
    />
  );
}
