import Link from "next/link";
import {
  footerLinks,
  siteConfig,
  socialLinks,
  hasSocialLinks,
  addressLines,
} from "@/lib/site-config";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { LogoMark } from "@/components/layout/Logo";
import { Reveal } from "@/components/motion/Reveal";

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="type-label-sm rule-b pb-3 text-quieter">{title}</h3>
      <ul className="mt-5 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="type-small link-underline text-quiet hover:text-bone">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * The last chapter. Colophon above, then the wordmark set enormous and
 * cropped by the bottom edge.
 *
 * Social links render only for accounts that exist — `socialLinks` filters out
 * empty entries, so nothing here points at a profile nobody owns. Add a URL in
 * site-config and the column appears on its own.
 */
export function Footer() {
  return (
    <footer className="ground-ink grain relative overflow-hidden rule-t">
      <div className="shell pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
          <div>
            <Link href="/" className="group inline-flex items-center gap-3 text-bone" aria-label="NPeripheral — home">
              <LogoMark />
              <span className="font-display text-lg tracking-tight">NPeripheral</span>
            </Link>

            <Reveal mode="rise">
              <p className="type-h3 mt-8 max-w-md text-balance">
                Appear to your <em className="italic-voice text-ember">audience</em>.
              </p>
            </Reveal>

            <p className="type-small mt-5 max-w-sm text-quiet">
              Social media marketing and management for businesses that want to show up
              consistently in front of the right people.
            </p>

            <NewsletterForm className="mt-10 max-w-sm" />
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <Column title="Company" links={footerLinks.company} />
            <Column title="Services" links={footerLinks.services} />

            <div>
              <h3 className="type-label-sm rule-b pb-3 text-quieter">Contact</h3>
              <ul className="mt-5 flex flex-col gap-3">
                <li>
                  <a
                    href={`tel:${siteConfig.phoneHref}`}
                    className="type-small link-underline text-quiet hover:text-bone"
                  >
                    {siteConfig.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="type-small link-underline break-all text-quiet hover:text-bone"
                  >
                    {siteConfig.email}
                  </a>
                </li>
              </ul>

              <h3 className="type-label-sm rule-b mt-8 pb-3 text-quieter">
                Business mailing address
              </h3>
              <address className="type-small mt-5 not-italic text-quiet">
                {addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="type-label-sm mt-4 leading-[1.7] text-quieter">
                Mailing address only — not a walk-in office
              </p>

              {hasSocialLinks ? (
                <>
                  <h3 className="type-label-sm rule-b mt-8 pb-3 text-quieter">Social</h3>
                  <ul className="mt-5 flex flex-col gap-3">
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

        <div className="rule-t mt-16 flex flex-col gap-4 py-7 md:flex-row md:items-center md:justify-between">
          <p className="type-label-sm leading-[1.7] text-quieter">
            © {new Date().getFullYear()} {siteConfig.name} — All rights reserved
          </p>
          <ul className="flex flex-wrap gap-6">
            {footerLinks.legal.map((link) => (
              <li key={link.label}>
                <Link href={link.href} className="type-label-sm link-underline text-quieter hover:text-quiet">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none px-4 md:px-8">
        <span className="block translate-y-[16%] text-center font-display text-[19vw] leading-[0.78] tracking-[-0.045em] text-bone/[0.055]">
          NPeripheral
        </span>
      </div>
    </footer>
  );
}
