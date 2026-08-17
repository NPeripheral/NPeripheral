"use client";

import { quoteFactors, quoteSteps } from "@/lib/data/pricing";
import { Button, ArrowRight } from "@/components/ui/Button";
import { Lines } from "@/components/motion/Lines";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

/**
 * Pricing.
 *
 * This replaced a four-tier rate card with fixed monthly prices, which
 * implied every business needs the same work. Custom pricing is only honest
 * if you explain what moves the number — so the factors are published, in
 * full, rather than hidden behind "contact us for pricing".
 */
export function PricingSection() {
  return (
    <section id="pricing" className="ground-cream relative py-24 md:py-36">
      <div className="shell">
        <div className="rule-b flex flex-col gap-6 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-baseline gap-4">
              <span className="type-label-sm text-ember">09</span>
              <span className="type-label text-quiet">Pricing</span>
            </div>
            <Lines
              as="h2"
              className="type-h1 mt-7 max-w-2xl"
              lines={[
                <span key="a">Priced around the work</span>,
                <span key="b">
                  you actually <em className="italic-voice text-ember">need</em>.
                </span>,
              ]}
            />
          </div>
          <Reveal mode="rise" delay={0.1}>
            <p className="type-body max-w-sm text-quiet">
              Every business has different goals, platforms and content needs. That is why
              our pricing is customized around the work you actually need — not a package
              that would be wrong for most of the people reading this.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h3 className="type-label rule-b pb-3 text-quiet">What moves a quote</h3>

            <Stagger as="ul" gap={0.05} className="mt-2">
              {quoteFactors.map((factor, i) => (
                <StaggerItem
                  as="li"
                  key={factor.key}
                  className="rule-b grid gap-2 py-5 md:grid-cols-12 md:gap-6"
                >
                  <span className="type-label-sm text-quieter md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="type-body md:col-span-4">{factor.title}</h4>
                  <p className="type-small text-quiet md:col-span-7">{factor.description}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <h3 className="type-label rule-b pb-3 text-quiet">How it works</h3>

              <ol className="mt-6 flex flex-col gap-5">
                {quoteSteps.map((step, i) => (
                  <li key={step} className="flex gap-4">
                    <span className="type-label-sm mt-1 shrink-0 text-ember">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="type-small text-quiet">{step}</p>
                  </li>
                ))}
              </ol>

              <div className="mt-9">
                <Button href="/contact" size="lg" trailingIcon={<ArrowRight />}>
                  Get a custom quote
                </Button>
              </div>

              <p className="type-small mt-7 text-quieter">
                No obligation, and no pressure on the call. If the scope does not make
                sense for your business right now, we will tell you.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
