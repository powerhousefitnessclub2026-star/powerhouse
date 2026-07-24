'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';
import { CARD_HOVER_VARIANTS } from '@/lib/animations/framer';

export interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  glowOnHover?: boolean;
  featured?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className = '', glowOnHover = true, featured = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={glowOnHover ? CARD_HOVER_VARIANTS : undefined}
        initial="initial"
        whileHover={glowOnHover ? 'hover' : undefined}
        className={cn(
          'h-full rounded-2xl bg-[#080808]/80 backdrop-blur-md border border-white/10 p-6 md:p-8 flex flex-col justify-between transition-colors duration-300 shadow-xl shadow-black/60 relative overflow-hidden group',
          featured ? 'border-red-600/70 shadow-red-950/40 border-glow-red' : 'hover:border-red-500/60',
          className
        )}
        {...props}
      >
        {/* Subtle accent glow line at the top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
