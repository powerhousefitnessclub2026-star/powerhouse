'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FADE_IN_UP } from '@/lib/animations/framer';
import { formatPowerHouse } from '@/lib/utils/formatPowerHouse';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  description,
  className = '',
}) => {
  return (
    <motion.div
      variants={FADE_IN_UP}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`text-center max-w-3xl mx-auto mb-12 md:mb-16 ${className}`}
    >
      {badge && (
        <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-500 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-3 sm:mb-4 shadow-sm">
          {formatPowerHouse(badge)}
        </span>
      )}
      <h2 className="font-heading text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white leading-tight sm:leading-none">
        {formatPowerHouse(title)}
      </h2>
      <div className="w-12 sm:w-16 h-1 bg-red-600 mx-auto my-3 sm:my-4 rounded-full" />
      {description && (
        <p className="text-xs sm:text-base md:text-lg text-neutral-300 font-sans leading-relaxed max-w-2xl mx-auto px-2">
          {formatPowerHouse(description)}
        </p>
      )}
    </motion.div>
  );
};
