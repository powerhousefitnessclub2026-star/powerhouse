'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Layers, Grid } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Lightbox } from '@/components/ui/Lightbox';
import { GALLERY_ITEMS, GalleryItem } from '@/lib/constants/gym-data';
import { formatPowerHouse } from '@/lib/utils/formatPowerHouse';

const CATEGORIES: GalleryItem['category'][] = ['All', 'Gym Floor', 'Equipment', 'Training'];

export const Gallery: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<GalleryItem['category']>('All');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [viewMode, setViewMode] = useState<'stack' | 'grid'>('stack');
  const [translateXStep, setTranslateXStep] = useState(230);

  useEffect(() => {
    const updateStep = () => {
      if (window.innerWidth < 420) setTranslateXStep(85);
      else if (window.innerWidth < 640) setTranslateXStep(110);
      else if (window.innerWidth < 1024) setTranslateXStep(170);
      else setTranslateXStep(230);
    };
    updateStep();
    window.addEventListener('resize', updateStep);
    return () => window.removeEventListener('resize', updateStep);
  }, []);

  const filteredItems =
    selectedCategory === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  // Reset active index when category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  // Auto-play timer every 2 seconds
  useEffect(() => {
    if (isPaused || viewMode !== 'stack' || filteredItems.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % filteredItems.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [isPaused, filteredItems.length, viewMode]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % filteredItems.length);
  };

  return (
    <section id="gallery" className="py-20 md:py-24 lg:py-28 bg-[#040404] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          badge="FACILITY SHOWCASE"
          title="GYM GALLERY"
          description="Explore our high-performance facility, heavy-duty Olympic rigs, equipment suite, and community."
        />

        {/* Filter Buttons & View Switcher */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-5xl mx-auto">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`font-heading text-xs sm:text-sm uppercase tracking-wider px-4 py-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    isActive
                      ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/30'
                      : 'bg-[#080808]/80 text-neutral-400 border border-white/10 hover:text-white hover:border-red-500/50'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle (Stack vs Grid) */}
          <div className="flex items-center gap-1 bg-[#080808]/80 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('stack')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'stack' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="3D Stack View"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Stack</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-neutral-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>

        {/* 3D STACK CAROUSEL VIEW */}
        <AnimatePresence mode="wait">
          {viewMode === 'stack' ? (
            <motion.div
              key="stack-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="relative my-8 py-6"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* 3D Stack Stage Container */}
              <div className="relative h-[420px] sm:h-[480px] md:h-[520px] w-full flex items-center justify-center perspective-[1200px] overflow-hidden">
                {filteredItems.map((item, index) => {
                  const total = filteredItems.length;
                  // Calculate shortest distance offset around active index
                  let offset = (index - activeIndex) % total;
                  if (offset > total / 2) offset -= total;
                  if (offset < -total / 2) offset += total;

                  const isCenter = offset === 0;
                  const absOffset = Math.abs(offset);

                  // Hide cards outside 3 offsets for performance & clean visuals
                  if (absOffset > 3) {
                    return null;
                  }

                  // Dynamic 3D positioning attributes based on screenshot design
                  const translateX = offset * translateXStep;
                  const scale = 1 - absOffset * 0.15;
                  const rotateY = offset * -15; // 3D cover-flow rotation
                  const zIndex = 30 - absOffset * 10;
                  const opacity = isCenter ? 1 : absOffset === 1 ? 0.75 : absOffset === 2 ? 0.45 : 0.2;

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={false}
                      animate={{
                        x: translateX,
                        scale: scale,
                        rotateY: rotateY,
                        opacity: opacity,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 280,
                        damping: 30,
                        mass: 0.8,
                      }}
                      onClick={() => {
                        if (isCenter) {
                          setActiveItem(item);
                        } else {
                          setActiveIndex(index);
                        }
                      }}
                      className={`absolute w-[230px] sm:w-[320px] md:w-[380px] h-[320px] sm:h-[430px] md:h-[470px] rounded-3xl overflow-hidden cursor-pointer border shadow-2xl ${
                        isCenter
                          ? 'border-red-500/80 shadow-red-950/60 ring-2 ring-red-500/50'
                          : 'border-white/10 hover:border-white/30 shadow-black/80'
                      }`}
                      style={{
                        transformStyle: 'preserve-3d',
                        zIndex: zIndex,
                      }}
                    >
                      {/* Image */}
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 320px, 380px"
                        className="object-cover"
                        priority={isCenter}
                      />
                    </motion.div>
                  );
                })}
              </div>

              {/* Navigation Controls & Indicators below stack */}
              <div className="mt-8 flex flex-col items-center justify-center gap-6">
                {/* Prev / Next Arrows & Dots */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrev}
                    className="p-3 rounded-full bg-[#080808]/90 border border-white/10 text-white hover:border-red-500 hover:bg-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Dots Navigation */}
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#080808]/80 border border-white/10">
                    {filteredItems.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          idx === activeIndex
                            ? 'w-7 bg-red-600 shadow-sm shadow-red-500'
                            : 'w-2.5 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleNext}
                    className="p-3 rounded-full bg-[#080808]/90 border border-white/10 text-white hover:border-red-500 hover:bg-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-lg"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* GRID VIEW OPTION */
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="group relative h-72 rounded-2xl overflow-hidden border border-white/10 bg-[#080808] cursor-pointer shadow-xl shadow-black/60"
                    onClick={() => setActiveItem(item)}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    {/* Hover Info Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-left">
                      <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest mb-1.5 bg-red-600/10 border border-red-500/20 px-2.5 py-0.5 rounded-full w-max">
                        {item.category}
                      </span>
                      <h4 className="font-heading text-base font-bold text-white uppercase tracking-wider leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-neutral-300 font-sans mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        item={activeItem}
        items={filteredItems}
        onClose={() => setActiveItem(null)}
        onNavigate={(newItem) => {
          setActiveItem(newItem);
          const newIdx = filteredItems.findIndex((i) => i.id === newItem.id);
          if (newIdx !== -1) setActiveIndex(newIdx);
        }}
      />
    </section>
  );
};
