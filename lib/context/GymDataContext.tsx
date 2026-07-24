'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { GYM_INFO, SERVICES, MEMBERSHIP_PLANS, TRAINERS, GALLERY_ITEMS, REVIEWS, HERO, CONTACT_OPTIONS } from '@/lib/constants/gym-data';

interface GymDataContextType {
  gymInfo: typeof GYM_INFO;
  services: typeof SERVICES;
  membershipPlans: typeof MEMBERSHIP_PLANS;
  trainers: typeof TRAINERS;
  galleryItems: typeof GALLERY_ITEMS;
  reviews: typeof REVIEWS;
  hero: typeof HERO;
  contactOptions: typeof CONTACT_OPTIONS;
  refreshData: () => Promise<void>;
}

const GymDataContext = createContext<GymDataContextType | undefined>(undefined);

export const GymDataProvider: React.FC<{
  children: React.ReactNode;
  initialData?: any;
}> = ({ children, initialData }) => {
  const [data, setData] = useState({
    GYM_INFO: initialData?.GYM_INFO || GYM_INFO,
    SERVICES: initialData?.SERVICES || SERVICES,
    MEMBERSHIP_PLANS: initialData?.MEMBERSHIP_PLANS || MEMBERSHIP_PLANS,
    TRAINERS: initialData?.TRAINERS || TRAINERS,
    GALLERY_ITEMS: initialData?.GALLERY_ITEMS || GALLERY_ITEMS,
    REVIEWS: initialData?.REVIEWS || REVIEWS,
    HERO: initialData?.HERO || HERO,
    CONTACT_OPTIONS: initialData?.CONTACT_OPTIONS || CONTACT_OPTIONS,
  });

  const refreshData = async () => {
    try {
      const res = await fetch(`/api/admin/data?t=${Date.now()}`);
      if (res.ok) {
        const json = await res.json();
        setData({
          GYM_INFO: json.GYM_INFO || GYM_INFO,
          SERVICES: json.SERVICES || SERVICES,
          MEMBERSHIP_PLANS: json.MEMBERSHIP_PLANS || MEMBERSHIP_PLANS,
          TRAINERS: json.TRAINERS || TRAINERS,
          GALLERY_ITEMS: json.GALLERY_ITEMS || GALLERY_ITEMS,
          REVIEWS: json.REVIEWS || REVIEWS,
          HERO: json.HERO || HERO,
          CONTACT_OPTIONS: json.CONTACT_OPTIONS || CONTACT_OPTIONS,
        });
      }
    } catch (error) {
      console.error('Failed to refresh gym data:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <GymDataContext.Provider
      value={{
        gymInfo: data.GYM_INFO,
        services: data.SERVICES,
        membershipPlans: data.MEMBERSHIP_PLANS,
        trainers: data.TRAINERS,
        galleryItems: data.GALLERY_ITEMS,
        reviews: data.REVIEWS,
        hero: data.HERO,
        contactOptions: data.CONTACT_OPTIONS,
        refreshData,
      }}
    >
      {children}
    </GymDataContext.Provider>
  );
};

export const useGymData = () => {
  const context = useContext(GymDataContext);
  if (!context) {
    throw new Error('useGymData must be used within a GymDataProvider');
  }
  return context;
};
