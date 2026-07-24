'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, className = '', fullWidth = false, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-heading tracking-wider uppercase font-bold rounded-xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary:
        'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/30 hover:shadow-red-600/50 border border-red-500/50',
      secondary:
        'bg-neutral-900/90 text-white hover:bg-neutral-800 border border-white/10 hover:border-red-500/50 shadow-md',
      outline:
        'bg-transparent text-white border border-white/20 hover:border-red-500 hover:bg-red-500/10 shadow-sm',
      ghost: 'bg-transparent text-neutral-300 hover:text-white hover:bg-white/5',
    };

    const sizes = {
      sm: 'text-sm py-2 px-4 gap-2',
      md: 'text-base py-3 px-6 gap-2.5',
      lg: 'text-lg py-4 px-8 gap-3',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={cn(baseStyles, variants[variant], sizes[size], fullWidth ? 'w-full' : '', className)}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
