"use client";

import { Lines } from "@/components/motion/Lines";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Button, ArrowRight } from "@/components/ui/Button";
import { Aperture } from "@/components/visual/Aperture";

const starts = [
  {
    key: "scratch",
    title: "Starting from scratch",
    body: "No accounts, or accounts that were set up once and never used. We start with the profile and the plan before anything gets posted.",
  },
  {
    key: "inconsistent",
    title: "Gone quiet",
    body: "You posted properly for a while and then work got busy. We rebuild a rhythm you can actually keep once the engagement ends.",
  },
  {
    key: "scattered",
    title: "Spread too thin",
    body: "Four platforms, none of them convincing. We usually recommend consolidating before expanding.",
  },
];

/**
 * The section that makes it comfortable for a small business to say yes.
 *
 * It names the three states people actually arrive in, and it does it without
 * either flattering the reader or apologising for us.
 */
export function StarterSection() {
  return (
    <section className="ground-ink-2 relative py-24 md:py-32">
      <div className="shell">
        <div className="rule-b flex flex-col gap-6 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-baseline gap-4">
              <span className="type-label-sm text-ember">03</span>
              <span className="type-label text-quiet">Where you are now</span>
            </div>
            <Lines
              as="h2"
              className="type-h1 mt-7 max-w-2xl"
              lines={[
                <span key="a">Built for businesses</span>,
                <span key="b">
                  ready to be <em className="italic-voice text-ember">seen</em>.
                </span>,
              ]}
            />
          </div>
          <Reveal mode="rise" delay={0.1}>
            <p className="type-body max-w-sm text-quiet">
              Whether you are starting from scratch or your social media has simply become
              inconsistent, we can help you build a stronger, more intentional presence —
              scoped to what you actually need and what you can spend.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Stagger className="lg:col-span-7" gap={0.09}>
            {starts.map((item, i) => (
              <StaggerItem key={item.key} className="rule-b py-7 md:py-9">
                <div className="flex items-start gap-5 md:gap-8">
                  <span className="type-label-sm mt-2 shrink-0 text-quieter">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="type-h3">{item.title}</h3>
                    <p className="type-small mt-3 max-w-lg text-quiet">{item.body}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}

            <Reveal mode="rise" delay={0.1}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button href="/contact" trailingIcon={<ArrowRight />}>
                  Get a custom quote
                </Button>
                <p className="type-label-sm max-w-[16rem] leading-[1.7] text-quieter">
                  Plans are built around your needs and your budget
                </p>
              </div>
            </Reveal>
          </Stagger>

          <Reveal mode="mask" className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <Aperture
              figure="horizon"
              tone="ink"
              anchor="center"
              dot={5}
              label="Starting point"
              index="Fig. 03"
              className="aspect-[3/4] w-full border border-[var(--color-line)]"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
