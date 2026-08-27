"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { DiagonalCut } from "@/components/motion/DiagonalCut";

/**
 * Chapter 13 — the manifesto.
 *
 * The whole viewport turns ember and the motto is set as large as the page
 * allows. Two mono bands drift in opposite directions as you scroll, so the
 * statement sits still while everything around it moves.
 */
export function BrandStatement() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const driftLeft = useTransform(scrollYProgress, [0, 1], ["8%", "-28%"]);
  const driftRight = useTransform(scrollYProgress, [0, 1], ["-28%", "8%"]);
  const rise = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);

  const band = "Appear ✳ Be seen ✳ Be remembered ✳ Be chosen ✳ ";

  return (
    <section
      ref={ref}
      className="ground-ember cut-top relative flex min-h-[85svh] flex-col justify-center overflow-hidden py-24"
      aria-label="Appear to your audience"
    >
      <DiagonalCut />
      <motion.div
        style={reduced ? undefined : { x: driftLeft }}
        aria-hidden
        className="type-label whitespace-nowrap opacity-45"
      >
        {band.repeat(6)}
      </motion.div>

      <motion.div style={reduced ? undefined : { y: rise }} className="shell py-16 text-center">
        <h2 className="type-hero text-balance">
          appear to your{" "}
          <em className="italic-voice">audience</em>
          <span className="align-baseline">.</span>
        </h2>

        <p className="type-lead mx-auto mt-10 max-w-xl text-quiet">
          Two words we hold ourselves to. Not more reach — more recognition. Not more
          noise — more of the right people knowing exactly who you are.
        </p>
      </motion.div>

      <motion.div
        style={reduced ? undefined : { x: driftRight }}
        aria-hidden
        className="type-label whitespace-nowrap opacity-45"
      >
        {band.repeat(6)}
      </motion.div>
    </section>
  );
}
