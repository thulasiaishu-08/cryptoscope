import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ANIMATIONS_ENABLED } from '../../utils/animationConfig';
import './Tabs.css';

export function Tabs({ tabs, active, onChange }) {
  const wrapRef = useRef(null);
  const prevActive = useRef(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const checkOverflow = () => setOverflowing(wrap.scrollWidth > wrap.clientWidth + 1);
    checkOverflow();
    const observer = new ResizeObserver(checkOverflow);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, [tabs]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const activeEl = wrap.querySelector('.tab-active');
    const indicator = wrap.querySelector('.tabs-indicator');
    if (activeEl && indicator) {
      // Animations temporarily disabled — snap the indicator to place with
      // gsap.set (still GSAP, just no tween) instead of animating to it.
      const move = ANIMATIONS_ENABLED ? gsap.to : gsap.set;
      move(indicator, {
        left: activeEl.offsetLeft,
        width: activeEl.offsetWidth,
        duration: 0.25,
        ease: 'power2.out',
      });
      // Only bring the tab into view when the active tab actually changed —
      // comparing against the previous value (rather than an "is this the
      // first render" flag) survives StrictMode's dev-only double-invoke of
      // effects, which would otherwise still fire this as if mount were a
      // real change and yank the whole page down to reveal a tab bar that
      // starts below the fold.
      if (prevActive.current !== null && prevActive.current !== active) {
        activeEl.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: ANIMATIONS_ENABLED ? 'smooth' : 'auto' });
      }
    }
    prevActive.current = active;
  }, [active]);

  return (
    <div className={`tabs ${overflowing ? 'tabs-overflowing' : ''}`} ref={wrapRef} role="tablist" aria-label="Coin sections">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab ${tab === active ? 'tab-active' : ''}`}
          onClick={() => onChange(tab)}
          role="tab"
          aria-selected={tab === active}
        >
          {tab}
        </button>
      ))}
      <span className="tabs-indicator" />
    </div>
  );
}
