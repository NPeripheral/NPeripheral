"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealMode = "rise" | "fade" | "mask" | "blur" | "slide";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  mode?: RevealMode;
  delay?: number;
  duration?: number;
  amount?: number;
  once?: boolean;
  className?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

function buildVariants(mode: RevealMode, duration: number, delay: number): Variants {
  const transition = { duration, delay, ease: EASE };

  switch (mode) {
    case "fade":
      return { hidden: { opacity: 0 }, show: { opacity: 1, transition } };
    case "mask":
      // Handled by a wrapper below — see the note in Reveal.
      return {
        hidden: { y: "102%" },
        show: { y: "0%", transition: { ...transition, duration: duration * 1.2 } },
      };
    case "blur":
      return {
        hidden: { opacity: 0, filter: "blur(14px)", scale: 1.015 },
        show: { opacity: 1, filter: "blur(0px)", scale: 1, transition: { ...transition, duration: duration * 1.2 } },
      };
    case "slide":
      return { hidden: { opacity: 0, x: 48 }, show: { opacity: 1, x: 0, transition } };
    default:
      return { hidden: { opacity: 0, y: 34 }, show: { opacity: 1, y: 0, transition } };
  }
}

/**
 * Scroll-triggered entrance. Everything on the page arrives through this so
 * timing and easing stay consistent instead of being re-invented per section.
 */
export function Reveal({
  children,
  as = "div",
  mode = "rise",
  delay = 0,
  duration = 0.8,
  amount = 0.25,
  once = true,
  className,
}: RevealProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as "div"] ?? motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  const variants = buildVariants(mode, duration, delay);

  // The mask reveal is a clipping frame plus a translated child rather than an
  // animated clip-path: clip-path values normalise differently at each end
  // ("inset(0 0 100% 0)" collapses, "inset(0 0 0 0)" collapses further), which
  // leaves the interpolation stranded and the content permanently hidden.
  // A translate inside overflow:hidden is also the cheaper of the two.
  if (mode === "mask") {
    return (
      <MotionTag
        className={cn("overflow-hidden", className)}
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount }}
        variants={{ hidden: {}, show: {} }}
      >
        <motion.div variants={variants} style={{ willChange: "transform" }}>
          {children}
        </motion.div>
      </MotionTag>
    );
  }

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
    >
      {children}
    </MotionTag>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  amount?: number;
  as?: ElementType;
};

/** Parent for staggered children — pair with <StaggerItem>. */
export function Stagger({ children, className, gap = 0.08, delay = 0, amount = 0.2, as = "div" }: StaggerProps) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as "div"] ?? motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </MotionTag>
  );
}

export function StaggerItem({
  children,
  className,
  mode = "rise",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  mode?: RevealMode;
  as?: ElementType;
}) {
  const reduced = useReducedMotion();
  const MotionTag = motion[as as "div"] ?? motion.div;

  if (reduced) {
    const Tag = as as ElementType;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag className={className} variants={buildVariants(mode, 0.8, 0)}>
      {children}
    </MotionTag>
  );
}
