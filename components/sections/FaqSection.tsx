import Link from "next/link";
import { faqItems } from "@/lib/data/faq";
import { Accordion } from "@/components/ui/Accordion";
import { Lines } from "@/components/motion/Lines";

/**
 * Chapter 12 — the questions, on cream.
 *
 * Set as a two-column spread: the heading holds the left third and stays put
 * while the answers run down the right, which keeps the section from drifting
 * into a centred FAQ block like every other site's.
 */
export function FaqSection() {
  return (
    <section id="faq" className="ground-ink relative py-24 md:py-36">
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <div className="rule-b flex items-baseline gap-4 pb-3">
              <span className="type-label-sm text-ember">12</span>
              <span className="type-label text-quiet">Questions</span>
            </div>
            <Lines
              as="h2"
              className="type-h1 mt-7"
              lines={[<span key="a">Before you</span>, <span key="b"><em className="italic-voice text-ember">ask</em>.</span>]}
            />
            <p className="type-small mt-7 max-w-xs text-quiet">
              Anything not covered here gets answered directly on the call — including
              the awkward ones about pricing and contracts.
            </p>
            <Link
              href="/contact"
              className="type-label link-underline mt-7 inline-block text-ember"
            >
              Get a custom quote
            </Link>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <Accordion items={faqItems} />
        </div>
      </div>
    </section>
  );
}
