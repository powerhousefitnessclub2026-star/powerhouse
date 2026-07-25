'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Dumbbell, ArrowDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';

import { formatPowerHouse } from '@/lib/utils/formatPowerHouse';
import { useGymData } from '@/lib/context/GymDataContext';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.15,
    },
  },
} as const;

const letterVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 15,
      stiffness: 150,
    },
  },
} as const;

export const Hero: React.FC = () => {
  const { hero } = useGymData();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-black"
    >
      {/* Background Visual Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Fallback Image */}
        <Image
          src="/assets/assets/samplegym/IMG20260719205151.jpg"
          alt="Power House Gym Floor Background"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-30 scale-105 filter contrast-125"
        />
        {/* Background Video */}
        {hero?.videoUrl && (
          <video
            src={hero.videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-55 scale-105 filter contrast-125 pointer-events-none"
          />
        )}
        {/* Dark Vignette & Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-950/20 via-transparent to-black/80" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-red-600/10 border border-red-500/30 text-red-500 text-[10px] xs:text-xs sm:text-sm font-bold tracking-wider sm:tracking-widest uppercase mb-6 sm:mb-8 backdrop-blur-md shadow-lg shadow-red-950/30 max-w-full text-center"
        >
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate sm:whitespace-normal">PREMIUM UNISEX FITNESS GYM • ERODE</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="font-heading text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tight text-white leading-tight sm:leading-none mb-5 max-w-6xl drop-shadow-2xl"
        >
          <span className="inline-block">
            {"POWER".split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className={`inline-block ${index === 0 ? 'text-red-500' : ''}`}
              >
                {char}
              </motion.span>
            ))}
          </span>
          <span className="inline-block w-4 sm:w-6" />
          <span className="inline-block">
            {"HOUSE".split("").map((char, index) => (
              <motion.span
                key={index}
                variants={letterVariants}
                className={`inline-block ${index === 0 ? 'text-red-500' : ''}`}
              >
                {char}
              </motion.span>
            ))}
          </span>
          <br className="hidden sm:inline" />
          <span className="text-white inline-block">
            <span className="inline-block">
              {"FITNESS".split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <span className="inline-block w-4 sm:w-6" />
            <span className="inline-block">
              {"CLUB".split("").map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="inline-block"
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-neutral-300 font-sans max-w-3xl mx-auto leading-relaxed mb-10"
        >
          {formatPowerHouse('Step into Power House Fitness Club. Featuring world-class biomechanical equipment, high-intensity CrossFit rigs, personal transformation blueprints, and master trainer.')}
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full max-w-md"
        >
          <a href="#membership" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" fullWidth className="gap-3 text-lg">
              <Dumbbell className="w-6 h-6 text-amber-400" />
              Join Now
            </Button>
          </a>
          <a href="#contact" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" fullWidth className="text-lg">
              Contact Us
            </Button>
          </a>
        </motion.div>

        {/* Key Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-16 sm:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 w-full max-w-4xl bg-[#080808]/80 backdrop-blur-xl p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl shadow-black/80"
        >
          <div className="text-center">
            <span className="block font-heading text-3xl sm:text-4xl font-bold text-red-500">100%</span>
            <span className="text-xs sm:text-sm text-neutral-400 font-semibold uppercase tracking-wider">Unisex Gym</span>
          </div>
          <div className="text-center">
<span className="block font-heading text-3xl sm:text-4xl font-bold text-white">
  5.0 <span className="text-white">★</span>
</span>
<span className="text-xs sm:text-sm text-neutral-400 font-semibold uppercase tracking-wider">Google Reviews</span>
          </div>
          <div className="text-center">
            <span className="block font-heading text-3xl sm:text-4xl font-bold text-red-500">50</span>
            <span className="text-xs sm:text-sm text-neutral-400 font-semibold uppercase tracking-wider">Transformations</span>
          </div>
          <div className="text-center">
            <span className="block font-heading text-3xl sm:text-4xl font-bold text-white">₹500</span>
            <span className="text-xs sm:text-sm text-neutral-400 font-semibold uppercase tracking-wider">Admission Fee</span>
          </div>
        </motion.div>
      </div>

      {/* Down Arrow */}
      <a
        href="#about"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 p-3 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-red-500 hover:border-red-500 transition-colors animate-bounce"
        aria-label="Scroll to about section"
      >
        <ArrowDown className="w-5 h-5" />
      </a>
    </section>
  );
};
