"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const LOAD_KEY = "np-entered";

/**
 * Entry curtain: a counter runs to 100 behind the wordmark, then the ink
 * panel lifts away. Shown once per session — a preloader you meet on every
 * navigation stops being an entrance and becomes an obstacle.
 *
 * Mounted client-only (see PreloaderMount) so the "have I already entered?"
 * check can happen in the state initialiser rather than in an effect.
 */
export function Preloader() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return !window.sessionStorage.getItem(LOAD_KEY);
  });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active || reduced) return;

    document.documentElement.style.overflow = "hidden";

    const started = performance.now();
    /**
     * 700ms, down from 1500.
     *
     * This overlay covers the page, so nothing underneath can register as the
     * largest contentful paint until it clears -- it WAS the LCP, at 1996ms on
     * a page that is interactive in 22. A loading screen that outlasts the load
     * by seventy times is not communicating progress, it is manufacturing a
     * wait. The count still eases into 100 and the gesture survives; it just
     * stops being the slowest thing on the site.
     */
    const duration = 700;
    let frame = 0;
    let release = 0;

    function tick(now: number) {
      const progress = Math.min(1, (now - started) / duration);
      // Ease-out so the number decelerates into 100 instead of hitting a wall.
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * 100));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        window.sessionStorage.setItem(LOAD_KEY, "1");
        release = window.setTimeout(() => setActive(false), 140);
      }
    }

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(release);
      document.documentElement.style.overflow = "";
    };
  }, [active, reduced]);

  return (
    <AnimatePresence>
      {active ? (
        <motion.div
          key="preloader"
          className="ground-ink grain fixed inset-0 z-[120] flex flex-col justify-between px-6 py-8 md:px-10 md:py-10"
          initial={{ y: 0 }}
          exit={{ y: "-101%" }}
          transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
          aria-hidden
        >
          <div className="type-label-sm flex items-center justify-between text-quieter">
            <span>NPeripheral</span>
            <span>Fort Worth, TX</span>
          </div>

          <div className="flex flex-1 items-center">
            <motion.p
              className="type-hero"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              Appear<span className="text-ember">.</span>
            </motion.p>
          </div>

          <div className="flex items-end justify-between gap-6">
            <span className="type-label-sm text-quieter">Loading experience</span>
            <span className="font-display text-[13vw] leading-[0.8] tracking-tight md:text-[7vw]">
              {String(count).padStart(3, "0")}
            </span>
          </div>

          <div className="mt-6 h-px w-full bg-[var(--color-line-soft)]">
            <div className="h-px bg-ember" style={{ width: `${count}%` }} />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
