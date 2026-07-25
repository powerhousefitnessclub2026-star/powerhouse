'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, ChevronRight, Clock, Dumbbell } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { NAV_ITEMS } from '@/lib/constants/navigation';
import { useGymData } from '@/lib/context/GymDataContext';
import { formatPowerHouse } from '@/lib/utils/formatPowerHouse';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const { gymInfo } = useGymData();

  return (
    <footer className="bg-[#040404] border-t border-white/10 text-neutral-400 font-sans pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16 text-left">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <Logo />
            <p className="text-sm text-neutral-400 leading-relaxed font-sans mt-4">
              {formatPowerHouse('Power House Fitness Club is a premier high-performance fitness sanctuary engineered for results. We combine elite strength platforms, functional CrossFit rigs, and master coaching.')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={gymInfo.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-pink-950/20"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={gymInfo.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-green-950/20"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                </svg>
              </a>
              <a
                href="tel:+917373996262"
                aria-label="Call Us"
                className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-red-950/20"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl uppercase font-bold text-white tracking-wider border-b border-red-600/40 pb-2 inline-block">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {NAV_ITEMS.slice(0, 6).map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="hover:text-red-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-600 group-hover:scale-150 transition-transform" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Operating Hours */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl uppercase font-bold text-white tracking-wider border-b border-red-600/40 pb-2 inline-block">
              Working Hours
            </h3>
            <div className="space-y-3 text-sm">
              {gymInfo.workingHours.map((wh, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">{wh.days}</p>
                    <p className="text-xs text-neutral-400">{wh.time}</p>
                  </div>
                </div>
              ))}
              <div className="pt-2 text-xs text-red-400 font-medium bg-red-950/20 border border-red-900/30 p-2.5 rounded-xl flex items-center gap-2">
                <Dumbbell className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Admission Fee: {gymInfo.admissionFee} (One-time)</span>
              </div>
            </div>
          </div>

          {/* Column 4: Contact Info */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl uppercase font-bold text-white tracking-wider border-b border-red-600/40 pb-2 inline-block">
              Get In Touch
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <span>{gymInfo.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-500 shrink-0" />
                <a href="tel:+917373996262" className="hover:text-red-500 transition-colors">
                  {gymInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-500 shrink-0" />
                <a href={`mailto:${gymInfo.email}`} className="hover:text-red-500 transition-colors break-all">
                  {gymInfo.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 text-center">
          <p>© {new Date().getFullYear()} {formatPowerHouse('Power House Fitness Club')}. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#hero" className="hover:text-neutral-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#hero" className="hover:text-neutral-300 transition-colors">
              Terms of Service
            </a>
            <a href="#hero" className="hover:text-neutral-300 transition-colors">
              Gym Rules
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
