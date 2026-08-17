"use client";

import { cn } from "@/lib/utils";
import { HalftoneVeil } from "@/components/visual/HalftoneVeil";

export type ApertureFigure = "lens" | "column" | "horizon" | "orbit" | "wave" | "burst" | "grid";
export type ApertureTone = "ink" | "cream" | "ember";

type ApertureProps = {
  figure?: ApertureFigure;
  tone?: ApertureTone;
  /** Lock the figure into a third of the frame, the way a painter would. */
  anchor?: "left" | "center" | "right";
  className?: string;
  /** Halftone density in px. Smaller reads sharper — "more resolved". */
  dot?: number;
  label?: string;
  index?: string;
  /**
   * Paint a cursor-reactive halftone veil over the figure. Opt-in: used on the
   * hero and the chapter panels that deserve a moment, not on every tile —
   * an effect everywhere is an effect nowhere.
   */
  interactive?: boolean;
};

const TONES: Record<ApertureTone, { ground: string; figure: string; accent: string; quiet: string }> = {
  ink: { ground: "#121010", figure: "#f4efe6", accent: "#e2542a", quiet: "rgba(244,239,230,0.22)" },
  cream: { ground: "#e8e0d2", figure: "#0b0a09", accent: "#e2542a", quiet: "rgba(11,10,9,0.18)" },
  ember: { ground: "#e2542a", figure: "#fff6f1", accent: "#0b0a09", quiet: "rgba(255,246,241,0.34)" },
};

/**
 * The house image treatment.
 *
 * Every visual on the site is drawn rather than photographed: a flat ground,
 * a halftone field, and one geometric figure locked to a third of the frame.
 * It ships no bytes, scales to any viewport, and — because the halftone
 * resolves on approach — it literally performs the brand line.
 */
