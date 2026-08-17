"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A one-pixel ember rule at the top of the viewport tracking read position. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-ember"
    />
  );
}
