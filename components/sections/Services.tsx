'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Zap, Flame, Sparkles, Dumbbell, BicepsFlexed, HeartPulse, Check, LucideIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card } from '@/components/ui/Card';
import { useGymData } from '@/lib/context/GymDataContext';

const ICON_MAP: Record<string, LucideIcon> = {
  Zap,
  Flame,
  Sparkles,
  Dumbbell,
  BicepsFlexed,
  HeartPulse,
};

interface ServiceCardProps {
  service: {
    id: string;
    number: string;
    title: string;
    description: string;
    iconName: string;
    highlights: string[];
  };
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const IconComponent = ICON_MAP[service.iconName] || Dumbbell;
  const cardRef = useRef<HTMLDivElement>(null);

  // Mouse position values for 3D Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for fluid physics
  const mouseX = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 300, damping: 25 });

  // Map mouse position to 3D Rotation (-8 deg to +8 deg)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-8deg', '8deg']);

  // Spotlight radial gradient positioning
  const spotlightX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%']);
  const spotlightY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseXPos = (e.clientX - rect.left) / width - 0.5;
    const mouseYPos = (e.clientY - rect.top) / height - 0.5;

    x.set(mouseXPos);
    y.set(mouseYPos);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
      className="h-full group cursor-pointer w-[320px] sm:w-[360px] md:w-[380px] shrink-0 select-none"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="h-full"
      >
        <Card
          className={`flex flex-col justify-between h-full p-6 sm:p-8 relative overflow-hidden transition-all duration-300 ${
            service.id === 'powerlifting'
              ? 'border-amber-500/40 hover:border-amber-400 bg-gradient-to-b from-amber-950/25 via-black/90 to-[#080808]/90 shadow-2xl shadow-amber-950/30'
              : 'hover:border-red-500/60'
          }`}
        >
          {/* Dynamic Spotlight Effect following cursor */}
          <motion.div
            className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
            style={{
              background: `radial-gradient(500px circle at ${spotlightX} ${spotlightY}, ${
                service.id === 'powerlifting'
                  ? 'rgba(245, 158, 11, 0.18)'
                  : 'rgba(239, 68, 68, 0.15)'
              }, transparent 40%)`,
            }}
          />

          {/* Large Stylized Background Number floating in 3D */}
          <span
            style={{ transform: 'translateZ(20px)' }}
            className={`absolute -right-2 -bottom-6 font-heading text-8xl font-black select-none pointer-events-none transition-colors duration-500 ${
              service.id === 'powerlifting'
                ? 'text-amber-500/10 group-hover:text-amber-500/25'
                : 'text-white/5 group-hover:text-red-600/15'
            }`}
          >
            {service.number}
          </span>

          <div style={{ transform: 'translateZ(40px)' }}>
            <div className="flex items-center justify-between mb-6">
              <div
                className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 shadow-lg ${
                  service.id === 'powerlifting'
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 group-hover:bg-amber-500 group-hover:text-black group-hover:shadow-amber-500/40'
                    : 'bg-red-600/10 border-red-500/30 text-red-500 group-hover:bg-red-600 group-hover:text-white group-hover:shadow-red-600/40'
                }`}
              >
                <IconComponent className={`w-7 h-7 ${service.iconName === 'Dumbbell' ? 'text-amber-400 group-hover:text-black' : ''}`} />
              </div>
              {service.id === 'powerlifting' ? (
                <span className="text-[9px] font-bold tracking-widest text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full uppercase shadow-lg shadow-amber-950/20 animate-pulse">
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
            <p className="text-neutral-400 font-sans text-sm leading-relaxed mb-6 line-clamp-3">
              {service.description}
            </p>

            {/* Highlights */}
            <div className="space-y-2 border-t border-white/5 pt-4">
              {service.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-xs text-neutral-300">
                  <Check className={`w-3.5 h-3.5 shrink-0 ${service.id === 'powerlifting' ? 'text-amber-400' : 'text-red-500'}`} />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ transform: 'translateZ(30px)' }} className="pt-6 mt-6 border-t border-white/10">
            <a
              href="#contact"
              className={`inline-flex items-center text-xs font-bold uppercase tracking-widest transition-transform group-hover:translate-x-1 ${
                service.id === 'powerlifting'
                  ? 'text-amber-400 hover:text-amber-300'
                  : 'text-white group-hover:text-red-500'
              }`}
            >
              Book Session →
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export const Services: React.FC = () => {
  const { services } = useGymData();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Scroll controls
  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -380, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 380, behavior: 'smooth' });
    }
  };

  // Continuous Auto-Scroll Effect
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        // Reset to start if reached end
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 1.5, behavior: 'auto' });
        }
      }
    }, 20);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Duplicate services to create a long seamless track
  const extendedServices = [...services, ...services];

  return (
    <section id="services" className="py-20 md:py-24 lg:py-28 bg-[#000000] relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <SectionHeader
            badge="SPECIALIZED TRAINING"
            title="OUR ELITE SERVICES"
            description="Tailored training modalities engineered for fat loss, muscle hypertrophy, metabolic power, and overall athleticism."
          />

          {/* Carousel Navigation Buttons */}
          <div className="flex items-center gap-3 mt-6 md:mt-0">
            <button
              onClick={scrollLeft}
              className="p-3 rounded-full border border-white/10 bg-black/60 text-white hover:border-amber-500 hover:text-amber-400 transition-all duration-300"
              aria-label="Previous service"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="p-3 rounded-full border border-white/10 bg-black/60 text-white hover:border-amber-500 hover:text-amber-400 transition-all duration-300"
              aria-label="Next service"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Auto-moving Horizontal Carousel Track */}
      <div
        ref={carouselRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex gap-6 overflow-x-auto scrollbar-none px-6 lg:px-12 py-4 scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {extendedServices.map((service, index) => (
          <ServiceCard key={`${service.id}-${index}`} service={service} />
        ))}
      </div>
    </section>
  );
};
