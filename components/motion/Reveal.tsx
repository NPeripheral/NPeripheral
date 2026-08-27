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

const SNAP = [0.2, 1.4, 0.4, 1] as const;
const SOFT = [0.22, 1, 0.36, 1] as const;

/**
 * The Persona 5 entrance. Distinct from <Stagger> on purpose.
 *
 * Stagger is for prose arriving; Cascade is for a mechanism firing. It is fast
 * (45ms apart, 420ms each, under 700ms total) because past ~700ms a sequence
 * stops reading as one event and starts reading as a queue — and the whole
 * premise is that this is an event.
 *
 * Budget: at most one per chapter, and only on genuine enumerations. If it
 * becomes the site's default entrance it stops being spectacle.
 */
export function Cascade({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }}
    >
      {children}
    </motion.div>
  );
}

/**
 * `as` exists because the first real caller is a <ul> of services, and
 * `ul > div > li` is invalid HTML. Restricted to the two tags actually needed
 * rather than a generic ElementType, so framer-motion's props stay typed.
 */
export function CascadeItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const reduced = useReducedMotion();
  const Tag = as === "li" ? motion.li : motion.div;
  if (reduced) {
    return as === "li" ? <li className={className}>{children}</li> : <div className={className}>{children}</div>;
  }
  return (
    <Tag
      className={className}
      variants={{
        // Travel is along the 6.5° cut axis, so entrance and layout share one
        // vector. Opacity finishes early on a non-overshooting curve — an
        // overshoot under a semi-transparent item is invisible.
        hidden: { x: -21.86, y: -2.49, opacity: 0 },
        show: {
          x: 0,
          y: 0,
          opacity: 1,
          transition: {
            x: { duration: 0.42, ease: SNAP },
            y: { duration: 0.42, ease: SNAP },
            opacity: { duration: 0.2, ease: SOFT },
          },
        },
      }}
    >
      {children}
    </Tag>
  );
}
