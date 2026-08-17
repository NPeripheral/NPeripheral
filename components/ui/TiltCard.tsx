"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PanelProps = {
  children: ReactNode;
  className?: string;
  /** Retained from the previous API; now selects an accent edge, not a glow. */
  glow?: "purple" | "blue" | "coral" | "lime";
  accent?: boolean;
} & Omit<HTMLAttributes<HTMLDivElement>, "className" | "children">;

/**
 * A ruled panel.
 *
 * This replaced a tilting, glowing card. The page is composed on hairlines,
 * so a surface here earns its separation from a rule and a shift in ground —
 * not from perspective transforms and coloured light.
 */
export function TiltCard({ children, className, accent, glow, ...rest }: PanelProps) {
  // Accepted for API compatibility with the previous card; the panel no longer
  // tints, so it is deliberately not forwarded to the DOM.
  void glow;

  return (
    <div
      {...rest}
      className={cn(
        "group/panel relative border border-[var(--rule,var(--color-line))] bg-[color-mix(in_oklab,currentColor_3%,transparent)] transition-colors duration-500 hover:border-ember",
        className,
      )}
    >
      {/* A rule that draws itself across the top edge on approach. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-ember transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/panel:scale-x-100",
          accent && "scale-x-100",
        )}
      />
      {children}
    </div>
  );
}

export const Panel = TiltCard;
