'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const imageSizes = {
    sm: 'w-9 h-9 md:w-10 md:h-10',
    md: 'w-10 h-10 md:w-11 md:h-11',
    lg: 'w-11 h-11 md:w-12 md:h-12',
  };

  const titleSizes = {
    sm: 'text-base md:text-lg',
    md: 'text-lg md:text-xl',
    lg: 'text-xl md:text-2xl',
  };

  const subSizes = {
    sm: 'text-[9px] md:text-[10px]',
    md: 'text-[10px] md:text-[11px]',
    lg: 'text-[10px] md:text-[11px]',
  };

  return (
    <Link
      href="#hero"
      aria-label="Power House Fitness Club Home"
      className={`inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg p-0.5 ${className}`}
    >
      <div className={`relative ${imageSizes[size]} rounded-full overflow-hidden border border-amber-500/35 group-hover:border-amber-400 transition-colors shadow-lg shadow-amber-950/20 shrink-0`}>
        <Image
          src="/assets/assets/gym-logo-cropped.png"
          alt="Power House Fitness Club Logo"
          fill
          sizes="48px"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col text-left justify-center">
          <span className={`font-heading ${titleSizes[size]} font-bold tracking-wider leading-none uppercase`}>
            <span className="text-red-500">P</span><span className="text-white">OWER </span>
            <span className="text-red-500">H</span><span className="text-white">OUSE</span>
          </span>
          <span className={`${subSizes[size]} font-semibold tracking-widest text-white uppercase leading-tight mt-0.5`}>
            FITNESS CLUB
          </span>
        </div>
      )}
    </Link>
  );
};
