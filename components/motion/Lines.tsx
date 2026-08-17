"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type LinesProps = {
  lines: ReactNode[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  /** Animate on mount instead of waiting for the viewport (hero use). */
  immediate?: boolean;
  id?: string;
};

/**
 * Headline reveal: each line rides up from behind its own mask.
 *
 * Lines are authored explicitly rather than measured at runtime — the line
 * breaks in a display headline are a design decision, not an accident of
 * container width.
 */
export function Lines({
  lines,
  as = "h2",
  className,
  lineClassName,
  delay = 0,
  stagger = 0.09,
  immediate = false,
  id,
}: LinesProps) {
  const reduced = useReducedMotion();
  const Tag = as;

  if (reduced) {
    return (
      <Tag className={className} id={id}>
        {lines.map((line, i) => (
          <span key={i} className={cn("block", lineClassName)}>
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  const animateProps = immediate
    ? { animate: "show" as const }
    : { whileInView: "show" as const, viewport: { once: true, amount: 0.4 } };

  return (
    <motion.div
      initial="hidden"
      {...animateProps}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      <Tag className={className} id={id}>
        {lines.map((line, i) => (
          <span key={i} className={cn("line-mask", lineClassName)}>
            <motion.span
              className="block"
              variants={{
                hidden: { y: "108%", opacity: 0 },
                show: {
                  y: "0%",
                  opacity: 1,
                  transition: { duration: 1.05, ease: [0.16, 1, 0.3, 1] },
                },
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}

/**
 * Scroll-driven emphasis: words brighten as the block passes through the
 * middle of the viewport. Used once, for the manifesto.
 */
export function WordWash({
  text,
  className,
  wordClassName,
}: {
  text: string;
  className?: string;
  wordClassName?: string;
}) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  return (
    <p className={className} aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden
          className={cn("inline-block", wordClassName)}
          initial={{ opacity: 0.16 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-45% 0px -35% 0px" }}
          transition={{ duration: 0.5, ease: "easeOut", delay: i * 0.012 }}
        >
          {word}
          {i < words.length - 1 ? " " : null}
        </motion.span>
      ))}
    </p>
  );
}
