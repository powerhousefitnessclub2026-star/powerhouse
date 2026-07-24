export interface HeroConfig {
  videoUrl: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: string;
  highlights: string[];
}

export interface ContactOptions {
  fitnessGoals: string[];
  preferredTimes: string[];
}

export interface MembershipPlan {
  id: string;
  name: string;
  duration: string;
  strengthPrice: string;
  cardioStrengthPrice: string;
  admissionFee: string;
  featured: boolean;
  badge?: string;
  features: string[];
}

export interface Trainer {
  id: string;
  name: string;
  role: string;
  quote: string;
  accolades: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'All' | 'Gym Floor' | 'Equipment' | 'Training';
  image: string;
  description: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  achievement: string;
  avatar: string;
  status?: 'pending' | 'approved';
}

export const HERO: HeroConfig = {
  videoUrl: '/assets/assets/samplegym/hero-bg.mp4',
};

export const GYM_INFO = {
  name: 'Power House Fitness Club',
  tagline: '',
  admissionFee: '₹500',
  address: 'Chelliyamman Temple Opp, Manikkampalayam Main Road, Soolai, Erode - 638 004',
  phone: '+91 73739 96262 / +91 93423 03823',
  email: 'powerhousefitnessclub2026@gmail.com',
  workingHours: [
    { days: 'Morning (Mon - Sat)', time: '5:30 AM - 9:00 AM' },
    { days: 'Evening (Mon - Sat)', time: '5:30 PM - 9:30 PM' },
    { days: 'Sunday', time: 'Closed' },
  ],
  socials: {
    instagram: 'https://www.instagram.com/power_housefitness_club?utm_source=qr&igsh=MWowYjlxZXl4azh0bg==',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    whatsapp: 'https://wa.me/919342303823',
  },
};

export const WHY_CHOOSE_US: Feature[] = [
  {
    id: 'unisex-gym',
    title: 'Premium Unisex Gym',
    description: 'An inclusive, high-energy environment engineered for modern fitness enthusiasts of all genders.',
    iconName: 'Users',
  },
  {
    id: 'modern-equipment',
    title: 'Modern Equipment',
    description: 'State-of-the-art bio-mechanical resistance machines, free weights, and cardio stations.',
    iconName: 'Dumbbell',
  },
  {
    id: 'certified-trainers',
    title: 'Certified Trainer',
    description: 'Elite personal coaches certified by international bodies providing dedicated guidance.',
    iconName: 'Award',
  },
  {
    id: 'crossfit',
    title: 'CrossFit Zone',
    description: 'Dynamic functional strength rigs, kettlebells, wall balls, and high-intensity conditioning.',
    iconName: 'Zap',
  },
  {
    id: 'hiit',
    title: 'HIIT Workouts',
    description: 'Scientifically backed interval training tailored to burn calories and supercharge metabolism.',
    iconName: 'Flame',
  },
  {
    id: 'lifestyle-change',
    title: 'Lifestyle Change',
    description: 'Comprehensive transformation programs combining customized workout routines and nutrition plans.',
    iconName: 'HeartPulse',
  },
  {
    id: 'strength-training',
    title: 'Strength Training',
    description: 'Dedicated heavy lifting arenas equipped with Olympic platforms, squat racks, and bumper plates.',
    iconName: 'Activity',
  },
  {
    id: 'cardio',
    title: 'Advanced Cardio',
    description: 'Next-generation treadmills, ellipticals, stairmasters, and rowing machines with telemetry tracking.',
    iconName: 'Gauge',
  },
  {
    id: 'cleanliness',
    title: 'Uncompromised Hygiene',
    description: 'Hospital-grade sanitization, climate control, purified water stations, and immaculate locker facilities.',
    iconName: 'ShieldCheck',
  },
];

