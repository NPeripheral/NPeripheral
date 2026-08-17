import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { LeadCaptureForm } from "@/components/forms/LeadCaptureForm";
import { Button, ArrowRight } from "@/components/ui/Button";
import { siteConfig, addressLines, socialLinks, hasSocialLinks } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell NPeripheral about your business and get a custom social media marketing quote. Based in Fort Worth, Texas, working with clients nationwide. Reply within one business day.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact — ${siteConfig.name}`,
    description: "Get a custom social media marketing quote built around your business.",
    url: `${siteConfig.url}/contact`,
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Contact", href: "/contact" }]}
        eyebrow="Get in touch"
        title="Let's talk about your business"
        gradientWord="your business"
        description="Tell us what you're working with and what you want social media to do for it. You'll get a scope and a price built around that — usually within one business day."
        figure="burst"
      />

      <section className="ground-ink pb-24 md:pb-32">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <LeadCaptureForm />

            {siteConfig.isCalendlyConfigured ? (
              <div className="mt-6 flex flex-col gap-4 border border-[var(--color-line)] p-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="type-label-sm text-quieter">Prefer to talk it through?</p>
                  <p className="type-body mt-2 text-quiet">
                    Book a time directly and skip the form.
                  </p>
                </div>
                <Button
                  href={siteConfig.calendlyUrl}
                  external
                  variant="secondary"
                  trailingIcon={<ArrowRight />}
                >
                  Book a call
                </Button>
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <div className="lg:sticky lg:top-28">
              <h2 className="type-label rule-b pb-3 text-quiet">Reach us directly</h2>

              <dl className="mt-6 flex flex-col">
                <div className="rule-b py-5">
                  <dt className="type-label-sm text-quieter">Phone</dt>
                  <dd className="mt-2">
                    <a href={`tel:${siteConfig.phoneHref}`} className="type-body link-underline">
                      {siteConfig.phone}
                    </a>
                  </dd>
                </div>

                <div className="rule-b py-5">
                  <dt className="type-label-sm text-quieter">Email</dt>
                  <dd className="mt-2">
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="type-body link-underline break-all"
                    >
                      {siteConfig.email}
                    </a>
                  </dd>
                </div>

                {/* Labelled as a mailing address, with the "no walk-ins" note
                    stated rather than implied. It is a virtual mailbox. */}
                <div className="rule-b py-5">
                  <dt className="type-label-sm text-quieter">Business mailing address</dt>
                  <dd className="mt-2">
                    <address className="type-body not-italic text-quiet">
                      {addressLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </address>
                    <p className="type-small mt-3 text-quieter">
                      This is a mailing address, not a walk-in office. We work remotely —
                      meetings happen by phone or video.
                    </p>
                  </dd>
                </div>

                <div className="rule-b py-5">
                  <dt className="type-label-sm text-quieter">Working with</dt>
                  <dd className="type-body mt-2 text-quiet">{siteConfig.serviceArea}</dd>
                </div>

                <div className="rule-b py-5">
                  <dt className="type-label-sm text-quieter">Response time</dt>
                  <dd className="type-body mt-2 text-quiet">{siteConfig.responsePromise}</dd>
                </div>
              </dl>

              {hasSocialLinks ? (
                <>
                  <h2 className="type-label rule-b mt-10 pb-3 text-quiet">Social</h2>
                  <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
                    {socialLinks.map((social) => (
                      <li key={social.label}>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="type-small link-underline text-quiet hover:text-bone"
                        >
                          {social.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
