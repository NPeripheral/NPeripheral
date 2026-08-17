import type { Metadata } from "next";
import Link from "next/link";
import { Button, ArrowRight } from "@/components/ui/Button";
import { Lines } from "@/components/motion/Lines";
import { Reveal } from "@/components/motion/Reveal";
import { Aperture } from "@/components/visual/Aperture";
import { navLinks, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page has moved or never existed. Head back to the homepage, or jump straight to services, our work, or contact.",
  robots: { index: false, follow: true },
};

const shortcuts = [
  { label: "Services", href: "/#services", note: "What we actually do" },
  { label: "Our work", href: "/work", note: "Concept projects" },
  { label: "Pricing", href: "/#pricing", note: "How quotes are built" },
  { label: "Contact", href: "/contact", note: siteConfig.responsePromiseShort },
];

/**
 * Custom 404, composed on the same thirds as the hero.
 *
 * A dead end is still a page someone landed on, so it does the two useful
 * things: says plainly what happened, and offers the routes they were most
 * likely looking for.
 */
export default function NotFound() {
  return (
    <section className="ground-ink relative overflow-hidden pb-24 pt-36 md:pb-32 md:pt-44">
      <div className="shell grid items-start gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <div className="rule-b flex items-baseline gap-4 pb-3">
            <span className="type-label-sm text-ember">404</span>
            <span className="type-label text-quiet">Page not found</span>
          </div>

          <Lines
            as="h1"
            immediate
            delay={0.1}
            className="type-hero mt-8"
            lines={[
              <span key="a">Nothing</span>,
              <span key="b">
                to <em className="italic-voice text-ember">see</em> here.
              </span>,
            ]}
          />

          <Reveal mode="rise" delay={0.3}>
            <p className="type-lead mt-9 max-w-md text-quiet">
              This page moved, or it never existed. Which is ironic, given the whole
              point of what we do. Here is where you probably meant to go.
            </p>
          </Reveal>

          <Reveal mode="rise" delay={0.4}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button href="/" size="lg" trailingIcon={<ArrowRight />}>
                Back to the homepage
              </Button>
              <Button href="/contact" size="lg" variant="secondary">
                Report a broken link
              </Button>
            </div>
          </Reveal>

          <Reveal mode="fade" delay={0.5}>
            <ul className="rule-t mt-14 pt-2">
              {shortcuts.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    data-cursor="view"
                    className="rule-b group/row flex items-baseline gap-5 py-5"
                  >
                    <span className="type-label-sm text-quieter">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="type-h3 flex-1 transition-colors duration-300 group-hover/row:text-ember">
                      {item.label}
                    </span>
                    <span className="type-label-sm hidden text-quieter sm:block">{item.note}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal
          mode="mask"
          delay={0.25}
          className="hidden lg:col-span-4 lg:col-start-9 lg:block"
        >
          <Aperture
            figure="grid"
            tone="ink"
            anchor="center"
            dot={7}
            label="Signal lost"
            index="404"
            className="aspect-[3/4] w-full border border-[var(--color-line)]"
          />
        </Reveal>
      </div>

      <div className="shell rule-t mt-16 pt-8">
        <p className="type-label-sm text-quieter">Everything else</p>
        <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="type-small link-underline text-quiet hover:text-bone">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
