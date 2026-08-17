"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type MarqueeProps = {
  items: ReactNode[];
  className?: string;
  itemClassName?: string;
  separator?: ReactNode;
  speed?: "normal" | "slow";
  reverse?: boolean;
};

/**
 * Infinite horizontal ticker. The list is rendered twice and translated by
 * exactly -50%, so the seam is never visible.
 */
export function Marquee({
  items,
  className,
  itemClassName,
  separator,
  speed = "normal",
  reverse = false,
}: MarqueeProps) {
  const track = [...items, ...items];

  return (
    <div className={cn("relative flex w-full overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max shrink-0 items-center",
          speed === "slow" ? "animate-marquee-slow" : "animate-marquee",
        )}
        style={reverse ? { animationDirection: "reverse" } : undefined}
        aria-hidden
      >
        {track.map((item, i) => (
          <span key={i} className={cn("flex items-center", itemClassName)}>
            {item}
            {separator ?? <span className="mx-6 text-ember md:mx-10">✳</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
