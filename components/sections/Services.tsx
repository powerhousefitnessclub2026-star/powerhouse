'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Flame, Sparkles, Dumbbell, BicepsFlexed, HeartPulse, Check, LucideIcon } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { useGymData } from '@/lib/context/GymDataContext';
import { STAGGER_CONTAINER, FADE_IN_UP } from '@/lib/animations/framer';

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Flame,
  Sparkles,
  Dumbbell,
  BicepsFlexed,
  HeartPulse,
};

// Staggered highlight animation — each item slides in from left with delay
const highlightVariants = {
  hidden: { opacity: 0, x: -14 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.09, duration: 0.38, ease: 'easeOut' },
  }),
};

export const Services: React.FC = () => {
  const { services } = useGymData();

  return (
    <section id="services" className="py-20 md:py-24 lg:py-28 bg-[#000000] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          badge="SPECIALIZED TRAINING"
          title="OUR ELITE SERVICES"
          description="Tailored training modalities engineered for fat loss, muscle hypertrophy, metabolic power, and overall athleticism."
        />

        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch"
        >
          {services.map((service) => {
            const IconComponent = ICON_MAP[service.iconName] || Dumbbell;
            const isSpecial = service.id === 'weight-training';

            return (
              <motion.div
                key={service.id}
                variants={FADE_IN_UP}
                className="h-full"
                // 🔴 Red drop-shadow glow on hover — unique energy feel
                whileHover={{
                  filter: isSpecial
                    ? 'drop-shadow(0 0 18px rgba(245,158,11,0.18))'
                    : 'drop-shadow(0 0 18px rgba(220,38,38,0.22))',
                  y: -4,
                }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Card
                  className={`flex flex-col justify-between h-full p-6 sm:p-8 relative overflow-hidden group transition-all duration-500 ${
                    isSpecial
                      ? 'border-amber-500/30 hover:border-amber-500/60 bg-gradient-to-b from-amber-950/15 via-black/80 to-[#080808]/90'
                      : 'hover:border-red-500/40'
                  }`}
                >
                  {/* ✨ Shimmer diagonal sweep on hover */}
                  <div
                    className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]"
                    aria-hidden="true"
                  >
                    <div className="absolute top-0 -left-[110%] w-[60%] h-full skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent group-hover:translate-x-[340%] transition-transform duration-700 ease-in-out" />
                  </div>

                  {/* Large Stylized Background Number */}
                  <span className={`absolute -right-2 -bottom-6 font-heading text-8xl font-black select-none pointer-events-none transition-colors duration-500 ${
                    isSpecial
                      ? 'text-amber-500/5 group-hover:text-amber-500/12'
                      : 'text-white/5 group-hover:text-red-600/12'
                  }`}>
                    {service.number}
                  </span>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      {/* 🔄 Icon spring scale + rotate on hover */}
                      <motion.div
                        whileHover={{ scale: 1.15, rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 14 }}
                        className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-colors duration-300 cursor-pointer ${
                          isSpecial
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 group-hover:bg-amber-500 group-hover:text-black'
                            : 'bg-red-600/10 border-red-500/30 text-red-500 group-hover:bg-red-600 group-hover:text-white'
                        }`}
                      >
                        <IconComponent className="w-7 h-7" />
                      </motion.div>

                      {isSpecial ? (
                        <span className="text-[9px] font-bold tracking-widest text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full uppercase shadow-lg shadow-amber-950/20 animate-pulse">
                          Specialized Program
                        </span>
                      ) : (
                        <span className="font-heading text-2xl font-bold text-neutral-600 tracking-wider group-hover:text-neutral-500 transition-colors duration-300">
                          {service.number}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading text-2xl uppercase font-bold text-white mb-3 tracking-wide">
                      {service.title}
                    </h3>
                    <p className="text-neutral-400 font-sans text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* 📊 Staggered highlights — each ✓ slides in from left with delay */}
                    <div className="space-y-2 border-t border-white/5 pt-4">
                      {service.highlights.map((highlight, idx) => (
                        <motion.div
                          key={idx}
                          custom={idx}
                          variants={highlightVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          className="flex items-center gap-2.5 text-xs text-neutral-300"
                        >
                          <Check className={`w-3.5 h-3.5 shrink-0 ${isSpecial ? 'text-amber-400' : 'text-red-500'}`} />
                          <span>{highlight}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10">
                    <a
                      href="#contact"
                      className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                        isSpecial
                          ? 'text-amber-400 hover:text-amber-300 hover:gap-2'
                          : 'text-white group-hover:text-red-500 hover:gap-2'
                      }`}
                    >
                      Book Session <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </a>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
