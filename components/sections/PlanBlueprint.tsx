"use client";

import { Reveal } from "@/components/motion/Reveal";
import { SubmarineBlueprint } from "@/components/visual/SubmarineBlueprint";

/**
 * Chapter 06 — the plan of work, drawn as a submarine cutaway.
 *
 * No diagonal cut here, deliberately. This section follows WorkSection, which is
 * ground-ink (#0b0a09), and this one is #000 — about a one-unit luminance step.
 * globals.css states the rule itself: a cut "only works where the ground
 * actually changes", and over a matching ground the notch is invisible while
 * the hairline still draws. That is a white diagonal line with nothing behind
 * it, which is decoration — the exact thing the thesis forbids.
 *
 * This chapter is deliberately monochrome: white on black, nothing else. The
 * rest of the page keeps the warm ink/ember system; this one section drops the
 * accent entirely so that every line of the drawing and every word of the copy
 * reads at full contrast. A blueprint that needed a colour key would be a worse
 * blueprint.
 */
export function PlanBlueprint() {
  return (
    <section
      id="process"
      className="relative bg-black py-24 text-white md:py-36"
      aria-labelledby="plan-heading"
    >

      <div className="shell relative z-10">
        <Reveal mode="fade">
          <div className="flex items-baseline gap-4 border-b border-white/40 pb-3">
            <span className="font-mono text-[11px] tracking-[0.14em] text-white">06</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white">
              How the work runs
            </span>
          </div>
        </Reveal>

        <Reveal mode="rise">
          <h2
            id="plan-heading"
            className="type-h1 mt-8 max-w-2xl text-white"
          >
            Four stages, ending in appear.
          </h2>
        </Reveal>

        <Reveal mode="rise" delay={0.1}>
          <p className="type-lead mt-8 max-w-xl text-white">
            The plan is not a mystery. Here is the whole vessel, bow to stern:
            what happens in each compartment, and what surfaces at the end of it.
          </p>
        </Reveal>

        <Reveal mode="fade" delay={0.15}>
          <SubmarineBlueprint className="mt-16" />
        </Reveal>
      </div>
    </section>
  );
}
