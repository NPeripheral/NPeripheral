"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The mark: a treasure chest whose lid and body cut out an N, with an ember
 * keyhole at its centre.
 *
 * Built as flat geometry rather than an imported bitmap so it inherits
 * currentColor, stays crisp at every size, and needs no asset pipeline. The
 * keyhole is the one accent — same restraint as the rest of the system.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn("h-8 w-8", className)} aria-hidden>
      <g fill="currentColor">
        {/* lid — rounded top, with the N's counter cut out of it */}
        <path d="M18 46V33c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v13h-14v-9h-8v9H40v-9h-8v9H18Z" />
        {/* body — left post, right post, and the N's diagonal between them */}
        <path d="M18 52h14v13l-6 6v14h-8V52Z" />
        <path d="M82 52H68v13l6 6v14h8V52Z" />
        {/* the N: two stems joined by the diagonal */}
        <path d="M40 52h8l12 16V52h8v33h-8L48 69v16h-8V52Z" />
      </g>
      {/* the keyhole: the one accent in the mark */}
      <path
        d="M50 55a7 7 0 0 1 3.6 13L57 85H43l3.4-17A7 7 0 0 1 50 55Z"
        fill="var(--color-ember)"
        className="origin-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
        style={{ transformBox: "fill-box" }}
      />
    </svg>
  );
}

export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-3", className)}
      aria-label="NPeripheral — home"
    >
      <LogoMark />
      {showWordmark ? (
        <span className="font-display text-[1.0625rem] tracking-tight">
          NPeripheral
        </span>
      ) : null}
    </Link>
  );
}
