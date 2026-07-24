'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Dumbbell,
  Award,
  Zap,
  Flame,
  HeartPulse,
  Activity,
  Gauge,
  ShieldCheck,
  LucideIcon,
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { WHY_CHOOSE_US } from '@/lib/constants/gym-data';
import { STAGGER_CONTAINER, FADE_IN_UP } from '@/lib/animations/framer';

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Dumbbell,
  Award,
  Zap,
  Flame,
  HeartPulse,
  Activity,
  Gauge,
  ShieldCheck,
};

export const WhyChooseUs: React.FC = () => {
  return (
    <section id="why-us" className="py-20 md:py-24 lg:py-28 bg-[#040404] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          badge="UNMATCHED ADVANTAGES"
          title="WHY CHOOSE POWER HOUSE"
          description="Designed to deliver maximum physical output, safety, and continuous progress through elite infrastructure."
        />

        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch"
        >
          {WHY_CHOOSE_US.map((item) => {
            const IconComponent = ICON_MAP[item.iconName] || Dumbbell;
            return (
              <motion.div key={item.id} variants={FADE_IN_UP} className="h-full">
                <Card className="flex flex-col justify-between h-full p-6 sm:p-8">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600/20 to-transparent border border-red-500/30 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                      <IconComponent className={`w-7 h-7 ${item.iconName === 'Dumbbell' ? 'text-amber-400' : ''}`} />
                    </div>
                    <h3 className="font-heading text-2xl uppercase font-bold text-white mb-3 tracking-wide">
                      {item.title}
                    </h3>
                    <p className="text-neutral-400 font-sans text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <div className="pt-6 mt-6 border-t border-white/5 flex items-center text-xs font-semibold text-red-500 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                    <span>Explore Services →</span>
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
