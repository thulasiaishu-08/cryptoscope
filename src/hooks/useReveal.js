import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ANIMATIONS_ENABLED } from '../utils/animationConfig';

// Fades + lifts an element into place the first time it enters the viewport.
export function useReveal(options = {}) {
  const ref = useRef(null);
  const { y = 20, duration = 0.6, delay = 0, stagger } = options;

  useEffect(() => {
    // Animations temporarily disabled — leave elements at their natural,
    // fully-visible CSS state instead of hiding them for a reveal-on-scroll.
    if (!ANIMATIONS_ENABLED) return;

    const el = ref.current;
    if (!el) return;

    const targets = stagger ? el.children : el;
    gsap.set(targets, { opacity: 0, y });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration,
          delay,
          stagger: stagger ? 0.08 : 0,
          ease: 'power2.out',
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
