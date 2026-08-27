import type { Metadata } from "next";
import Link from "next/link";
import { Button, ArrowRight } from "@/components/ui/Button";
import { Lines } from "@/components/motion/Lines";
import { Reveal } from "@/components/motion/Reveal";
import { Aperture } from "@/components/visual/Aperture";
import { siteConfig } from "@/lib/site-config";
import { DiagonalCut } from "@/components/motion/DiagonalCut";

export const metadata: Metadata = {
  title: "Thank you",
  description:
    "Your enquiry is in. Here is exactly what happens next, and how quickly you will hear from the NPeripheral team.",
  alternates: { canonical: "/thank-you" },
  // A conversion confirmation should never be an organic landing page.
  robots: { index: false, follow: false },
};

const next = [
  {
    step: "01",
    title: "We read it properly",
    body: "A person reads what you sent — not an autoresponder — and looks at how your business currently shows up online.",
  },
  {
    step: "02",
    title: "You hear back within one business day",
    body: "Either a scope and a price, or a couple of questions if we need more before a quote would be useful.",
  },
  {
    step: "03",
    title: "We come with something to say",
    body: "You get the two or three specific opportunities we spotted, whether or not you decide to work with us.",
  },
];

/**
 * Post-submission confirmation. Separated from the form so conversions have a
 * real URL to fire against in analytics, and so the reader gets a genuine
 * answer to "what happens now?" instead of a green tick.
 */
export default function ThankYouPage() {
  return (
    <>
      <section className="ground-ink relative overflow-hidden pb-20 pt-36 md:pt-44">
        <div className="shell grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <div className="rule-b flex items-baseline gap-4 pb-3">
              <span className="type-label-sm text-ember">✳</span>
              <span className="type-label text-quiet">Received</span>
            </div>

            <Lines
              as="h1"
              immediate
              delay={0.1}
              className="type-hero mt-8"
              lines={[
                <span key="a">Thank</span>,
                <span key="b">
                  <em className="italic-voice text-ember">you.</em>
                </span>,
              ]}
            />

            <Reveal mode="lift" delay={0.3}>
              <p className="type-lead mt-9 max-w-md text-quiet">
                {siteConfig.responsePromise} Nothing else is required from you right now
                — but if you would rather skip the back-and-forth, book a time directly.
              </p>
            </Reveal>

            <Reveal mode="rise" delay={0.4}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                {siteConfig.isCalendlyConfigured ? (
                  <Button
                    href={siteConfig.calendlyUrl}
                    external
                    size="lg"
                    trailingIcon={<ArrowRight />}
                  >
                    Book a time now
                  </Button>
                ) : (
                  <Button href="/contact" size="lg" trailingIcon={<ArrowRight />}>
                    Send another enquiry
                  </Button>
                )}
                <Button href="/onboarding" size="lg" variant="secondary">
                  See what happens next
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal
            mode="mask"
            delay={0.25}
            className="hidden lg:col-span-4 lg:col-start-9 lg:block"
          >
            <Aperture
              figure="burst"
              tone="ink"
              anchor="center"
              dot={4}
              label="Enquiry received"
              index="Fig. 00"
              className="aspect-[3/4] w-full border border-[var(--color-line)]"
            />
          </Reveal>
        </div>
      </section>

      <section className="ground-cream py-20 md:py-28 cut-top">
      <DiagonalCut />
        <div className="shell">
          <div className="rule-b flex items-baseline gap-4 pb-3">
            <span className="type-label-sm text-ember">✳</span>
            <span className="type-label text-quiet">What happens next</span>
          </div>

          <ol className="mt-4">
            {next.map((item) => (
              <li key={item.step} className="rule-b py-8 md:py-10">
                <div className="grid gap-4 md:grid-cols-12 md:gap-8">
                  <span className="type-label-sm text-ember md:col-span-1">{item.step}</span>
                  <h2 className="type-h3 md:col-span-5">{item.title}</h2>
                  <p className="type-body text-quiet md:col-span-6">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
            <a href={`mailto:${siteConfig.email}`} className="type-small link-underline inline-block py-1">
              {siteConfig.email}
            </a>
            <a
              href={`tel:${siteConfig.phoneHref}`}
              className="type-small link-underline inline-block py-1"
            >
              {siteConfig.phone}
            </a>
            <Link href="/" className="type-small link-underline inline-block py-1 text-quiet">
              Back to the homepage
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
