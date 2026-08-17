"use client";

import { workItems, conceptDisclaimer } from "@/lib/data/work";
import { Aperture } from "@/components/visual/Aperture";
import { Lines } from "@/components/motion/Lines";
import { Reveal } from "@/components/motion/Reveal";
import { Button, ArrowRight } from "@/components/ui/Button";

/**
 * Our work.
 *
 * This replaced a set of invented client case studies with before/after
 * revenue figures. Every item here is badged on its face as a concept, the
 * disclaimer sits above the fold of the section rather than in small print,
 * and no card carries a number.
 *
 * When real client work exists, set `kind: "client"` in lib/data/work.ts —
 * the badge and the disclaimer disappear for that item automatically.
 */
export function WorkSection({ standalone = false }: { standalone?: boolean }) {
  const hasConcepts = workItems.some((item) => item.kind === "concept");

  return (
    <section id="work" className="ground-cream relative py-24 md:py-36">
      <div className="shell">
        {standalone ? null : (
          <div className="rule-b flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-baseline gap-4">
                <span className="type-label-sm text-ember">05</span>
                <span className="type-label text-quiet">Our work</span>
              </div>
              <Lines
                as="h2"
                className="type-h1 mt-7"
                lines={[
                  <span key="a">
                    How we&apos;d <em className="italic-voice text-ember">approach it</em>.
                  </span>,
                ]}
              />
            </div>
            <Reveal mode="fade" delay={0.1}>
              <Button href="/work" variant="secondary" trailingIcon={<ArrowRight />}>
                See all work
              </Button>
            </Reveal>
          </div>
        )}

        {hasConcepts ? (
          <Reveal mode="fade">
            <p className="type-small rule-b max-w-2xl pb-6 pt-6 text-quiet">
              <span className="type-label-sm mr-3 text-ember">Please note</span>
              {conceptDisclaimer}
            </p>
          </Reveal>
        ) : null}

        <div className="mt-2">
          {workItems.map((item, i) => {
            const flip = i % 2 === 1;
            return (
              <article key={item.slug} className="rule-b py-14 md:py-20">
                <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
                  <Reveal
                    mode="mask"
                    className={`lg:col-span-5 ${flip ? "lg:order-2 lg:col-start-8" : ""}`}
                  >
                    <Aperture
                      figure={item.figure}
                      tone={item.tone}
                      anchor="center"
                      dot={4}
                      label={item.category}
                      index={String(i + 1).padStart(2, "0")}
                      className="aspect-[4/3] w-full border border-[var(--color-line-ink)]"
                    />
                  </Reveal>

                  <div className={`lg:col-span-6 ${flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}>
                    <Reveal mode="rise">
                      <div className="flex flex-wrap items-center gap-4">
                        <span
                          className={`type-label-sm border px-3 py-1.5 ${
                            item.kind === "concept"
                              ? "border-ember text-ember"
                              : "border-[var(--rule)] text-quiet"
                          }`}
                        >
                          {item.kind === "concept" ? "Concept project" : "Client work"}
                        </span>
                        <span className="type-label text-quieter">{item.category}</span>
                      </div>

                      <h3 className="type-h2 mt-6">{item.title}</h3>
                      <p className="type-body mt-5 max-w-lg text-quiet">{item.summary}</p>
                    </Reveal>

                    <Reveal mode="rise" delay={0.1}>
                      <h4 className="type-label rule-t mt-8 pt-6 text-quiet">The approach</h4>
                      <ul className="mt-5 flex flex-col gap-3">
                        {item.approach.map((line) => (
                          <li key={line} className="type-small flex gap-3 text-quiet">
                            <span aria-hidden className="mt-[0.55em] h-px w-3 shrink-0 bg-ember" />
                            {line}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <Reveal mode="rise" delay={0.1}>
          <div className="flex flex-col gap-5 pt-12 sm:flex-row sm:items-center sm:justify-between">
            <p className="type-h3 max-w-md">
              Want the first real one to be <em className="italic-voice text-ember">yours</em>?
            </p>
            <Button href="/contact" size="lg" trailingIcon={<ArrowRight />}>
              Let&apos;s talk about your business
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
