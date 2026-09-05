import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ANIMATIONS_ENABLED } from '../../utils/animationConfig';

// Animates a numeric value counting up from 0 the first time it scrolls into
// view, then snaps to the target on subsequent prop changes (e.g. live price
// ticks) so it doesn't replay the count-up every re-render.
export function AnimatedNumber({ value, format, duration = 1.1, as: Tag = 'span', className }) {
  const ref = useRef(null);
  const hasAnimated = useRef(false);
  const proxy = useRef({ val: 0 });
  const prevValue = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || value == null) return;

    // Animations temporarily disabled — render the final value immediately
    // instead of counting up from 0 / bumping on change.
    if (!ANIMATIONS_ENABLED) {
      el.textContent = format(value);
      prevValue.current = value;
      return;
    }

    if (hasAnimated.current) {
      el.textContent = format(value);
      if (prevValue.current != null && value !== prevValue.current) {
        // Color-agnostic bump so this works on gradient-clipped text too —
        // animating `color` would fight background-clip:text elements.
        gsap.fromTo(
          el,
          { scale: 1.035, transformOrigin: '0% 50%' },
          { scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' }
        );
      }
      prevValue.current = value;
      return;
    }
    prevValue.current = value;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        hasAnimated.current = true;
        observer.disconnect();
        gsap.fromTo(
          proxy.current,
          { val: 0 },
          {
            val: value,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              if (el) el.textContent = format(proxy.current.val);
            },
          }
        );
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Tag ref={ref} className={className}>
      {ANIMATIONS_ENABLED ? format(0) : format(value ?? 0)}
    </Tag>
  );
}
