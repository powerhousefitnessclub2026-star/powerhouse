'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, RefreshCw, Activity, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FADE_IN_UP } from '@/lib/animations/framer';

interface BMIResult {
  bmi: number;
  category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese';
  color: string;
  description: string;
  recommendation: string;
}

export const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [result, setResult] = useState<BMIResult | null>(null);

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) return;

    // Height in meters
    const heightInMeters = h / 100;
    const bmiVal = parseFloat((w / (heightInMeters * heightInMeters)).toFixed(1));

    let category: BMIResult['category'] = 'Normal';
    let color = 'text-green-500 border-green-500/40 bg-green-950/20';
    let description = 'Optimal body composition balance.';
    let recommendation = 'Focus on progressive strength building and muscle conditioning at Power House.';

    if (bmiVal < 18.5) {
      category = 'Underweight';
      color = 'text-blue-400 border-blue-500/40 bg-blue-950/20';
      description = 'Below average mass index.';
      recommendation = 'Our coaches recommend hypertrophy weight training combined with a high-protein diet.';
    } else if (bmiVal >= 18.5 && bmiVal <= 24.9) {
      category = 'Normal';
      color = 'text-green-500 border-green-500/40 bg-green-950/20';
      description = 'Healthy body mass range.';
      recommendation = 'Maintain your peak condition with CrossFit functional WODs and compound strength rigs.';
    } else if (bmiVal >= 25 && bmiVal <= 29.9) {
      category = 'Overweight';
      color = 'text-red-400 border-red-500/40 bg-red-950/20';
      description = 'Above recommended weight range.';
      recommendation = 'A combination of HIIT metabolic conditioning and tailored caloric deficit will yield rapid results.';
    } else {
      category = 'Obese';
      color = 'text-red-600 border-red-600/60 bg-red-950/40';
      description = 'Significantly elevated mass index.';
      recommendation = 'Work 1-on-1 with Master Coach Harish for structured low-impact cardio & lifestyle change.';
    }

    setResult({
      bmi: bmiVal,
      category,
      color,
      description,
      recommendation,
    });
  };

  const handleReset = () => {
    setHeight('');
    setWeight('');
    setResult(null);
  };

  return (
    <section id="bmi" className="py-20 md:py-24 lg:py-28 bg-[#000000] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="HEALTH & FITNESS METRICS"
          title="BMI CALCULATOR"
          description="Assess your Body Mass Index instantly and receive tailored training recommendations from our master coaches."
        />

        <motion.div
          variants={FADE_IN_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="max-w-4xl mx-auto"
        >
          <Card glowOnHover={false} className="p-4 sm:p-8 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Form Side */}
              <form onSubmit={calculateBMI} className="space-y-6 text-left">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500">
                    <Calculator className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl uppercase font-bold text-white">Enter Your Parameters</h3>
                    <p className="text-xs text-neutral-400">Metric measurements (cm & kg)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="height-input" className="text-sm font-medium text-neutral-300">
                      Height (in cm)
                    </label>
                    <input
                      id="height-input"
                      type="number"
                      placeholder="e.g. 175"
                      min="100"
                      max="230"
                      required
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-[#080808]/90 text-white rounded-xl border border-white/10 px-4 py-3 text-base focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="weight-input" className="text-sm font-medium text-neutral-300">
                      Weight (in kg)
                    </label>
                    <input
                      id="weight-input"
                      type="number"
                      placeholder="e.g. 72"
                      min="30"
                      max="250"
                      required
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-[#080808]/90 text-white rounded-xl border border-white/10 px-4 py-3 text-base focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <Button type="submit" variant="primary" fullWidth className="gap-2">
                    <Activity className="w-5 h-5" />
                    Calculate BMI
                  </Button>
                  {result && (
                    <Button type="button" variant="secondary" onClick={handleReset} className="px-4">
                      <RefreshCw className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              </form>

              {/* Display Result Side */}
              <div className="flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-[#040404] border border-white/10 min-h-[320px] relative overflow-hidden">
                {result ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full space-y-6"
                  >
                    <div>
                      <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                        Your Body Mass Index
                      </span>
                      <div className="font-heading text-6xl md:text-7xl font-bold text-white mt-2">
                        {result.bmi}
                      </div>
                    </div>

                    {/* Glass Category Badge */}
                    <div className={`inline-block px-5 py-2 rounded-full border text-sm font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${result.color}`}>
                      Category: {result.category}
                    </div>

                    <p className="text-sm text-neutral-300 font-sans max-w-sm mx-auto leading-relaxed">
                      {result.recommendation}
                    </p>

                    <a href="#contact" className="inline-flex items-center gap-2 text-xs font-bold text-red-500 uppercase tracking-widest hover:text-white transition-colors">
                      Book Customized Diet & Workout Blueprint <ArrowRight className="w-4 h-4" />
                    </a>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-500 mx-auto">
                      <Calculator className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="font-heading text-xl uppercase font-bold text-neutral-300">
                        Ready To Calculate
                      </h4>
                      <p className="text-xs text-neutral-500 max-w-xs mx-auto font-sans mt-1">
                        Enter your height and weight above to view your BMI score and personalized training recommendation.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
