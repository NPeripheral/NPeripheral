import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { HelpIndex } from "@/components/help/HelpIndex";
import { Button, ArrowRight } from "@/components/ui/Button";
import { helpTopics } from "@/lib/data/help";
import { siteConfig } from "@/lib/site-config";
import { DiagonalCut } from "@/components/motion/DiagonalCut";

export const metadata: Metadata = {
  title: "Help centre",
  description:
    "Answers on how NPeripheral works — services, pricing, how we work together, contracts, and what happens to the details you send us.",
  alternates: { canonical: "/help" },
  openGraph: {
    title: `Help centre — ${siteConfig.name}`,
    description: "Answers on services, pricing and how we work together.",
    url: `${siteConfig.url}/help`,
  },
};

/* Every help topic is a question someone actually asks, so it earns FAQ
   markup the same way the homepage FAQ does. */
const helpJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: helpTopics.map((topic) => ({
    "@type": "Question",
    name: topic.title,
    acceptedAnswer: {
      "@type": "Answer",
      text: `${topic.summary} ${topic.points.join(" ")}`,
    },
  })),
};

export default function HelpPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(helpJsonLd) }}
      />

      <PageHeader
        breadcrumbs={[{ label: "Help centre", href: "/help" }]}
        eyebrow="Help centre"
        title="How this all works"
        gradientWord="works"
        description="Straight answers on services, pricing and how we work. If what you need is not here, a person will answer within one business day."
        figure="grid"
      />

      <section className="ground-cream py-20 md:py-28">
        <div className="shell">
          <HelpIndex />
        </div>
      </section>

      <section className="ground-ink py-20 md:py-28 cut-top">
      <DiagonalCut />
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="rule-b flex items-baseline gap-4 pb-3">
              <span className="type-label-sm text-ember">✳</span>
              <span className="type-label text-quiet">Still stuck</span>
            </div>
            <h2 className="type-h2 mt-8">
              Ask a <em className="italic-voice text-ember">person</em>.
            </h2>
            <p className="type-lead mt-6 max-w-md text-quiet">{siteConfig.responsePromise}</p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button href="/contact" size="lg" trailingIcon={<ArrowRight />}>
                Ask a question
              </Button>
              <Button href="/onboarding" size="lg" variant="secondary">
                See how we work
              </Button>
            </div>
          </div>

          <dl className="lg:col-span-5 lg:col-start-8">
            <div className="rule-b py-5">
              <dt className="type-label-sm text-quieter">Email</dt>
              <dd className="mt-2">
                <a href={`mailto:${siteConfig.email}`} className="type-body link-underline">
                  {siteConfig.email}
                </a>
              </dd>
            </div>
            <div className="rule-b py-5">
              <dt className="type-label-sm text-quieter">Phone</dt>
              <dd className="mt-2">
                <a
                  href={`tel:${siteConfig.phoneHref}`}
                  className="type-body link-underline"
                >
                  {siteConfig.phone}
                </a>
              </dd>
            </div>
            <div className="rule-b py-5">
              <dt className="type-label-sm text-quieter">How we work</dt>
              <dd className="type-body mt-2">
                <Link href="/onboarding" className="link-underline">
                  The four stages
                </Link>
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}
