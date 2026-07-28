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
            const isPcosService = service.id === 'weight-training' || service.title.includes('PCOS');

            return (
              <motion.div key={service.id} variants={FADE_IN_UP} className="h-full">
                <Card
                  className={`flex flex-col justify-between h-full p-6 sm:p-8 relative overflow-hidden group transition-all duration-300 ${
                    isPcosService
                      ? 'border-amber-500/30 hover:border-amber-400 bg-gradient-to-b from-amber-950/15 via-black/80 to-[#080808]/90'
                      : ''
                  }`}
                >
                  {/* Large Stylized Background Number */}
                  <span className={`absolute -right-2 -bottom-6 font-heading text-8xl font-black select-none pointer-events-none transition-colors duration-500 ${
                    isPcosService
                      ? 'text-amber-500/5 group-hover:text-amber-500/10'
                      : 'text-white/5 group-hover:text-red-600/10'
                  }`}>
                    {service.number}
                  </span>

                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 ${
                        isPcosService
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 group-hover:bg-amber-500 group-hover:text-black'
                          : 'bg-red-600/10 border-red-500/30 text-red-500 group-hover:bg-red-600 group-hover:text-white'
                      }`}>
                        <IconComponent className={`w-7 h-7 ${isPcosService ? 'text-amber-400' : ''}`} />
                      </div>
                      {isPcosService ? (
                        <span className="text-[9px] font-bold tracking-widest text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full uppercase shadow-lg shadow-amber-950/20 animate-pulse">
                          Specialized Program
                        </span>
                      ) : (
                        <span className="font-heading text-2xl font-bold text-neutral-600 tracking-wider">
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

                    {/* Highlights */}
                    <div className="space-y-2 border-t border-white/5 pt-4">
                      {service.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-center gap-2.5 text-xs text-neutral-300">
                          <Check className={`w-3.5 h-3.5 shrink-0 ${isPcosService ? 'text-amber-400' : 'text-red-500'}`} />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10">
                    <a
                      href="#contact"
                      className={`inline-flex items-center text-xs font-bold uppercase tracking-widest transition-colors ${
                        isPcosService
                          ? 'text-amber-400 hover:text-amber-300'
                          : 'text-white group-hover:text-red-500'
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
