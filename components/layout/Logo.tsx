"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The mark: an N held inside a frame, with a single ember node sitting just
 * off the diagonal — the thing at the edge of vision that you finally notice.
 * Flat, no gradient, one accent.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-8 w-8", className)} aria-hidden>
      <rect
        x="0.7"
        y="0.7"
        width="38.6"
        height="38.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity="0.32"
        className="transition-opacity duration-500 group-hover:opacity-70"
      />
      <path
        d="M11 29V11h3l12 13.4V11h3v18h-3L14 15.6V29h-3Z"
        fill="currentColor"
      />
      <circle
        cx="31.5"
        cy="8.5"
        r="3"
        fill="var(--color-ember)"
        className="origin-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.35]"
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
