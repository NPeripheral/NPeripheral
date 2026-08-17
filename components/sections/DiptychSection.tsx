"use client";

import { useRef } from "react";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Aperture } from "@/components/visual/Aperture";

/**
 * Chapter 03 — the diptych.
 *
 * Two panels of the same subject: the brand nobody registers, and the same
 * brand after the work. Scrolling wipes the second panel across the first,
 * so the change happens under your control rather than in a caption.
 */
export function DiptychSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // The cream panel opens from the right across the ink panel. The wipe is
  // driven as a number and composed into the clip-path string — interpolating
  // two clip-path strings directly does not track reliably.
  const wipe = useTransform(scrollYProgress, [0.12, 0.72], [100, 0]);
  const clip = useMotionTemplate`inset(0 0 0 ${wipe}%)`;
  const inkShift = useTransform(scrollYProgress, [0.12, 0.72], ["0%", "-8%"]);
  const seamLeft = useTransform(scrollYProgress, [0.12, 0.72], ["100%", "0%"]);

  return (
    <section ref={ref} className="relative h-[190vh] lg:h-[260vh]" aria-label="Before and after">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* Panel A — peripheral */}
        <motion.div
          style={reduced ? undefined : { x: inkShift }}
          className="ground-ink absolute inset-0 flex items-center"
        >
          <div className="shell grid w-full items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="rule-b flex items-baseline gap-4 pb-3">
                <span className="type-label-sm text-ember">03</span>
                <span className="type-label text-quiet">Before</span>
              </div>
              <h2 className="type-h1 mt-8">
                In the
                <br />
                <em className="italic-voice text-quiet">periphery</em>.
              </h2>
              <p className="type-lead mt-8 max-w-sm text-quiet">
                Posting consistently. Spending steadily. Recognised by nobody who
                wasn&apos;t already a customer.
              </p>
            </div>
            <div className="hidden lg:col-span-5 lg:col-start-8 lg:block">
              <Aperture
                figure="grid"
                tone="ink"
                anchor="center"
                dot={7}
                className="h-[52vh] w-full border border-[var(--color-line)]"
                label="Undifferentiated reach"
              />
            </div>
          </div>
        </motion.div>

        {/* Panel B — central */}
        <motion.div
          style={reduced ? { clipPath: "inset(0 0 0 0)" } : { clipPath: clip }}
          className="ground-cream absolute inset-0 flex items-center"
        >
          <div className="shell grid w-full items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="rule-b flex items-baseline gap-4 pb-3">
                <span className="type-label-sm text-ember">03</span>
                <span className="type-label text-quiet">After</span>
              </div>
              <h2 className="type-h1 mt-8">
                At the
                <br />
                <em className="italic-voice text-ember">centre</em>.
              </h2>
              <p className="type-lead mt-8 max-w-sm text-quiet">
                A brand people can describe without opening the app. Named in the
                group chat. Searched for directly.
              </p>
            </div>
            <div className="hidden lg:col-span-5 lg:col-start-8 lg:block">
              <Aperture
                figure="lens"
                tone="cream"
                anchor="center"
                dot={3}
                className="h-[52vh] w-full border border-[var(--color-line-ink)]"
                interactive
                label="Concentrated attention"
              />
            </div>
          </div>
        </motion.div>

        {/* The seam. */}
        {!reduced ? (
          <motion.div
            aria-hidden
            style={{ left: seamLeft }}
            className="absolute inset-y-0 z-10 w-px bg-ember"
          />
        ) : null}
      </div>
    </section>
  );
}