export const SERVICES: Service[] = [
  {
    id: 'strength-training',
    number: '01',
    title: 'Strength Training',
    description: 'Structured resistance training programs designed to facilitate healthy weight gain (hypertrophy) and effective weight loss (fat reduction) based on individual fitness goals.',
    iconName: 'BicepsFlexed',
    highlights: ['Weight Gain', 'Weight Loss', 'Body Recomposition', 'Goal-Based Routine'],
  },
  {
    id: 'cardio',
    number: '02',
    title: 'Cardio Suite',
    description: 'Stamina-building aerobic zone featuring interactive consoles and heart-rate monitoring.',
    iconName: 'HeartPulse',
    highlights: ['Curved Treadmills', 'Spin Bikes', 'Rowing Ergometers', 'Interactive Displays'],
  },
  {
    id: 'lifestyle-change',
    number: '03',
    title: 'Personal Training',
    description: 'One-on-one dedicated coaching tailored exclusively to your body type, fitness level, and goals, combining custom workout programming with nutrition mapping for rapid results.',
    iconName: 'Sparkles',
    highlights: ['1-on-1 Dedicated Coaching', 'Custom Workout Mapping', 'Nutrition & Diet Guidance', 'Form & Technique Refinement'],
  },
  {
    id: 'weight-training',
    number: '04',
    title: 'PCOS / PCOD Fitness Support',
    description: 'Specialized exercise programming and lifestyle guidance tailored to manage PCOS/PCOD symptoms, improve insulin sensitivity, regulate hormones, and support weight management.',
    iconName: 'HeartPulse',
    highlights: ['Hormonal Regulation', 'Insulin Sensitivity', 'Low-Stress Strength', 'Lifestyle Coaching'],
  },
  {
    id: 'crossfit',
    number: '05',
    title: 'CrossFit',
    description: 'High-intensity functional movements designed to push human endurance, power, and agility.',
    iconName: 'Zap',
    highlights: ['Functional Movements', 'Olympic Lifts', 'Community WODs', 'Endurance Rigs'],
  },
  {
    id: 'hiit',
    number: '06',
    title: 'HIIT',
    description: 'Rapid, explosive workout intervals optimized to torch fat while preserving lean muscle mass.',
    iconName: 'Flame',
    highlights: ['Max Caloric Burn', 'Metabolic Rate Boost', 'Heart Rate Zones', 'Group Motivation'],
  },
];

export const CONTACT_OPTIONS: ContactOptions = {
  fitnessGoals: [
    'Weight Loss',
    'Weight Gain',
    'Muscle Gain',
    'CrossFit & HIIT',
    'General Fitness',
    'Strength & Powerlifting',
    'Personal Coaching',
  ],
  preferredTimes: [
    'Morning (5:30 AM - 9:00 AM)',
    'Evening (5:30 PM - 9:30 PM)',
  ],
};

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'monthly',
    name: 'Monthly Package',
    duration: '1 Month',
    strengthPrice: '₹799',
    cardioStrengthPrice: '₹999',
    admissionFee: '₹500 (One-time)',
    featured: false,
    features: [
      'Full Gym Floor Access',
      'Free Weights & Machine Suite',
      'Hygiene & Locker Facilities',
      'Trainer Form Guidance',
    ],
  },
  {
    id: 'quarterly',
    name: 'Quarterly Package',
    duration: '3 Months',
    strengthPrice: '₹2,199',
    cardioStrengthPrice: '₹3,499',
    admissionFee: '₹500 (One-time)',
    featured: false,
    features: [
      '3 Months Continuous Membership',
      'Save up to ₹800 vs Monthly',
      'Strength & Cardio Equipment',
      'Locker & Shower Facilities',
    ],
  },
  {
    id: 'half-yearly',
    name: 'Half Yearly Package',
    duration: '6 Months',
    strengthPrice: '₹4,199',
    cardioStrengthPrice: '₹5,499',
    admissionFee: '₹500 (One-time)',
    featured: true,
    badge: 'POPULAR CHOICE',
    features: [
      '6 Months Continuous Access',
      'Save up to ₹1,000',
      'Strength & Cardio Training Rigs',
      'Personalized Workout Guidance',
    ],
  },
  {
    id: 'yearly',
    name: 'Yearly Package',
    duration: '12 Months',
    strengthPrice: '₹6,999',
    cardioStrengthPrice: '₹8,999',
    admissionFee: '₹500 (One-time)',
    featured: true,
    badge: 'BEST VALUE',
    features: [
      '12 Months Full Membership',
      'Maximum Savings (Lowest Monthly Rate)',
      'Unrestricted Access to All Zones',
      'Complete Lifestyle Transformation Blueprint',
    ],
  },
];