export function Aperture({
  figure = "lens",
  tone = "ink",
  anchor = "right",
  className,
  dot = 5,
  label,
  index,
  interactive = false,
}: ApertureProps) {
  const c = TONES[tone];
  const cx = anchor === "left" ? 33 : anchor === "center" ? 50 : 67;

  return (
    <div
      className={cn(
        "group/aperture relative isolate overflow-hidden",
        className,
      )}
      style={{ background: c.ground }}
    >
      {/* Halftone field — tightens on approach, so the frame resolves.
          Suppressed when the canvas veil is doing the same job with real dots. */}
      <div
        className={cn(
          "absolute inset-0 z-[1] transition-[background-size,opacity] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
          interactive ? "opacity-0" : "opacity-70 group-hover/aperture:opacity-40",
        )}
        style={{
          backgroundImage: `radial-gradient(${c.quiet} 0.9px, transparent 1px)`,
          backgroundSize: `${dot}px ${dot}px`,
        }}
      />

      <svg
        viewBox="0 0 100 125"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 z-[2] h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/aperture:scale-[1.045]"
        aria-hidden
      >
        {figure === "lens" ? (
          <g>
            <circle cx={cx} cy="58" r="30" fill="none" stroke={c.quiet} strokeWidth="0.7" />
            <circle cx={cx} cy="58" r="22" fill="none" stroke={c.figure} strokeWidth="0.7" opacity="0.5" />
            <circle cx={cx} cy="58" r="13" fill={c.accent} />
            <circle cx={cx} cy="58" r="4.5" fill={c.ground} />
            <line x1="0" y1="58" x2={cx - 31} y2="58" stroke={c.quiet} strokeWidth="0.7" />
            <line x1={cx + 31} y1="58" x2="100" y2="58" stroke={c.quiet} strokeWidth="0.7" />
          </g>
        ) : null}

        {figure === "column" ? (
          <g>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const h = [18, 34, 26, 62, 44, 78, 30][i];
              const x = cx - 27 + i * 9;
              return (
                <rect
                  key={i}
                  x={x}
                  y={96 - h}
                  width="4.5"
                  height={h}
                  fill={i === 5 ? c.accent : c.figure}
                  opacity={i === 5 ? 1 : 0.28}
                />
              );
            })}
            <line x1="0" y1="96" x2="100" y2="96" stroke={c.quiet} strokeWidth="0.7" />
          </g>
        ) : null}

        {figure === "horizon" ? (
          <g>
            <line x1="0" y1="74" x2="100" y2="74" stroke={c.figure} strokeWidth="0.7" opacity="0.55" />
            <circle cx={cx} cy="74" r="26" fill={c.accent} />
            <path
              d={`M ${cx - 26} 74 A 26 26 0 0 0 ${cx + 26} 74 Z`}
              fill={c.ground}
              opacity="0.55"
            />
            <circle cx={cx} cy="74" r="26" fill="none" stroke={c.figure} strokeWidth="0.7" opacity="0.4" />
          </g>
        ) : null}

        {figure === "orbit" ? (
          <g>
            <ellipse cx={cx} cy="60" rx="34" ry="13" fill="none" stroke={c.quiet} strokeWidth="0.7" />
            <ellipse
              cx={cx}
              cy="60"
              rx="34"
              ry="13"
              fill="none"
              stroke={c.figure}
              strokeWidth="0.7"
              opacity="0.4"
              transform={`rotate(60 ${cx} 60)`}
            />
            <ellipse
              cx={cx}
              cy="60"
              rx="34"
              ry="13"
              fill="none"
              stroke={c.figure}
              strokeWidth="0.7"
              opacity="0.4"
              transform={`rotate(-60 ${cx} 60)`}
            />
            <circle cx={cx} cy="60" r="7" fill={c.accent} />
          </g>
        ) : null}

        {figure === "wave" ? (
          <g>
            {[0, 1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M ${cx - 40} ${52 + i * 11} Q ${cx - 20} ${36 + i * 11}, ${cx} ${52 + i * 11} T ${cx + 40} ${52 + i * 11}`}
                fill="none"
                stroke={i === 0 ? c.accent : c.figure}
                strokeWidth="0.8"
                opacity={i === 0 ? 1 : 0.34 - i * 0.06}
              />
            ))}
          </g>
        ) : null}

        {figure === "burst" ? (
          <g>
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * Math.PI * 2;
              const inner = 9;
              const outer = i % 2 === 0 ? 34 : 24;
              return (
                <line
                  key={i}
                  x1={cx + Math.cos(angle) * inner}
                  y1={62 + Math.sin(angle) * inner}
                  x2={cx + Math.cos(angle) * outer}
                  y2={62 + Math.sin(angle) * outer}
                  stroke={c.accent}
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx={cx} cy="62" r="5" fill={c.figure} />
          </g>
        ) : null}

        {figure === "grid" ? (
          <g>
            {Array.from({ length: 36 }).map((_, i) => {
              const row = Math.floor(i / 6);
              const col = i % 6;
              const on = row === 2 && col === 4;
              return (
                <circle
                  key={i}
                  cx={cx - 30 + col * 12}
                  cy={36 + row * 12}
                  r={on ? 5.5 : 1.8}
                  fill={on ? c.accent : c.figure}
                  opacity={on ? 1 : 0.3}
                />
              );
            })}
          </g>
        ) : null}
      </svg>

      {interactive ? <HalftoneVeil color={c.ground} cell={7} rest={0.56} reach={140} /> : null}

      {/* Grain, so the flat colour has a surface. */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {(label || index) && (
        <div
          className="absolute inset-x-0 bottom-0 z-[4] flex items-end justify-between gap-4 p-4 md:p-5"
          style={{ color: c.figure }}
        >
          {label ? <span className="type-label-sm opacity-70">{label}</span> : <span />}
          {index ? <span className="type-label-sm opacity-70">{index}</span> : null}
        </div>
      )}
    </div>
  );
}
