"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  /** How far the element is allowed to follow the pointer, in px. */
  strength?: number;
};

/**
 * Pointer attraction. Deliberately understated — a few pixels of pull reads
 * as craft; a large offset reads as a gimmick.
 */
export function Magnetic({ children, className, strength = 14 }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.4 });

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      ref={ref}
      className={className}
      style={{ x: springX, y: springY, display: "inline-block", willChange: "transform" }}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        const relX = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        const relY = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        x.set(Math.max(-1, Math.min(1, relX)) * strength);
        y.set(Math.max(-1, Math.min(1, relY)) * strength * 0.7);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
