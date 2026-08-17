"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { scrollToElement } from "@/lib/smooth-scroll";

export type TourStep = {
  /** CSS selector for the element to spotlight, e.g. '[data-tour="spend"]'. */
  target: string;
  title: string;
  body: string;
};

type TourProps = {
  steps: TourStep[];
  /** Distinguishes one tour's "already seen" flag from another's. */
  storageKey: string;
  label?: string;
  className?: string;
  /** Offer the tour unprompted the first time someone lands on the page. */
  autoOffer?: boolean;
};

type Box = { top: number; left: number; width: number; height: number };

const PAD = 10;

/**
 * A guided tour.
 *
 * Spotlights real elements on the page rather than showing screenshots of
 * them: each step scrolls its target into view, cuts a hole in a dimming
 * overlay, and anchors a card beside it. The hole is a single element with an
 * enormous spread box-shadow, which is one composited layer rather than four
 * mask panels.
 *
 * Keyboard-complete (arrows, Enter, Escape), announced to screen readers, and
 * it never starts itself — the most it will do is offer.
 */
export function Tour({ steps, storageKey, label = "Take the tour", className, autoOffer }: TourProps) {
  const reduced = useReducedMotion();
  const [running, setRunning] = useState(false);
  const [offered, setOffered] = useState(false);
  const [index, setIndex] = useState(0);
  const [box, setBox] = useState<Box | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const step = steps[index];
  const seenKey = `tour-seen:${storageKey}`;

  /* Portals need document.body, which only exists after mount. Reading that
     through useSyncExternalStore keeps the server snapshot (false) and the
     client snapshot (true) explicit, with no setState inside an effect. */
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!autoOffer || typeof window === "undefined") return;
    if (window.localStorage.getItem(seenKey)) return;
    const timer = window.setTimeout(() => setOffered(true), 1400);
    return () => window.clearTimeout(timer);
  }, [autoOffer, seenKey]);

  const measure = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(step.target);
    if (!el) {
      setBox(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setBox({
      top: r.top - PAD,
      left: r.left - PAD,
      width: r.width + PAD * 2,
      height: r.height + PAD * 2,
    });
  }, [step]);

  // Bring the target into view, then measure once it has settled.
  useEffect(() => {
    if (!running || !step) return;
    const el = document.querySelector(step.target);
    if (el) scrollToElement(el, { block: "center", duration: reduced ? 0 : 0.8 });

    // Measure across the whole settle, not once at the end of it, so the
    // spotlight tracks the scroll rather than jumping when it stops.
    let frame = 0;
    const until = performance.now() + (reduced ? 0 : 950);
    const track = (now: number) => {
      measure();
      if (now < until) frame = requestAnimationFrame(track);
    };
    frame = requestAnimationFrame(track);
    return () => cancelAnimationFrame(frame);
  }, [running, step, measure, reduced]);

  useEffect(() => {
    if (!running) return;
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
    };
  }, [running, measure]);

  const finish = useCallback(() => {
    setRunning(false);
    setOffered(false);
    setIndex(0);
    window.localStorage.setItem(seenKey, "1");
    triggerRef.current?.focus();
  }, [seenKey]);

  const next = useCallback(() => {
    setIndex((i) => {
      if (i + 1 >= steps.length) {
        finish();
        return i;
      }
      return i + 1;
    });
  }, [steps.length, finish]);

  useEffect(() => {
    if (!running) return;
    cardRef.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") finish();
      if (event.key === "ArrowRight" || event.key === "Enter") {
        event.preventDefault();
        next();
      }
      if (event.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [running, index, next, finish]);

  function start() {
    setOffered(false);
    setIndex(0);
    setRunning(true);
  }

  // Anchor the card under the target, or above it when there is no room below.
  const cardStyle = (() => {
    if (!box) return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" } as const;
    const below = box.top + box.height + 16;
    const fitsBelow = typeof window !== "undefined" && below + 240 < window.innerHeight;
    const maxLeft = typeof window !== "undefined" ? window.innerWidth - 360 : box.left;
    return {
      top: fitsBelow ? below : Math.max(16, box.top - 236),
      left: Math.max(16, Math.min(box.left, maxLeft)),
    };
  })();

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={start}
        className={cn(
          "type-label group/btn inline-flex items-center gap-3 rounded-full border border-[var(--rule,var(--color-line))] px-6 py-3.5 transition-colors duration-300 hover:border-ember hover:text-ember",
          className,
        )}
      >
        {label}
        <span aria-hidden>→</span>
      </button>

      {mounted && offered && !running
        ? createPortal(
            <div className="fixed bottom-6 left-6 z-[95] hidden w-[min(20rem,calc(100vw-3rem))] border border-[var(--color-line)] bg-[color-mix(in_oklab,var(--color-ink)_96%,transparent)] p-5 backdrop-blur-xl md:block">
              <p className="type-label-sm text-ember">First time here?</p>
              <p className="type-small mt-3 text-quiet">
                A {steps.length}-step walkthrough of what everything on this page means.
              </p>
              <div className="mt-5 flex items-center gap-5">
                <button type="button" onClick={start} className="type-label link-underline text-bone">
                  Start the tour
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOffered(false);
                    window.localStorage.setItem(seenKey, "1");
                  }}
                  className="type-label-sm link-underline text-quieter"
                >
                  No thanks
                </button>
              </div>
            </div>,
            document.body,
          )
        : null}

      {mounted
        ? createPortal(
            <AnimatePresence>
              {running && step ? (
                <motion.div
                  className="fixed inset-0 z-[110]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduced ? 0 : 0.25 }}
                >
                  {/* The spotlight: one box with a very large shadow spread. */}
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute border border-ember"
                    animate={{
                      top: box?.top ?? 0,
                      left: box?.left ?? 0,
                      width: box?.width ?? 0,
                      height: box?.height ?? 0,
                    }}
                    transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                    style={{ boxShadow: "0 0 0 9999px rgba(11,10,9,0.86)" }}
                  />

                  {/* Clicking the dimmed area leaves the tour. */}
                  <button
                    type="button"
                    aria-label="Close the tour"
                    onClick={finish}
                    className="absolute inset-0 cursor-default"
                  />

                  <motion.div
                    ref={cardRef}
                    tabIndex={-1}
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Tour step ${index + 1} of ${steps.length}`}
                    className="absolute w-[min(21rem,calc(100vw-2rem))] border border-[var(--color-line)] bg-ink p-6 outline-none"
                    animate={cardStyle}
                    transition={{ duration: reduced ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="type-label-sm text-ember">
                        {String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                      </span>
                      <button
                        type="button"
                        onClick={finish}
                        className="type-label-sm link-underline text-quieter"
                      >
                        Skip
                      </button>
                    </div>

                    <h2 className="type-h3 mt-4 text-bone">{step.title}</h2>
                    <p className="type-small mt-3 text-quiet">{step.body}</p>

                    <div className="rule-t mt-6 flex items-center justify-between gap-4 pt-5">
                      <button
                        type="button"
                        onClick={() => setIndex((i) => Math.max(0, i - 1))}
                        disabled={index === 0}
                        className="type-label-sm text-quieter transition-colors hover:text-quiet disabled:opacity-35"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={next}
                        className="type-label rounded-full bg-ember px-5 py-2.5 text-[#fff6f1]"
                      >
                        {index + 1 === steps.length ? "Finish" : "Next"}
                      </button>
                    </div>

                    <p className="type-label-sm mt-4 leading-[1.7] text-quieter">
                      Arrow keys to move · Esc to close
                    </p>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
