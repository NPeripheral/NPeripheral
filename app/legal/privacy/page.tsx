import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { siteConfig, addressOneLine } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects the information you send us.`,
  alternates: { canonical: "/legal/privacy" },
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "March 2026";

/**
 * Privacy policy.
 *
 * Written to describe what this site actually does, not what a template
 * assumes. Analytics is conditional because it only loads when a GA ID is
 * configured; the newsletter and quote form are named specifically; and the
 * address is identified as a mailing address.
 *
 * This is a plain-language policy, not legal advice — see the note at the end.
 */
const sections = [
  {
    title: "1. Who we are",
    body: `${siteConfig.name} is a social media marketing and management company. Our business mailing address is ${addressOneLine}, and you can reach us at ${siteConfig.email} or ${siteConfig.phone}. This policy covers this website.`,
  },
  {
    title: "2. What we collect",
    body: "When you submit the quote request form we collect the details you enter: your name, business name, email address, phone number if you provide one, your website or social links, the services you are interested in, an optional budget range, what you tell us about your goals, and your preferred contact method. If you subscribe to our email list we collect your email address. We do not ask for and do not want payment details, government identifiers, or any sensitive personal information through this site.",
  },
  {
    title: "3. Why we collect it",
    body: "We use what you send to reply to you, to scope and price the work you asked about, and — if you subscribe — to send you occasional emails. That is the whole list. We do not sell your information, we do not rent it, and we do not share it with advertisers.",
  },
  {
    title: "4. Consent",
    body: "The quote form asks you to tick a box confirming you agree to be contacted about your enquiry. We do not submit the form without it. If you subscribe to the email list, every email includes a one-click unsubscribe link and we act on it immediately.",
  },
  {
    title: "5. Cookies and analytics",
    body: "This site sets no advertising or tracking cookies of its own. If website analytics is enabled, it runs in an aggregate, IP-anonymised mode with advertising storage switched off by default. Your browser settings can block cookies entirely and the site will continue to work.",
  },
  {
    title: "6. Service providers",
    body: "Form submissions may be passed to the email or CRM service we use to receive and manage enquiries. Those providers process the data on our behalf and under contract. We do not pass your details to anyone else.",
  },
  {
    title: "7. How long we keep it",
    body: "We keep enquiry details for as long as we are in conversation with you and for a reasonable period afterwards in case you come back. Email list subscriptions are kept until you unsubscribe. If you ask us to delete your information, we delete it.",
  },
  {
    title: "8. Your choices",
    body: `You can ask us what we hold about you, ask us to correct it, or ask us to delete it — by emailing ${siteConfig.email}. You do not need a legal reason and we will not ask you for one. Depending on where you live you may have additional statutory rights; we will honour those too.`,
  },
  {
    title: "9. Children",
    body: "This site is intended for business owners and is not directed at children. We do not knowingly collect information from anyone under 13.",
  },
  {
    title: "10. Changes to this policy",
    body: `We will update this page if what we do changes, and we will change the date at the top when we do. This version was last updated in ${LAST_UPDATED}.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Privacy Policy", href: "/legal/privacy" }]}
        eyebrow="Legal"
        title="Privacy Policy"
        description={`Last updated: ${LAST_UPDATED} · ${siteConfig.name}`}
        figure="grid"
      />

      <section className="ground-cream py-20 md:py-28">
        <div className="shell grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:col-start-3">
            <p className="type-lead rule-b pb-8 text-quiet">
              The short version: we collect what you send us so we can reply to it and
              price your work. We do not sell it, we do not share it beyond the tools that
              deliver it to us, and you can have it deleted by asking.
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
              This policy is written in plain language to describe our actual practices. It
              is not legal advice, and it has not been reviewed by an attorney. If your
              business operates under specific privacy obligations, have a lawyer review it
              before relying on it.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
