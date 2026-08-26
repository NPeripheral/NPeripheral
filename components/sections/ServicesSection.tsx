"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { services } from "@/lib/data/services";
import { Aperture, type ApertureFigure } from "@/components/visual/Aperture";
import { Reveal } from "@/components/motion/Reveal";
import { Lines } from "@/components/motion/Lines";
import { ArrowRight } from "@/components/ui/Button";
import { DiagonalCut } from "@/components/motion/DiagonalCut";

const FIGURES: Record<string, ApertureFigure> = {
  "social-media-management": "orbit",
  "content-strategy": "grid",
  "content-creation": "burst",
  "short-form-video": "wave",
  "social-media-optimization": "lens",
  "community-engagement": "orbit",
  "social-media-strategy": "column",
};

const PANEL_W = 300;
const PANEL_H = 380;

/**
 * Chapter 02 — the services index.
 *
 * A ruled list, not a grid of cards. Below lg there is no pointer to hover
 * with, so every row stays open; above it, the row you are pointing at
 * unfolds and a drawn panel follows the cursor.
 *
 * The note under the heading is load-bearing: no engagement includes all
 * seven, and the page says so rather than implying a bundle.
 */
export function ServicesSection() {
  const [active, setActive] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const listRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 26, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 220, damping: 26, mass: 0.5 });

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || reduced) return;
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clamp = (value: number, max: number) => Math.max(0, Math.min(value, max));
    x.set(clamp(event.clientX - rect.left - PANEL_W / 2, rect.width - PANEL_W));
    y.set(clamp(event.clientY - rect.top - PANEL_H / 2, rect.height - PANEL_H));
  }

  return (
    <section id="services" className="ground-ink cut-top relative py-24 md:py-36">
      <DiagonalCut />
      <div className="shell">
        <div className="rule-b flex flex-col gap-8 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-baseline gap-4">
              <span className="type-label-sm text-ember">02</span>
              <span className="type-label text-quiet">What we do</span>
            </div>
            <Lines
              as="h2"
              className="type-h1 mt-7 max-w-2xl"
              lines={[
                <span key="a">Seven services,</span>,
                <span key="b">
                  chosen <em className="italic-voice text-ember">per business</em>.
                </span>,
              ]}
            />
          </div>
          <Reveal mode="rise" delay={0.1}>
            <p className="type-body max-w-sm text-quiet">
              No engagement includes all seven by default. We recommend the ones your
              business actually needs and leave the rest out of the quote.
            </p>
          </Reveal>
        </div>

        <div ref={listRef} className="relative" onPointerMove={onPointerMove}>
          {!reduced ? (
            <motion.div
              aria-hidden
              style={{ x: springX, y: springY }}
              animate={{ opacity: active !== null ? 1 : 0, scale: active !== null ? 1 : 0.94 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none absolute left-0 top-0 z-20 hidden h-[380px] w-[300px] lg:block"
            >
              <Aperture
                figure={active !== null ? FIGURES[services[active].slug] ?? "lens" : "lens"}
                tone="ember"
                anchor="center"
                dot={4}
                className="h-full w-full"
                index={active !== null ? String(active + 1).padStart(2, "0") : undefined}
                label={active !== null ? services[active].title : undefined}
              />
            </motion.div>
          ) : null}

          <ul onPointerLeave={() => setActive(null)}>
            {services.map((service, i) => {
              const isActive = active === i;
              return (
                <li key={service.slug}>
                  <Link
                    href="/contact"
                    data-cursor="view"
                    data-cursor-label="Enquire"
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className="rule-b group/row block py-7 transition-colors duration-500 md:py-9"
                  >
                    <div className="flex items-start gap-5 md:gap-10">
                      <span
                        className={`type-label-sm mt-3 shrink-0 transition-colors duration-500 ${
                          isActive ? "text-ember" : "text-quieter"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3
                          className={`type-h3 transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:text-[clamp(1.75rem,3.2vw,2.75rem)] ${
                            isActive ? "text-bone lg:translate-x-3" : "text-bone lg:text-bone/55"
                          }`}
                        >
                          {service.title}
                        </h3>

                        <p
                          className={`type-small mt-3 max-w-lg transition-colors duration-500 lg:translate-x-0 ${
                            isActive ? "text-quiet lg:translate-x-3" : "text-quieter"
                          }`}
                        >
                          {service.summary}
                        </p>

                        <div
                          className={`grid grid-rows-[1fr] opacity-100 transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isActive
                              ? "lg:grid-rows-[1fr] lg:opacity-100"
                              : "lg:grid-rows-[0fr] lg:opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="type-small mt-4 max-w-lg text-quiet lg:translate-x-3">
                              {service.description}
                            </p>
                            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 lg:translate-x-3">
                              {service.includes.map((item) => (
                                <li key={item} className="type-label-sm text-quieter">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <span
                        className={`group/btn mt-2 hidden shrink-0 transition-[color,opacity] duration-500 md:block ${
                          isActive ? "text-ember opacity-100" : "text-quieter opacity-40"
                        }`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
