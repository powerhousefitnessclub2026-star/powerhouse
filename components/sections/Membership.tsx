'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Dumbbell, Sparkles, ShieldCheck, Flame, Zap } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useGymData } from '@/lib/context/GymDataContext';
import { STAGGER_CONTAINER, FADE_IN_UP } from '@/lib/animations/framer';
import { formatPowerHouse } from '@/lib/utils/formatPowerHouse';

export const Membership: React.FC = () => {
  const { membershipPlans, gymInfo } = useGymData();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'strength' | 'cardio'>('all');

  return (
    <section id="membership" className="py-20 md:py-24 lg:py-28 bg-[#040404] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="OFFICIAL SUBSCRIPTION PLANS"
          title="MEMBERSHIP PACKAGES"
          description="Flexible, transparent membership plans designed for every fitness goal. One-time Admission Fee: ₹500 across all tiers."
        />

        {/* Admission Fee & Timings Banner */}
        <motion.div
          variants={FADE_IN_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-12 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-red-950/50 via-red-900/30 to-red-950/50 border border-red-500/50 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-red-950/40"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500/60 flex items-center justify-center text-red-500 shrink-0 shadow-lg">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <p className="font-heading text-xl uppercase font-bold text-white leading-tight">
                ADMISSION FEE: {gymInfo.admissionFee} ONLY
              </p>
              <p className="text-xs sm:text-sm text-neutral-300 font-sans mt-0.5">
                One-time registration fee applies to all subscription packages.
              </p>
            </div>
          </div>
          <a href="#contact">
            <Button variant="primary" size="sm" className="shrink-0 px-6 py-2 text-xs font-bold uppercase tracking-wider">
              Claim Admission Offer
            </Button>
          </a>
        </motion.div>

        {/* OFFICIAL PRICING TABLE (MATCHING FLYER LAYOUT) */}
        <motion.div
          variants={FADE_IN_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden border border-white/10 bg-[#080808]/90 shadow-2xl shadow-black/80 backdrop-blur-xl"
        >
          <div className="bg-gradient-to-r from-amber-950/80 via-neutral-900/90 to-amber-950/80 p-5 text-center border-b border-amber-500/30 flex flex-col items-center justify-center gap-2.5">
            <h3 className="font-heading text-xl sm:text-2xl uppercase font-black text-amber-400 tracking-wider flex items-center justify-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 animate-pulse" />
              OFFICIAL SUBSCRIPTION RATE CARD
            </h3>
            <span className="font-heading text-xs sm:text-sm font-extrabold text-cyan-400 tracking-[0.2em] uppercase bg-neutral-950 px-5 py-1.5 rounded-full border border-cyan-400/50 flex items-center gap-1.5 shadow-lg shadow-black/50">
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              CARDIO + STRENGTH
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#121212] border-b border-white/10 font-heading text-[10px] sm:text-sm uppercase tracking-wider text-neutral-300">
                  <th className="py-3 px-3 sm:py-4 sm:px-6 font-bold text-white whitespace-nowrap">PACKAGES</th>
                  <th className="py-3 px-3 sm:py-4 sm:px-6 font-bold text-amber-400 text-center whitespace-nowrap">STRENGTH TRAINING</th>
                  <th className="py-3 px-3 sm:py-4 sm:px-6 font-bold text-cyan-400 text-center whitespace-nowrap">CARDIO + STRENGTH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-sans text-xs sm:text-base">
                {membershipPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-3 sm:py-4 sm:px-6 font-heading font-bold text-white whitespace-nowrap">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span>{plan.name}</span>
                        {plan.badge && (
                          <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold uppercase rounded bg-red-600 text-white">
                            {plan.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 sm:py-4 sm:px-6 text-center font-bold text-amber-400 font-heading text-sm sm:text-lg whitespace-nowrap">
                      {plan.strengthPrice}/-
                    </td>
                    <td className="py-3 px-3 sm:py-4 sm:px-6 text-center font-bold text-cyan-400 font-heading text-sm sm:text-lg whitespace-nowrap">
                      {plan.cardioStrengthPrice}/-
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* PACKAGE CARDS GRID */}
        <motion.div
          variants={STAGGER_CONTAINER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
        >
          {membershipPlans.map((plan) => {
            return (
              <motion.div key={plan.id} variants={FADE_IN_UP} className="h-full">
                <Card
                  featured={plan.featured}
                  className={`flex flex-col justify-between h-full p-6 relative ${
                    plan.featured
                      ? 'bg-gradient-to-b from-[#150606] via-[#080808] to-[#080808] border-2 border-red-600 shadow-2xl shadow-red-600/30'
                      : ''
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="mb-5 text-left flex flex-col items-start gap-1">
                      {plan.badge && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-widest shadow-md shadow-red-600/40 mb-1">
                          <Sparkles className="w-3.5 h-3.5 shrink-0 text-white animate-pulse" />
                          {plan.badge}
                        </div>
                      )}
                      <span className="text-xs font-bold text-red-500 uppercase tracking-widest mt-1">
                        {plan.duration}
                      </span>
                      <h3 className="font-heading text-2xl uppercase font-bold text-white mt-1">
                        {plan.name}
                      </h3>
                    </div>

                    {/* Dual Pricing Box */}
                    <div className="mb-6 p-4 rounded-xl bg-[#121212]/90 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-400">Strength Training:</span>
                        <span className="font-heading text-xl font-bold text-amber-400">{plan.strengthPrice}/-</span>
                      </div>
                      <div className="h-px bg-white/10" />
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-300">Cardio + Strength:</span>
                        <span className="font-heading text-xl font-bold text-cyan-400">{plan.cardioStrengthPrice}/-</span>
                      </div>
                    </div>

                    {/* Features Checklist */}
                    <div className="space-y-2.5 mb-6 text-left">
                      <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                        Package Highlights:
                      </p>
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                          <div className="w-4 h-4 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3" />
                          </div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <a href="#contact" className="w-full mt-2">
                    <Button
                      variant={plan.featured ? 'primary' : 'secondary'}
                      fullWidth
                      className="gap-2 py-3 text-xs tracking-wider"
                    >
                      <Dumbbell className="w-4 h-4 text-amber-400" />
                      Select Package
                    </Button>
                  </a>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
