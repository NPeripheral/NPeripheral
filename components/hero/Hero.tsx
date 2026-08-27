"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Button, ArrowRight } from "@/components/ui/Button";
import { Lines } from "@/components/motion/Lines";
import { siteConfig } from "@/lib/site-config";
import { SceneSlot } from "@/components/scene/SceneSlot";
import { OceanGate } from "@/components/scene/OceanGate";

/**
 * Chapter 00.
 *
 * Composed on thirds: the statement sits in the empty left two-thirds and the
 * figure is locked to the right third.
 *
 * The baseline row carries what we can actually stand behind — where we work,
 * how we price, how fast we reply. It used to carry client counts and revenue
 * figures that were invented; those are gone and are not coming back until
 * there are real ones to put there.
 */

const marks = [
  { value: "Fort Worth, TX", label: "Based in" },
  { value: "Custom", label: "Pricing, per business" },
  { value: "1 business day", label: "Reply time" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const sillRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const figureY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const typeY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="ground-sea relative flex min-h-[100svh] flex-col justify-between overflow-hidden pt-28 md:pt-32"
      aria-labelledby="hero-heading"
    >
      <div className="relative flex flex-1 flex-col">
        <OceanGate />
        <div className="shell relative z-10 grid flex-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <motion.div
          style={reduced ? undefined : { y: typeY }}
          className="lg:col-span-7 lg:pr-10 xl:col-span-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="rule-b flex items-baseline gap-4 pb-3"
          >
            <span className="type-label-sm text-ember">00</span>
            <span className="type-label text-quiet">Social media marketing &amp; management</span>
          </motion.div>

          <Lines
            as="h1"
            id="hero-heading"
            immediate
            delay={0.25}
            className="type-hero mt-8"
            lines={[
              <span key="a">Appear</span>,
              <span key="b">to your</span>,
              <em key="c" className="italic-voice text-ember">
                audience.
              </em>,
            ]}
          />

          {/* The line that names what the work actually is, and what the mark
              on the masthead means. It arrives after the headline has landed. */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="type-lead mt-7 font-display text-[1.5rem] leading-tight text-bone"
          >
            We discover buried treasure.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
            className="type-lead mt-6 max-w-md text-quiet"
          >
            Social media marketing designed to help your business build a stronger online
            presence, connect with the right audience, and show up consistently.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button href="/contact" size="lg" trailingIcon={<ArrowRight />}>
              Get a custom quote
            </Button>
            <Button href="/#services" size="lg" variant="secondary">
              Explore services
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.15 }}
            /* On narrow viewports this line lands on the seabed, where white
               measures 1.69:1. Same fix as the sill and the figure labels: its
               own flat chip, rather than darkening sand until it stops reading
               as sand. inline-block so the chip wraps the text, not the column. */
            className="type-label-sm mt-6 inline-block bg-black/80 px-3 py-2 leading-[1.7] text-white"
          >
            {siteConfig.responsePromise}
          </motion.p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          style={reduced ? undefined : { y: figureY }}
          className="lg:col-span-5 lg:col-start-8 xl:col-span-4 xl:col-start-9"
        >
          <div className="overflow-hidden">
            <motion.div
              initial={{ y: "102%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.3, delay: 0.55, ease: [0.76, 0, 0.24, 1] }}
              style={{ willChange: "transform" }}
            >
              <SceneSlot
                tone="ink"
                label="Field of view"
                index="Fig. 01"
                className="h-[34vh] w-full border border-[var(--color-line)] sm:h-[40vh] lg:h-[62vh]"
              />
            </motion.div>
          </div>
        </motion.div>
        </div>
      </div>

      <motion.div
        ref={sillRef}
        style={reduced ? undefined : { opacity: fade }}
        className="relative z-10 mt-14 bg-black"
      >
        {/* The sill: the line the water stops at. Its own flat black ground so
            the marks below read at full contrast instead of fighting the sand,
            and the scene is scissored to end exactly at its top edge. */}
        <div className="shell pb-8 pt-6">
        <div className="flex flex-col gap-6 border-t border-white/40 pt-6 sm:flex-row sm:items-end sm:justify-between">
          <dl className="flex flex-wrap gap-x-10 gap-y-5">
            {marks.map((mark, i) => (
              <motion.div
                key={mark.label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.2 + i * 0.1 }}
              >
                <dt className="type-label-sm text-quieter">{mark.label}</dt>
                <dd className="font-display mt-2 text-xl tracking-tight md:text-2xl">
                  {mark.value}
                </dd>
              </motion.div>
            ))}
          </dl>

          <motion.a
            href="#services"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="type-label-sm group inline-flex items-center gap-3 self-start text-quieter transition-colors hover:text-bone sm:self-end"
          >
            Scroll
            <span className="relative flex h-8 w-px overflow-hidden bg-[var(--color-line)]">
              <motion.span
                className="absolute inset-x-0 top-0 h-3 bg-ember"
                animate={reduced ? undefined : { y: [-12, 32] }}
                transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.a>
        </div>
        </div>
      </motion.div>
    </section>
  );
}
