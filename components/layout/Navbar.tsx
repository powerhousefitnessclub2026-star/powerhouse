'use client';

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/constants/navigation';
import { Logo } from '@/components/brand/Logo';
import { Button } from '@/components/ui/Button';
import { MobileDrawer } from '@/components/layout/MobileDrawer';
import { MusicPlayer } from '@/components/ui/MusicPlayer';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section scroll spy
      const sections = NAV_ITEMS.map((item) => item.href.replace('#', ''));
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#000000]/90 backdrop-blur-xl border-b border-white/10 py-2.5 shadow-2xl shadow-black/90'
            : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Left */}
          <Logo size="sm" />

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-[#080808]/85 backdrop-blur-md px-4 py-1 rounded-full border border-white/10 shadow-lg shadow-black/50">
            {NAV_ITEMS.map((item) => {
              const sectionId = item.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`relative font-heading uppercase text-xs xl:text-xs tracking-wider px-3 py-1 rounded-full transition-all duration-200 ${
                    isActive ? 'text-red-500 font-bold bg-white/5' : 'text-neutral-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3.5 h-0.5 bg-red-500 rounded-full shadow-sm shadow-red-500" />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Right CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <MusicPlayer />
            <a href="#membership">
              <Button variant="primary" size="sm" className="px-4 py-1.5 text-xs font-bold tracking-wider">
                Join Now
              </Button>
            </a>
          </div>

          {/* Mobile Menu Toggle Button & Music Player */}
          <div className="flex items-center gap-3 lg:hidden">
            <MusicPlayer />
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="p-2 rounded-xl bg-[#080808]/80 border border-white/10 text-white hover:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        activeSection={activeSection}
      />
    </>
  );
};
