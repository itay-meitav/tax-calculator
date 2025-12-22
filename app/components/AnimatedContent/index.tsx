'use client';

import { useRef, ReactNode, CSSProperties } from 'react';
import { motion, useInView, Variants, Transition } from 'framer-motion';

type Direction = 'vertical' | 'horizontal';
type EaseType = 
  | 'linear' 
  | 'easeIn' 
  | 'easeOut' 
  | 'easeInOut' 
  | 'circIn' 
  | 'circOut' 
  | 'circInOut'
  | 'backIn' 
  | 'backOut' 
  | 'backInOut'
  | 'anticipate'
  | number[];

interface AnimatedContentProps {
  children: ReactNode;
  distance?: number;
  direction?: Direction;
  reverse?: boolean;
  duration?: number;
  ease?: EaseType;
  initialOpacity?: number;
  animateOpacity?: boolean;
  scale?: number;
  threshold?: number;
  delay?: number;
  staggerChildren?: number;
  className?: string;
  style?: CSSProperties;
  once?: boolean;
}

export default function AnimatedContent({
  children,
  distance = 50,
  direction = 'vertical',
  reverse = false,
  duration = 0.6,
  ease = 'easeOut',
  initialOpacity = 0,
  animateOpacity = true,
  scale = 1,
  threshold = 0.2,
  delay = 0,
  staggerChildren = 0,
  className = '',
  style,
  once = true,
}: AnimatedContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { 
    once, 
    amount: threshold 
  });

  const getInitialOffset = () => {
    const offset = reverse ? -distance : distance;
    return direction === 'horizontal' 
      ? { x: offset, y: 0 } 
      : { x: 0, y: offset };
  };

  const variants: Variants = {
    hidden: {
      ...getInitialOffset(),
      opacity: animateOpacity ? initialOpacity : 1,
      scale: scale,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration,
        ease,
        delay,
        staggerChildren,
      } as Transition,
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedItem({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' }
    },
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}

