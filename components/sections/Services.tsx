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

export const Services: React.FC = () => {
  const { services } = useGymData();

  return (
    <section id="services" className="py-16 md:py-24 bg-[#000000] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="SPECIALIZED TRAINING"
          title="OUR ELITE SERVICES"
          description="Tailored training modalities engineered for fat loss, muscle hypertrophy, metabolic power, and overall athleticism."
        />

        {/* Clean Responsive Layout: 1 card per row on mobile, 2 on tablet, 3 on desktop */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch mt-12"
        >
          {services.map((service) => {
            const IconComponent = ICON_MAP[service.iconName] || Dumbbell;
            const isFeatured = service.id === 'powerlifting';

            return (
              <motion.div key={service.id} variants={FADE_IN_UP} className="h-full">
                <Card
                  glowOnHover={false}
                  className={`flex flex-col justify-between h-full p-6 sm:p-8 relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
                    isFeatured
                      ? 'border-amber-500/40 hover:border-amber-400 bg-gradient-to-b from-amber-950/20 via-black/90 to-[#080808]/90 shadow-xl shadow-amber-950/20'
                      : 'border-white/10 hover:border-red-500/60 bg-[#080808]/80'
                  }`}
                >
                  {/* Stylized Background Number */}
                  <span
                    className={`absolute -right-2 -bottom-6 font-heading text-8xl font-black select-none pointer-events-none transition-colors duration-300 ${
                      isFeatured
                        ? 'text-amber-500/10'
                        : 'text-white/5 group-hover:text-red-600/10'
                    }`}
                  >
                    {service.number}
                  </span>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
                          isFeatured
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-red-600/10 border-red-500/30 text-red-500'
                        }`}
                      >
                        <IconComponent className="w-7 h-7" />
                      </div>
                      {isFeatured ? (
                        <span className="text-[9px] font-bold tracking-widest text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full uppercase shadow-md">
                          Featured Program
                        </span>
                      ) : (
                        <span className="font-heading text-2xl font-bold text-neutral-600 tracking-wider">
                          {service.number}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading text-2xl uppercase font-bold text-white mb-3 tracking-wide group-hover:text-amber-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-neutral-400 font-sans text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>

                    {/* Highlights List */}
                    <div className="space-y-2.5 border-t border-white/5 pt-4">
                      {service.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-neutral-300">
                          <Check className={`w-4 h-4 shrink-0 ${isFeatured ? 'text-amber-400' : 'text-red-500'}`} />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10">
                    <a
                      href="#contact"
                      className={`inline-flex items-center text-xs font-bold uppercase tracking-widest transition-all ${
                        isFeatured
                          ? 'text-amber-400 hover:text-amber-300'
                          : 'text-white hover:text-red-500'
                      }`}
                    >
                      Book Session →
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
