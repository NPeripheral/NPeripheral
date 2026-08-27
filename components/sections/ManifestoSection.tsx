"use client";

import { WordWash } from "@/components/motion/Lines";
import { Reveal } from "@/components/motion/Reveal";
import { positioning } from "@/lib/data/about";
import { DiagonalCut } from "@/components/motion/DiagonalCut";

/**
 * Chapter 01 — the argument, on cream.
 *
 * The first inversion of the page. One flat ground, one column, and text that
 * inks in as it passes the middle of the viewport. This is the positioning
 * statement the whole brand hangs off.
 */
export function ManifestoSection() {
  return (
    <section className="ground-cream cut-top relative py-28 md:py-44">
      <DiagonalCut />
      <div className="shell">
        <Reveal mode="fade">
          <div className="rule-b flex items-baseline gap-4 pb-3">
            <span className="type-label-sm text-ember">01</span>
            <span className="type-label text-quiet">The premise</span>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:col-start-3">
            <WordWash
              className="type-h1 text-balance"
              text={`${positioning.headline} ${positioning.emphasis}`}
            />

            <Reveal mode="rise" delay={0.1}>
              <p className="type-lead mt-12 max-w-xl text-quiet">{positioning.body}</p>
            </Reveal>
          </div>
        </div>

        <Reveal mode="fade" delay={0.2}>
          <div className="rule-t mt-20 grid gap-8 pt-8 sm:grid-cols-3">
            {[
              {
                k: "Peripheral",
                v: "Posting happens, but nobody could describe what you do from your profile.",
              },
              {
                k: "Present",
                v: "Consistent, recognisable, and current — the account looks like a business that is open.",
              },
              {
                k: "The work",
                v: "Strategy, content, and enough repetition that it holds after we hand it back.",
              },
            ].map((item) => (
              <div key={item.k}>
                <h3 className="type-label text-ember">{item.k}</h3>
                <p className="type-small mt-3 text-quiet">{item.v}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
