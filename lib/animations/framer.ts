import { Variants } from 'framer-motion';

export const SPRING_CONFIG = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 20,
};

export const CARD_HOVER_VARIANTS: Variants = {
  initial: {
    y: 0,
    scale: 1,
  },
  hover: {
    y: -10,
    scale: 1.02,
    transition: SPRING_CONFIG,
  },
};

export const FADE_IN_UP: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const STAGGER_CONTAINER: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const FADE_IN: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export const SCALE_UP: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};
