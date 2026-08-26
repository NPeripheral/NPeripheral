import { cn } from "@/lib/utils";

type DiagonalCutProps = {
  /** Match the section's cut-top-reverse. Used once, at the Diptych. */
  reverse?: boolean;
  className?: string;
};

/**
 * The 1px ember hairline that rides a chapter cut.
 *
 * Drawn as an SVG line corner-to-corner in a box exactly one --cut-rise tall,
 * with preserveAspectRatio="none". That means the line IS the cut angle by
 * construction — it cannot drift out of alignment with the clip-path the way a
 * rotated pseudo-element would, at any viewport width.
 *
 * vectorEffect keeps the stroke 1px after the non-uniform scale.
 *
 * Reuses the seam device already established at
 * components/sections/DiptychSection.tsx:107 (w-px bg-ember).
 */
export function DiagonalCut({ reverse = false, className }: DiagonalCutProps) {
  return (
    <svg
      aria-hidden
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-10 h-[var(--cut-rise)] w-full text-ember",
        className,
      )}
    >
      <line
        x1="0"
        y1={reverse ? 100 : 0}
        x2="100"
        y2={reverse ? 0 : 100}
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
