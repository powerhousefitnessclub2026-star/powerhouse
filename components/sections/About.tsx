'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Target, Compass, Trophy, CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FADE_IN_UP } from '@/lib/animations/framer';

import { formatPowerHouse } from '@/lib/utils/formatPowerHouse';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-24 lg:py-28 bg-[#000000] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <SectionHeader
          badge="OUR LEGACY"
          title="ABOUT POWER HOUSE FITNESS CLUB"
          description="We exist to forge athletes, transform lifestyles, and build an uncompromising fitness culture."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image Asset */}
          <div className="space-y-6">
            <motion.div
              variants={FADE_IN_UP}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-red-950/20 group"
            >
              <div className="relative h-[400px] sm:h-[500px] w-full">
                <Image
                  src="/assets/assets/group-photo.jpg"
                  alt="Power House Gym Athletes and Community"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              </div>
            </motion.div>

            {/* Badge (Outside Photo) */}
            <motion.div
              variants={FADE_IN_UP}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="p-6 rounded-xl bg-[#080808]/90 border border-white/10 flex items-center justify-center gap-4 shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="font-heading text-xl uppercase font-bold text-white">{formatPowerHouse('POWER HOUSE COMMUNITY')}</p>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Content */}
          <motion.div
            variants={FADE_IN_UP}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="space-y-8 text-left"
          >
            <div className="space-y-4">
              <h3 className="font-heading text-3xl sm:text-4xl uppercase font-bold text-white">
                FORGED IN DEDICATION, DRIVEN BY RESULTS
              </h3>
              <p className="text-neutral-300 font-sans leading-relaxed">
                {formatPowerHouse('Founded with a vision to redefine urban fitness, Power House Fitness Club is more than a gym — it is a sanctuary for high performance. Whether you aim to lose body fat, build lean muscle mass, master powerlifting, or undergo a complete lifestyle metamorphosis, our state-of-the-art facility provides the perfect ecosystem.')}
              </p>
            </div>

            {/* Founder Highlight Card */}
            <motion.div
              variants={FADE_IN_UP}
              whileHover={{ scale: 1.02, borderColor: 'rgba(239, 68, 68, 0.8)', boxShadow: '0 20px 25px -5px rgba(220, 38, 38, 0.2)' }}
              transition={{ duration: 0.3 }}
              className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-950/40 via-[#0a0a0a] to-[#080808] border border-red-500/40 text-left relative overflow-hidden shadow-xl shadow-red-950/20 cursor-default"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">
                    FOUNDER
                  </span>
                  <h4 className="font-heading text-2xl uppercase font-black text-white tracking-wide">
                    Vijay Karthik
                  </h4>
                </div>
                <span className="px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-bold uppercase tracking-wider shrink-0 shadow-sm">
                  Tamilaga Vetri Kazhagam (TVK)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-300 font-sans leading-relaxed">
                Building this fitness legacy together with his brothers.
              </p>
            </motion.div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-[#080808]/80 border border-white/10 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-600/20 text-red-500">
                    <Target className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading text-lg uppercase font-bold text-white">Our Mission</h4>
                </div>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                  To deliver science-backed training, uncompromised equipment, and continuous mentorship to empower every member.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#080808]/80 border border-white/10 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-600/20 text-red-500">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="font-heading text-lg uppercase font-bold text-white">Our Vision</h4>
                </div>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                  To be the benchmark luxury fitness destination recognized for transformation excellence and athlete development.
                </p>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3 pt-2">
              {[
                'State-of-the-art bio-mechanical strength & cardio machines',
                'Unisex high-energy environment built for all fitness levels',
                'Certified personal coaches with customized nutrition plans',
                'Dedicated CrossFit functional rigs & heavy lifting platforms',
              ].map((point, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-neutral-300">
                  <CheckCircle2 className="w-5 h-5 text-red-500 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
