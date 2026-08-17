import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { siteConfig, addressOneLine } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms covering use of the ${siteConfig.name} website and the scope of our services.`,
  alternates: { canonical: "/legal/terms" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "March 2026";

/**
 * Terms of service.
 *
 * Deliberately modest in what it claims. The site is marketing material, not
 * a contract; actual engagements are governed by a separate written agreement.
 * The "no guaranteed results" clause matches what the rest of the site says,
 * so nothing here contradicts a page a client already read.
 */
const sections = [
  {
    title: "1. About these terms",
    body: `These terms cover your use of this website, operated by ${siteConfig.name}. Our business mailing address is ${addressOneLine}. By using the site you accept these terms; if you do not, please do not use it.`,
  },
  {
    title: "2. This website is not an offer",
    body: "Everything on this site — service descriptions, process pages, concept work — is provided for information. Nothing here constitutes a binding offer or a service agreement. Any engagement is governed by a separate written agreement covering scope, deliverables, timing and fees, signed by both parties before work begins.",
  },
  {
    title: "3. Pricing",
    body: "We do not publish fixed prices, because scope varies by platform count, posting frequency, content requirements and level of management. Any price we quote is specific to the scope described in that quote, and is valid for the period stated in it.",
  },
  {
    title: "4. No guaranteed results",
    body: "We provide marketing services; we do not guarantee outcomes. Follower counts, engagement rates, leads, sales and revenue depend on factors outside our control, including your offer, pricing, market conditions and third-party platform behaviour. Nothing on this site should be read as a promise of a specific result.",
  },
  {
    title: "5. Concept work",
    body: "Any project shown on this site labelled a concept project is speculative work created to illustrate our approach. It was not produced for a paying client and represents no completed engagement or achieved outcome.",
  },
  {
    title: "6. Your accounts and content",
    body: "Where we work on your social accounts, those accounts and the content within them remain yours. You are responsible for the accuracy and legality of material you supply to us, and for holding the rights to any images, footage, logos or copy you ask us to publish.",
  },
  {
    title: "7. Third-party platforms",
    body: "Our services depend on platforms we do not control, including Meta, TikTok, Google and LinkedIn. Their rules, algorithms, pricing and availability can change without notice. We are not responsible for platform outages, policy changes, account restrictions or actions taken by those platforms.",
  },
  {
    title: "8. Intellectual property",
    body: "The design, text and visual system of this website belong to us. Work produced for a client under a signed agreement is governed by the ownership terms in that agreement.",
  },
  {
    title: "9. Limitation of liability",
    body: "To the extent permitted by law, our liability arising from your use of this website is limited to the amount you have paid us, if any. We are not liable for indirect or consequential losses, including lost profits or lost business opportunity.",
  },
  {
    title: "10. Governing law",
    body: "These terms are governed by the laws of the State of Texas, United States.",
  },
  {
    title: "11. Contact",
    body: `Questions about these terms can be sent to ${siteConfig.email} or ${siteConfig.phone}.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Terms of Service", href: "/legal/terms" }]}
        eyebrow="Legal"
        title="Terms of Service"
        description={`Last updated: ${LAST_UPDATED} · ${siteConfig.name}`}
        figure="column"
      />

      <section className="ground-cream py-20 md:py-28">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:col-start-3">
            <p className="type-lead rule-b pb-8 text-quiet">
              The short version: this website is information, not a contract. Real work runs
              under a signed agreement, prices are quoted per project, and we do not
              guarantee marketing results.
            </p>

            <div className="mt-2">
              {sections.map((section) => (
                <section key={section.title} className="rule-b py-8">
                  <h2 className="type-h3">{section.title}</h2>
                  <p className="type-body mt-4 text-quiet">{section.body}</p>
                </section>
              ))}
            </div>

            <p className="type-small mt-10 text-quieter">
              These terms are written in plain language and have not been reviewed by an
              attorney. Have a lawyer review them before relying on them commercially.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
