'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, X, ShieldAlert } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = true, size = 'md' }) => {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (clickCount >= 5) {
      setClickCount(0);
      
      // Detect Chrome browser client-side
      const ua = typeof window !== 'undefined' ? window.navigator.userAgent : '';
      const isChrome = /Chrome|CriOS/.test(ua) && !/Edge|Edg|OPR|Chromium|Vivaldi|YaBrowser/.test(ua);
      
      if (isChrome) {
        setShowModal(true);
      } else {
        // Keep it completely silent/hidden on non-Chrome browsers
        console.log("Admin entry attempt rejected: Access restricted to Google Chrome.");
      }
    }
    
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 2000);

    return () => clearTimeout(timer);
  }, [clickCount]);

  const handleLogoClick = () => {
    setClickCount((prev) => prev + 1);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    const input = emailInput.trim().toLowerCase();
    let allowed = ['powerhouse', 'powerhousefitnessclub2026@gmail.com', 'akalyakrish14@gmail.com'];
    if (process.env.NEXT_PUBLIC_AUTHORIZED_EMAILS) {
      allowed = process.env.NEXT_PUBLIC_AUTHORIZED_EMAILS.split(',').map((item) => item.trim().toLowerCase());
    }

    if (allowed.includes(input)) {
      // Set the temporary session cookie (valid for 5 minutes/300 seconds)
      document.cookie = "admin-allowed-session=true; path=/; max-age=300; SameSite=Strict";
      setShowModal(false);
      setEmailInput('');
      router.push('/admin');
    } else {
      setErrorMsg('Access denied: Unauthorized email or key.');
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEmailInput('');
    setErrorMsg('');
  };

  const imageSizes = {
    sm: 'w-9 h-9 md:w-10 md:h-10',
    md: 'w-10 h-10 md:w-11 md:h-11',
    lg: 'w-11 h-11 md:w-12 md:h-12',
  };

  const titleSizes = {
    sm: 'text-base md:text-lg',
    md: 'text-lg md:text-xl',
    lg: 'text-xl md:text-2xl',
  };

  const subSizes = {
    sm: 'text-[9px] md:text-[10px]',
    md: 'text-[10px] md:text-[11px]',
    lg: 'text-[10px] md:text-[11px]',
  };

  return (
    <>
      <Link
        href="#hero"
        onClick={handleLogoClick}
        aria-label="Power House Fitness Club Home"
        className={`inline-flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-lg p-0.5 ${className}`}
      >
        <div className={`relative ${imageSizes[size]} rounded-full overflow-hidden border border-amber-500/35 group-hover:border-amber-400 transition-colors shadow-lg shadow-amber-950/20 shrink-0`}>
          <Image
            src="/assets/assets/gym-logo-cropped.png"
            alt="Power House Fitness Club Logo"
            fill
            sizes="48px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
          />
        </div>
        {showText && (
          <div className="flex flex-col text-left justify-center">
            <span className={`font-heading ${titleSizes[size]} font-bold tracking-wider leading-none uppercase`}>
              <span className="text-red-500">P</span><span className="text-white">OWER </span>
              <span className="text-red-500">H</span><span className="text-white">OUSE</span>
            </span>
            <span className={`${subSizes[size]} font-semibold tracking-widest text-white uppercase leading-tight mt-0.5`}>
              FITNESS CLUB
            </span>
          </div>
        )}
      </Link>

      {/* Beautiful Admin Prompt Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_-12px_rgba(245,158,11,0.25)] transition-all transform scale-100">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/5 transition-all"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Icon & Title */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 mb-3 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                <Lock className="w-5 h-5 animate-pulse" />
              </div>
              <h3 className="font-heading text-2xl font-bold uppercase tracking-wider text-amber-500">
                Admin Verification
              </h3>
              <p className="text-neutral-400 text-xs mt-1">
                Enter authorized email or access key to unlock the admin panel
              </p>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/35 text-red-400 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Verification Form */}
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="Enter email or access key"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#121212] border border-white/10 text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors text-sm"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white font-medium text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold uppercase tracking-wider text-sm transition-all shadow-lg shadow-amber-500/10"
                >
                  Verify & Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