export const TRAINERS: Trainer[] = [
  {
    id: 'harish',
    name: 'TRAINER HARISH',
    role: 'National Powerlifting Champion',
    quote: 'Champions are built through discipline, consistency, and relentless hard work.',
    accolades: [
      'National Powerlifting Championship 2025 - Delhi - Silver Medalist',
      'Erode District Powerlifting Champion',
      '7x State Gold Medalist',
      '2x State Silver Medalist',
      '8x State Bronze Medalist',
      'South India Gold Medalist',
      '3x South India Bronze Medalist',
      'National-Level Competitive Powerlifter',
    ],
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Heavy Duty Strength Rig',
    category: 'Equipment',
    image: '/assets/assets/samplegym/IMG20260719205039.jpg',
    description: 'Professional-grade cable crossover towers and multi-gym resistance station.',
  },
  {
    id: 'g2',
    title: 'Main Gym Floor Overview',
    category: 'Gym Floor',
    image: '/assets/assets/samplegym/IMG20260719205151.jpg',
    description: 'Spacious, air-conditioned workout hall equipped with top-tier training rigs.',
  },
  {
    id: 'g3',
    title: 'Free Weight & Dumbbell Zone',
    category: 'Equipment',
    image: '/assets/assets/samplegym/IMG20260719205203.jpg',
    description: 'Extensive dumbbell rack ranging from light conditioning weights to heavy power sets.',
  },
  {
    id: 'g4',
    title: 'Hypertrophy & Isolation Station',
    category: 'Equipment',
    image: '/assets/assets/samplegym/IMG20260719205226.jpg',
    description: 'Precision leg press, hack squat, and quad extension machines.',
  },
  {
    id: 'g5',
    title: 'CrossFit & Functional Arena',
    category: 'Training',
    image: '/assets/assets/samplegym/IMG20260719205237.jpg',
    description: 'Open turf floor dedicated to kettlebell swings, wall balls, and HIIT circuits.',
  },

  {
    id: 'g7',
    title: 'Cardio & Stamina Zone',
    category: 'Gym Floor',
    image: '/assets/assets/samplegym/IMG20260719205300.jpg',
    description: 'High-performance treadmills and cardiovascular endurance machines.',
  },
  {
    id: 'g8',
    title: 'Powerlifting Squat & Bench Platforms',
    category: 'Training',
    image: '/assets/assets/samplegym/IMG20260719205315.jpg',
    description: 'Heavy duty Olympic bars, calibrated bumper plates, and rigid squat racks.',
  },
  {
    id: 'g9',
    title: 'Upper Body Cable & Lat Towers',
    category: 'Equipment',
    image: '/assets/assets/samplegym/IMG20260719205725.jpg',
    description: 'Dual lat pulldown and seated row machines built for smooth cable tension.',
  },
  {
    id: 'g10',
    title: 'Personal Training Rigs',
    category: 'Training',
    image: '/assets/assets/samplegym/IMG20260719205729.jpg',
    description: 'Dedicated 1-on-1 coaching zone for supervised technique refining.',
  },
];

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Karthik R',
    role: 'Member for 1 Year',
    rating: 5,
    comment: 'Nalla gym, trainer romba friendly-ah irukanga. Workout panna perfect environment. Weight training-ku super place. Highly recommended!',
    achievement: 'Strength & Conditioning',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'r2',
    name: 'Harish Kumar',
    role: 'Member for 6 Months',
    rating: 5,
    comment: 'Power House Fitness Club-la join pannathula irundhu en fitness romba improve aachu. Trainer support and guidance romba nalla irukku. Worth for the money!',
    achievement: 'Stamina & Weight Loss',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'r3',
    name: 'Geetha',
    role: 'Member for 1.5 Years',
    rating: 5,
    comment: 'One of the best gyms I\'ve been to. The trainer is supportive and the atmosphere is great. Highly recommended for anyone serious about fitness.',
    achievement: 'General Fitness & Tone',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
  },
  {
    id: 'r4',
    name: 'Veena',
    role: 'Member for 2 Years',
    rating: 5,
    comment: 'Great equipment, friendly trainer, and a motivating environment. I\'ve seen a lot of improvement since I joined. Definitely a great place to work out!',
    achievement: 'Stamina & Body Recomposition',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  },
];
