'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Dumbbell } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants/navigation';
import { Button } from '@/components/ui/Button';
import { Logo } from '@/components/brand/Logo';
import { useGymData } from '@/lib/context/GymDataContext';
import { formatPowerHouse } from '@/lib/utils/formatPowerHouse';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, activeSection }) => {
  const { gymInfo } = useGymData();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md lg:hidden"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-[#080808]/95 border-l border-white/10 backdrop-blur-2xl p-6 flex flex-col justify-between overflow-y-auto lg:hidden shadow-2xl shadow-red-950/50"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <Logo />
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl bg-white/5 text-neutral-300 hover:text-white hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="mt-8 flex flex-col space-y-2">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.href.replace('#', '');
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`font-heading text-xl uppercase tracking-wider py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-between ${
                        isActive
                          ? 'bg-red-600/20 text-red-500 border border-red-500/30 font-bold'
                          : 'text-neutral-300 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{item.name}</span>
                      {isActive && <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm shadow-red-500" />}
                    </a>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Call-to-Action & Contact */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <a href="#contact" onClick={onClose} className="block w-full">
                <Button variant="primary" fullWidth className="gap-2 text-white font-bold">
                  <Dumbbell className="w-5 h-5 text-amber-400" />
                  <span>Join Power House</span>
                </Button>
              </a>

              <div className="flex items-center justify-center gap-2 text-xs text-neutral-400 font-sans">
                <Phone className="w-4 h-4 text-red-500" />
                <span>{gymInfo?.phone}</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
