'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award, Medal, Quote, Dumbbell, Flame, Sparkles, Crown } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TRAINERS } from '@/lib/constants/gym-data';

const floatTrophy = {
  animate: {
    y: [0, -8, 0],
    scale: [1, 1.05, 1],
    transition: {
      duration: 3.5,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const pulseGlow = {
  animate: {
    opacity: [0.3, 0.7, 0.3],
    scale: [0.95, 1.05, 0.95],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  },
};

const accoladesContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const accoladeItem = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 280,
      damping: 22,
    },
  },
};

export const Trainers: React.FC = () => {
  const trainer = TRAINERS[0]; // Trainer Harish

  return (
    <section id="trainers" className="py-16 md:py-20 bg-[#000000] relative overflow-hidden">
      {/* Mass Background Golden Spotlight Radial Glow */}
      <motion.div
        variants={pulseGlow}
        animate="animate"
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none z-0"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="HEAD COACH & CHAMPION"
          title="MEET OUR TRAINER"
          description="Guided by proven competitive excellence, discipline, and national powerlifting championship form."
        />

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="max-w-4xl mx-auto"
        >
          <Card glowOnHover={false} className="p-5 sm:p-8 md:p-10 relative bg-gradient-to-b from-[#181206]/95 via-[#0c0a08]/95 to-[#080808] border-2 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.2)] rounded-3xl backdrop-blur-xl group hover:border-amber-400 transition-all duration-500">
            {/* Top Mass Crown Badge with Pulsing Ring */}
            <div className="flex flex-col items-center text-center mb-6 relative">
              <motion.div
                variants={floatTrophy}
                animate="animate"
                className="relative mb-3 cursor-pointer"
              >
                {/* Glowing Aura Ring */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-600 to-yellow-400 blur-md opacity-70 animate-pulse" />

                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600/40 via-amber-500/20 to-black border-2 border-amber-500/60 flex items-center justify-center text-amber-400 shadow-2xl shadow-amber-950/80">
                  <Crown className="w-8 h-8 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute top-0.5 right-0.5 animate-ping" />
                </div>
              </motion.div>

              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-600/30 via-amber-600/20 to-amber-600/30 border border-amber-500/50 text-amber-300 text-xs font-black uppercase tracking-widest mb-2 shadow-lg shadow-amber-950/60 flex items-center gap-2"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                {trainer.role}
              </motion.span>

              <h3 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-neutral-200 drop-shadow-md mb-1">
                {trainer.name}
              </h3>
            </div>

            {/* Quote Block with Animated Subtle Glow */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative p-5 sm:p-6 rounded-2xl bg-[#120e08]/90 border border-amber-500/20 mb-6 text-center max-w-2xl mx-auto shadow-inner group-hover:border-amber-500/40 transition-colors"
            >
              <Quote className="w-6 h-6 text-amber-500/50 mx-auto mb-1 rotate-180" />
              <p className="font-sans text-sm sm:text-base italic font-medium text-neutral-200 leading-relaxed">
                &ldquo;{trainer.quote}&rdquo;
              </p>
            </motion.div>

            {/* Accolades & Achievements Grid with Sequential Mass Stagger */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-center gap-3">
                <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-amber-500/40" />
                <h4 className="font-heading text-base sm:text-lg uppercase font-extrabold text-white tracking-wider text-center flex items-center justify-center gap-2">
                  <Award className="w-4.5 h-4.5 text-amber-400 animate-pulse" />
                  Championship Accolades & Honors
                </h4>
                <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-amber-500/40" />
              </div>

              <motion.div
                variants={accoladesContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3"
              >
                {trainer.accolades.map((accolade, idx) => (
                  <motion.div
                    key={idx}
                    variants={accoladeItem}
                    whileHover={{ scale: 1.02, x: 2 }}
                    className="p-3 rounded-xl bg-[#0a0806]/95 border border-white/5 hover:border-amber-500/50 hover:bg-gradient-to-r hover:from-amber-950/30 hover:to-[#0a0806] transition-all duration-300 flex items-start gap-2.5 text-left group/item shadow-md cursor-pointer"
                  >
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5 group-hover/item:bg-amber-500 group-hover/item:text-black transition-colors duration-300 shadow-sm">
                      <Medal className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-sans text-[11px] sm:text-xs font-semibold text-neutral-200 group-hover/item:text-white transition-colors leading-snug">
                      {accolade}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* CTA Button with Pulsing Mass Glow */}
            <div className="pt-4 border-t border-white/5 text-center">
              <a href="#contact" className="inline-block w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto gap-2.5 px-8 py-3 text-xs sm:text-sm font-black tracking-widest uppercase bg-amber-500 hover:bg-amber-400 text-black border-amber-400/50 hover:border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Dumbbell className="w-5 h-5 text-black animate-pulse" />
                  BOOK PERSONAL TRAINING WITH COACH HARISH
                </Button>
              </a>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
