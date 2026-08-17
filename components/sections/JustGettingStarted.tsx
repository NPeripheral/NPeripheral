"use client";

import { Lines } from "@/components/motion/Lines";
import { Reveal } from "@/components/motion/Reveal";
import { Button, ArrowRight } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

const offers = [
  {
    key: "attention",
    title: "Direct access",
    body: "You work with the person doing the work. No account manager relaying messages to a team you never meet.",
  },
  {
    key: "shape",
    title: "A say in how this runs",
    body: "Early clients shape how we work — cadence, reporting, what is useful and what is noise. That input is worth more to us than it would be to an agency with a fixed playbook.",
  },
  {
    key: "priced",
    title: "Priced like a company earning its reputation",
    body: "Scoped honestly, without the overhead of an agency that needs to fill a floor of desks.",
  },
];

/**
 * Replaces what used to be a testimonial carousel of invented clients.
 *
 * A new company with no reviews has two options: fabricate social proof, or
 * be straight about it and make the invitation the point. This is the second
 * one — confident, not apologetic, and it asks for the thing it wants.
 */
export function JustGettingStarted() {
  return (
    <section className="ground-ember relative py-24 md:py-32">
      <div className="shell">
        <div className="rule-b flex items-baseline gap-4 pb-3">
          <span className="type-label-sm">07</span>
          <span className="type-label text-quiet">Where we are</span>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Lines
              as="h2"
              className="type-h1"
              lines={[
                <span key="a">We&apos;re just</span>,
                <span key="b">
                  getting <em className="italic-voice">started</em>.
                </span>,
              ]}
            />

            <Reveal mode="rise" delay={0.12}>
              <p className="type-lead mt-9 max-w-md text-quiet">
                NPeripheral is building its client portfolio, and we are looking for
                businesses that want to improve how they show up online. No invented
                testimonials on this page, and no borrowed logos — just an open invitation
                and work we will stand behind.
              </p>
            </Reveal>

            <Reveal mode="rise" delay={0.2}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button
                  href="/contact"
                  size="lg"
                  variant="outline"
                  className="border-[#fff6f1] text-[#fff6f1] hover:text-ember"
                  trailingIcon={<ArrowRight />}
                >
                  Become one of our first clients
                </Button>
              </div>
              <p className="type-label-sm mt-6 leading-[1.7] text-quiet">
                {siteConfig.responsePromise}
              </p>
            </Reveal>
          </div>

          <ul className="lg:col-span-5 lg:col-start-8">
            {offers.map((offer, i) => (
              <li key={offer.key}>
                <Reveal mode="rise" delay={i * 0.08}>
                  <div className="rule-b py-6">
                    <h3 className="type-h3">{offer.title}</h3>
                    <p className="type-small mt-3 text-quiet">{offer.body}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
