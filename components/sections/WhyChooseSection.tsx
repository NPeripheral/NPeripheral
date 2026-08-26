"use client";

import { advantages } from "@/lib/data/why";
import { Lines } from "@/components/motion/Lines";
import { Stagger, StaggerItem, Reveal } from "@/components/motion/Reveal";

/**
 * Why NPeripheral.
 *
 * This replaced a two-column "them vs us" ledger that put invented failings
 * in a competitor's mouth and quoted response times we had not earned. These
 * are statements about how we work, which is the only side of that comparison
 * we can actually speak for.
 */
export function WhyChooseSection() {
  return (
    <section className="ground-ink relative py-24 md:py-36">
      <div className="shell">
        <div className="rule-b flex flex-col gap-6 pb-10 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-baseline gap-4">
              <span className="type-label-sm text-ember">08</span>
              <span className="type-label text-quiet">Why NPeripheral</span>
            </div>
            <Lines
              as="h2"
              className="type-h1 mt-7"
              lines={[
                <span key="a">Small on purpose,</span>,
                <span key="b">
                  built to <em className="italic-voice text-ember">grow</em>.
                </span>,
              ]}
            />
          </div>
          <Reveal mode="fade" delay={0.1}>
            <p className="type-small max-w-xs text-quiet">
              None of this is exotic. It is the set of things that get harder to do the
              moment an agency has more accounts than it has attention.
            </p>
          </Reveal>
        </div>

        <Stagger as="ul" gap={0.07}>
          {advantages.map((item, i) => (
            <StaggerItem
              as="li"
              key={item.key}
              className="rule-b grid gap-3 py-7 md:grid-cols-12 md:gap-8 md:py-9"
            >
              <span className="type-label-sm text-quieter md:col-span-1">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="type-h3 md:col-span-4">{item.title}</h3>
              <p className="type-body text-quiet md:col-span-7">{item.description}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
