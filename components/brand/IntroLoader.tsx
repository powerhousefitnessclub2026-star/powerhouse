'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export const IntroLoader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Ensure top scroll positioning on page load
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    // Lock body scrolling during intro animation on mobile & desktop
    document.body.style.overflow = 'hidden';

    // Check session storage safely
    try {
      const hasSeen = sessionStorage.getItem('has_seen_powerhouse_intro');
      if (hasSeen) {
        setIsVisible(false);
        document.body.style.overflow = '';
        return;
      }
      sessionStorage.setItem('has_seen_powerhouse_intro', 'true');
    } catch (error) {
      console.warn('Session storage is not available', error);
    }

    // Auto fade out after animation duration (~1.8 seconds)
    const timer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    }, 1800);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = '';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="intro-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[99999] w-screen h-screen h-[100dvh] flex flex-col items-center justify-center bg-black overflow-hidden pointer-events-auto touch-none select-none"
        >
          <div className="relative flex flex-col items-center justify-center p-6 text-center">
            {/* SVG Line Draw Effect around Logo */}
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-5">
              {/* Progressive SVG Circle Line Draw */}
              <svg
                viewBox="0 0 120 120"
                className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none drop-shadow-[0_0_18px_rgba(220,38,38,0.7)]"
              >
                {/* Subtle Background Track */}
                <circle
                  cx="60"
                  cy="60"
                  r="56"
                  fill="none"
                  stroke="#1a1a1a"
                  strokeWidth="2"
                />
                {/* Red Progressive Draw Line */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="56"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
                />
                {/* Inner White Accent Line Draw */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 0.9, delay: 0.3, ease: 'easeInOut' }}
                />
              </svg>

              {/* Logo Emblem Image Progressive Fade & Scale */}
              <motion.div
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border border-amber-500/35 shadow-2xl"
              >
                <Image
                  src="/assets/assets/gym-logo-cropped.png"
                  alt="Power House Fitness Club Logo"
                  fill
                  sizes="120px"
                  className="object-cover"
                  priority
                />
              </motion.div>
            </div>

            {/* Logo Text Progressive Draw & Reveal */}
            <div className="overflow-hidden flex flex-col items-center">
              {/* Title Reveal */}
              <motion.div
                initial={{ clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
                animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
                transition={{ duration: 0.75, delay: 0.55, ease: [0.25, 1, 0.5, 1] }}
                className="font-heading text-2xl sm:text-3xl font-bold tracking-widest uppercase leading-none"
              >
                <span className="text-red-500">P</span><span className="text-white">OWER </span>
                <span className="text-red-500">H</span><span className="text-white">OUSE</span>
              </motion.div>

              {/* Subtitle Reveal */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.95, ease: 'easeOut' }}
                className="text-xs sm:text-sm font-semibold tracking-[0.3em] text-white uppercase mt-1.5"
              >
                FITNESS CLUB
              </motion.div>

              {/* Subtle Bottom Accent Line Sweep */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1.2, delay: 0.2, ease: 'linear' }}
                className="h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent mt-4 w-36 rounded-full opacity-80"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
