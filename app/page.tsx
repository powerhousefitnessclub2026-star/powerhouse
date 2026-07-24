import React from 'react';
import fs from 'fs';
import path from 'path';
import { GymDataProvider } from '@/lib/context/GymDataContext';
import { IntroLoader } from '@/components/brand/IntroLoader';
import { Navbar } from '@/components/layout/Navbar';
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { WhyChooseUs } from '@/components/sections/WhyChooseUs';
import { Services } from '@/components/sections/Services';
import { Membership } from '@/components/sections/Membership';
import { Trainers } from '@/components/sections/Trainers';
import { Gallery } from '@/components/sections/Gallery';
import { BMICalculator } from '@/components/sections/BMICalculator';
import { Reviews } from '@/components/sections/Reviews';
import { Contact } from '@/components/sections/Contact';
import { Footer } from '@/components/layout/Footer';

export const revalidate = 0;

export default function Home() {
  const dataFilePath = path.join(process.cwd(), 'lib/constants/gym-data.json');
  let initialData = null;
  try {
    if (fs.existsSync(dataFilePath)) {
      initialData = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
    }
  } catch (error) {
    console.error('Failed to read gym data JSON:', error);
  }

  return (
    <GymDataProvider initialData={initialData}>
      <div className="min-h-screen bg-black text-white flex flex-col justify-between overflow-hidden">
        {/* Intro Overlay */}
        <IntroLoader />

        {/* Navigation Header */}
        <Navbar />

        {/* Main Single Page Sections */}
        <main id="main-content" className="flex-1">
          <Hero />
          <About />
          <WhyChooseUs />
          <Services />
          <BMICalculator />
          <Membership />
          <Gallery />
          <Trainers />
          <Reviews />
          <Contact />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </GymDataProvider>
  );
}
