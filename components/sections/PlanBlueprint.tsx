"use client";

import { Reveal } from "@/components/motion/Reveal";
import { DiagonalCut } from "@/components/motion/DiagonalCut";
import { SubmarineBlueprint } from "@/components/visual/SubmarineBlueprint";

/**
 * Chapter 06 — the plan of work, drawn as a submarine cutaway.
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
      className="cut-top relative bg-black py-24 text-white md:py-36"
      aria-labelledby="plan-heading"
    >
      <DiagonalCut className="text-white" />

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
