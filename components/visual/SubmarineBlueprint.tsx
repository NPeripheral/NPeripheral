"use client";

import { cn } from "@/lib/utils";
import { processStages } from "@/lib/data/process";

/**
 * The plan, drawn as a submarine cutaway.
 *
 * Strictly two colours: white on black. Nothing is set in a tint or a low
 * opacity that would cost legibility -- the brief was that every word and every
 * line in this section reads, so structure carries the hierarchy instead of
 * colour. Line WEIGHT and dash pattern separate the drawing's registers:
 * hull is solid and heaviest, bulkheads medium, construction lines dashed.
 */
const HULL_STROKE = 2;
const BULKHEAD_STROKE = 1.25;
const CONSTRUCTION_STROKE = 0.75;

export function SubmarineBlueprint({ className }: { className?: string }) {
  const stages = processStages.slice(0, 4);

  return (
    <div className={cn("relative w-full", className)}>
      {/* On a phone the drawing scales to ~327px, which fits but renders its
          station labels at about 4px -- present and unreadable. A technical
          drawing should keep its scale and pan, the way a wide table does,
          rather than shrink until it is decoration. The page itself never
          scrolls sideways; only this box does. */}
      <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
      <svg
        viewBox="0 0 1200 460"
        className="w-full min-w-[680px]"
        role="img"
        aria-label="The four stages of the process, drawn as a submarine cutaway"
      >
        <defs>
          {/* Drafting grid. Kept faint enough to read as paper, not as content. */}
          <pattern id="bp-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" fill="none" stroke="#fff" strokeWidth="0.4" opacity="0.16" />
          </pattern>
          <pattern id="bp-grid-fine" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M8 0H0V8" fill="none" stroke="#fff" strokeWidth="0.3" opacity="0.08" />
          </pattern>
        </defs>

        <rect width="1200" height="460" fill="#000" />
        <rect width="1200" height="460" fill="url(#bp-grid-fine)" />
        <rect width="1200" height="460" fill="url(#bp-grid)" />

        {/* --- drawing frame + title block ---------------------------------- */}
        <rect
          x="16" y="16" width="1168" height="428"
          fill="none" stroke="#fff" strokeWidth={CONSTRUCTION_STROKE} opacity="0.55"
        />
        <g fill="#fff" fontFamily="var(--font-mono)" fontSize="11" letterSpacing="1.4">
          <text x="34" y="42">NPERIPHERAL — PLAN OF WORK</text>
          <text x="1166" y="42" textAnchor="end">SHEET 01 / SCALE 1:1</text>
          <text x="34" y="432">SECTION VIEW — FOUR COMPARTMENTS, BOW TO STERN</text>
          <text x="1166" y="432" textAnchor="end">DISCOVER · STRATEGIZE · CREATE · APPEAR</text>
        </g>

        {/* --- centreline --------------------------------------------------- */}
        <line
          x1="60" y1="230" x2="1140" y2="230"
          stroke="#fff" strokeWidth={CONSTRUCTION_STROKE}
          strokeDasharray="14 6 2 6" opacity="0.6"
        />

        {/* --- hull --------------------------------------------------------- */}
        {/* bow at the left, tapering to the stern and propeller at the right */}
        <path
          d="M150 230
             C150 168 214 140 300 140
             L890 140
             C960 140 1002 168 1016 230
             C1002 292 960 320 890 320
             L300 320
             C214 320 150 292 150 230 Z"
          fill="none" stroke="#fff" strokeWidth={HULL_STROKE}
        />
        {/* pressure hull, drawn inside the outer hull */}
        <path
          d="M186 230
             C186 186 236 166 306 166
             L880 166
             C938 166 972 188 984 230
             C972 272 938 294 880 294
             L306 294
             C236 294 186 274 186 230 Z"
          fill="none" stroke="#fff" strokeWidth={CONSTRUCTION_STROKE}
          strokeDasharray="6 5" opacity="0.75"
        />

        {/* --- conning tower ------------------------------------------------ */}
        <path
          d="M470 140 L470 84 C470 74 478 68 490 68 L586 68 C598 68 606 74 606 84 L606 140"
          fill="none" stroke="#fff" strokeWidth={HULL_STROKE}
        />
        <line x1="538" y1="68" x2="538" y2="26" stroke="#fff" strokeWidth={BULKHEAD_STROKE} />
        <line x1="524" y1="30" x2="552" y2="30" stroke="#fff" strokeWidth={BULKHEAD_STROKE} />

        {/* --- dive planes -------------------------------------------------- */}
        <path d="M214 152 L150 130 L150 142 L212 164" fill="none" stroke="#fff" strokeWidth={BULKHEAD_STROKE} />
        <path d="M962 152 L1030 128 L1030 140 L964 164" fill="none" stroke="#fff" strokeWidth={BULKHEAD_STROKE} />

        {/* --- propeller ---------------------------------------------------- */}
        <line x1="1016" y1="230" x2="1078" y2="230" stroke="#fff" strokeWidth={BULKHEAD_STROKE} />
        <g stroke="#fff" strokeWidth={BULKHEAD_STROKE} fill="none">
          <ellipse cx="1086" cy="230" rx="9" ry="9" />
          <path d="M1086 221 C1104 206 1116 210 1112 226 C1108 238 1096 236 1086 230" />
          <path d="M1086 239 C1068 254 1056 250 1060 234 C1064 222 1076 224 1086 230" />
        </g>

        {/* --- four compartments -------------------------------------------- */}
        {stages.map((stage, i) => {
          const x0 = 186 + i * 200;
          const mid = x0 + 100;
          return (
            <g key={stage.step}>
              {/* bulkhead between compartments */}
              {i > 0 ? (
                <line
                  x1={x0} y1="168" x2={x0} y2="292"
                  stroke="#fff" strokeWidth={BULKHEAD_STROKE}
                />
              ) : null}

              {/* station number on the centreline */}
              <circle cx={mid} cy="230" r="15" fill="#000" stroke="#fff" strokeWidth={BULKHEAD_STROKE} />
              <text
                x={mid} y="235" textAnchor="middle"
                fill="#fff" fontFamily="var(--font-mono)" fontSize="12" letterSpacing="0.5"
              >
                {stage.step}
              </text>

              {/* leader line up to the label */}
              <line
                x1={mid} y1="215" x2={mid} y2="196"
                stroke="#fff" strokeWidth={CONSTRUCTION_STROKE} opacity="0.8"
              />
              <text
                x={mid} y="190" textAnchor="middle"
                fill="#fff" fontFamily="var(--font-mono)" fontSize="13" letterSpacing="1.6"
              >
                {stage.title.toUpperCase()}
              </text>

              {/* dimension tick below the hull */}
              <line x1={x0} y1="344" x2={x0} y2="356" stroke="#fff" strokeWidth={CONSTRUCTION_STROKE} opacity="0.7" />
              <line
                x1={x0} y1="350" x2={x0 + 200} y2="350"
                stroke="#fff" strokeWidth={CONSTRUCTION_STROKE} opacity="0.7"
              />
            </g>
          );
        })}
        <line x1="986" y1="344" x2="986" y2="356" stroke="#fff" strokeWidth={CONSTRUCTION_STROKE} opacity="0.7" />
      </svg>
      </div>

      {/* The stage copy, in the same two colours. Set as real text rather than
          inside the SVG so it stays selectable, translatable and responsive. */}
      <ol className="mt-10 grid gap-px border border-white/40 bg-white/40 sm:grid-cols-2 lg:grid-cols-4">
        {stages.map((stage) => (
          <li key={stage.step} className="bg-black p-6">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[11px] tracking-[0.14em] text-white">
                {stage.step}
              </span>
              <h3 className="font-mono text-[13px] uppercase tracking-[0.14em] text-white">
                {stage.title}
              </h3>
            </div>
            <p className="mt-4 text-[15px] leading-6 text-white">{stage.description}</p>
            <p className="mt-4 border-t border-white/40 pt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white">
              {stage.output}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
