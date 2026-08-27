"use client";

import { Button, ArrowRight } from "@/components/ui/Button";
import { Lines } from "@/components/motion/Lines";
import { Reveal } from "@/components/motion/Reveal";
import { Aperture } from "@/components/visual/Aperture";
import { siteConfig } from "@/lib/site-config";
import { DiagonalCut } from "@/components/motion/DiagonalCut";

/**
 * The close.
 *
 * Back to ink, composed on thirds like the hero so the page ends where it
 * began. One question, one action, and the ways to reach a person underneath.
 */
export function FinalCta() {
  return (
    <section id="contact-cta" className="ground-ink cut-top relative py-24 md:py-36">
      <DiagonalCut />
      <div className="shell">
        <div className="rule-b flex items-baseline gap-4 pb-3">
          <span className="type-label-sm text-ember">11</span>
          <span className="type-label text-quiet">Start here</span>
        </div>

        <div className="grid items-center gap-12 pt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <Lines
              as="h2"
              className="type-hero"
              lines={[
                <span key="a">Let&apos;s build</span>,
                <span key="b">
                  your <em className="italic-voice text-ember">presence.</em>
                </span>,
              ]}
            />

            <Reveal mode="rise" delay={0.15}>
              <p className="type-lead mt-9 max-w-md text-quiet">
                Tell us about your business and what you want social media to do for it.
                You will get a scope and a price built around that — whether or not you
                decide to go ahead.
              </p>
            </Reveal>

            <Reveal mode="rise" delay={0.25}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button href="/contact" size="lg" trailingIcon={<ArrowRight />}>
                  Get a custom quote
                </Button>
                <Button href="/#services" size="lg" variant="secondary">
                  Explore services
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal
            mode="mask"
            delay={0.1}
            className="hidden lg:col-span-4 lg:col-start-9 lg:block"
          >
            <Aperture
              figure="burst"
              tone="ink"
              anchor="center"
              dot={4}
              interactive
              label="Now"
              index="Fig. 11"
              className="aspect-[3/4] w-full border border-[var(--color-line)]"
            />
          </Reveal>
        </div>

        <Reveal mode="fade" delay={0.2}>
          <dl className="rule-t mt-20 grid gap-8 pt-8 sm:grid-cols-3">
            <div>
              <dt className="type-label-sm text-quieter">Email</dt>
              <dd className="mt-3">
                <a href={`mailto:${siteConfig.email}`} className="type-body link-underline break-all">
                  {siteConfig.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="type-label-sm text-quieter">Phone</dt>
              <dd className="mt-3">
                <a href={`tel:${siteConfig.phoneHref}`} className="type-body link-underline">
                  {siteConfig.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="type-label-sm text-quieter">Response time</dt>
              <dd className="type-body mt-3 text-quiet">Within one business day</dd>
            </div>
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
