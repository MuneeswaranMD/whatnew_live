import React, { useEffect, useRef, useState } from 'react';

type AnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'blur-in'
  | 'rotate-in'
  | 'bounce-in'
  | 'flip-in'
  | 'slide-up-scale';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: AnimationType;
  duration?: number;
  once?: boolean;
}

const Reveal: React.FC<RevealProps> = ({
  children,
  className = "",
  delay = 0,
  animation = 'fade-up',
  duration = 1000,
  once = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.disconnect();
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [once]);

  // Get the animation-specific styles based on type
  const getAnimationStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      transitionDelay: `${delay}ms`,
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      transitionProperty: 'transform, opacity, filter',
      willChange: 'transform, opacity, filter',
    };

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return { ...baseStyles, opacity: 0, transform: 'translateY(50px)' };
        case 'fade-down':
          return { ...baseStyles, opacity: 0, transform: 'translateY(-50px)' };
        case 'fade-left':
          return { ...baseStyles, opacity: 0, transform: 'translateX(-50px)' };
        case 'fade-right':
          return { ...baseStyles, opacity: 0, transform: 'translateX(50px)' };
        case 'zoom-in':
          return { ...baseStyles, opacity: 0, transform: 'scale(0.85)' };
        case 'zoom-out':
          return { ...baseStyles, opacity: 0, transform: 'scale(1.15)' };
        case 'blur-in':
          return { ...baseStyles, opacity: 0, filter: 'blur(15px)', transform: 'scale(0.95)' };
        case 'rotate-in':
          return { ...baseStyles, opacity: 0, transform: 'rotate(-8deg) scale(0.92)' };
        case 'bounce-in':
          return { ...baseStyles, opacity: 0, transform: 'translateY(50px) scale(0.95)' };
        case 'flip-in':
          return { ...baseStyles, opacity: 0, transform: 'perspective(1000px) rotateY(60deg)' };
        case 'slide-up-scale':
          return { ...baseStyles, opacity: 0, transform: 'translateY(80px) scale(0.9)' };
        default:
          return { ...baseStyles, opacity: 0, transform: 'translateY(50px)' };
      }
    }

    return {
      ...baseStyles,
      opacity: 1,
      transform: 'none',
      filter: 'none'
    };
  };

  return (
    <div
      ref={ref}
      style={getAnimationStyles()}
      className={className}
    >
      {children}
    </div>
  );
};

export default Reveal;