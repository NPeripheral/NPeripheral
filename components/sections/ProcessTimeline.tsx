"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { processStages } from "@/lib/data/process";
import { Lines } from "@/components/motion/Lines";

/**
 * Chapter 06 — the method.
 *
 * The only section that moves sideways: four stages pinned and dragged
 * horizontally by vertical scroll, so the process is experienced as a
 * sequence rather than read as a list. It ends on "Appear", which is the
 * whole point of the brand.
 *
 * Below the large breakpoint it degrades to a plain vertical list — hijacking
 * scroll on a phone is hostile, not premium.
 */
export function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-52%"]);
  const rail = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="ground-ink relative">
      <div ref={ref} className="relative hidden h-[300vh] lg:block">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div className="shell w-full">
            <div className="rule-b flex items-baseline gap-4 pb-3">
              <span className="type-label-sm text-ember">06</span>
              <span className="type-label text-quiet">How the work runs</span>
            </div>
            <Lines
              as="h2"
              className="type-h1 mt-8 max-w-2xl"
              lines={[
                <span key="a">
                  Four stages, ending in <em className="italic-voice text-ember">appear</em>.
                </span>,
              ]}
            />
          </div>

          <motion.ol
            style={reduced ? undefined : { x }}
            className="mt-14 flex w-max gap-8 pl-6 md:pl-10 xl:pl-16"
          >
            {processStages.map((stage) => (
              <li
                key={stage.step}
                className="w-[26rem] shrink-0 border-t border-[var(--color-line)] pt-6"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-[5rem] leading-none tracking-tight text-bone/15">
                    {stage.step}
                  </span>
                  <span className="type-label-sm text-ember">Stage</span>
                </div>
                <h3 className="type-h3 mt-6">{stage.title}</h3>
                <p className="type-small mt-4 text-quiet">{stage.description}</p>
                <p className="type-label-sm rule-t mt-6 pt-4 leading-[1.7] text-quieter">
                  {stage.output}
                </p>
              </li>
            ))}
          </motion.ol>

          <div className="shell mt-12 w-full">
            <div className="h-px w-full bg-[var(--color-line)]">
              <motion.div
                style={reduced ? { width: "100%" } : { width: rail }}
                className="h-px bg-ember"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="shell py-24 lg:hidden">
        <div className="rule-b flex items-baseline gap-4 pb-3">
          <span className="type-label-sm text-ember">06</span>
          <span className="type-label text-quiet">How the work runs</span>
        </div>
        <h2 className="type-h1 mt-7">
          Four stages, ending in <em className="italic-voice text-ember">appear</em>.
        </h2>

        <ol className="mt-12">
          {processStages.map((stage) => (
            <li key={stage.step} className="rule-t py-7">
              <div className="flex items-baseline gap-5">
                <span className="type-label-sm text-ember">{stage.step}</span>
                <div>
                  <h3 className="type-h3">{stage.title}</h3>
                  <p className="type-small mt-3 text-quiet">{stage.description}</p>
                  <p className="type-label-sm mt-4 leading-[1.7] text-quieter">{stage.output}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
