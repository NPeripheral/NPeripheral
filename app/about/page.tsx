import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { TiltCard } from "@/components/ui/TiltCard";
import { FinalCta } from "@/components/sections/FinalCta";
import { Lines } from "@/components/motion/Lines";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { Aperture } from "@/components/visual/Aperture";
import { values, commitments, positioning } from "@/lib/data/about";
import { siteConfig } from "@/lib/site-config";
import { DiagonalCut } from "@/components/motion/DiagonalCut";

export const metadata: Metadata = {
  title: "About",
  description:
    "NPeripheral is a social media marketing company based in Fort Worth, Texas, helping businesses build a consistent and intentional online presence. Here's how we work and what we commit to.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About — ${siteConfig.name}`,
    description: "How NPeripheral works, and what we commit to.",
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "About", href: "/about" }]}
        eyebrow="About"
        title="A social media company built around consistency"
        gradientWord="consistency"
        description="NPeripheral is a growing company providing personalized social media marketing with transparent expectations and plans built around each business."
        figure="lens"
      />

      {/* The position, stated plainly. */}
      <section className="ground-cream py-24 md:py-32">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="rule-b flex items-baseline gap-4 pb-3">
              <span className="type-label-sm text-ember">✳</span>
              <span className="type-label text-quiet">What we believe</span>
            </div>

            <Lines
              as="h2"
              className="type-h1 mt-8"
              lines={[
                <span key="a">{positioning.headline}</span>,
                <span key="b">
                  It needs to appear where your{" "}
                  <em className="italic-voice text-ember">audience is</em>.
                </span>,
              ]}
            />

            <Reveal mode="rise" delay={0.15}>
              <p className="type-lead mt-9 max-w-xl text-quiet">{positioning.body}</p>
            </Reveal>

            <Reveal mode="rise" delay={0.2}>
              <p className="type-body mt-6 max-w-xl text-quiet">
                We are a newer company building our client base, and we would rather say so
                than pad this page with numbers we have not earned. What that means in
                practice is straightforward: you work directly with the person doing the
                work, and your account gets attention a larger agency cannot spare.
              </p>
            </Reveal>
          </div>

          <Reveal mode="mask" className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <Aperture
              figure="grid"
              tone="cream"
              anchor="center"
              dot={4}
              label="Where your audience is"
              className="aspect-[3/4] w-full border border-[var(--color-line-ink)]"
            />
          </Reveal>
        </div>
      </section>

      {/* How we work. */}
      <section className="ground-ink py-24 md:py-32 cut-top">
      <DiagonalCut />
        <div className="shell">
          <div className="rule-b flex items-baseline gap-4 pb-3">
            <span className="type-label-sm text-ember">✳</span>
            <span className="type-label text-quiet">How we work</span>
          </div>

          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2" gap={0.08}>
            {values.map((value) => (
              <StaggerItem key={value.title}>
                <TiltCard className="h-full p-7">
                  <h3 className="type-h3">{value.title}</h3>
                  <p className="type-small mt-3 text-quiet">{value.description}</p>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Commitments — things that are true on day one. */}
      <section className="ground-ink py-24 md:py-32">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="rule-b flex items-baseline gap-4 pb-3">
              <span className="type-label-sm text-ember">✳</span>
              <span className="type-label text-quiet">What we commit to</span>
            </div>
            <h2 className="type-h2 mt-8">
              Four things you can hold us <em className="italic-voice text-ember">to</em>.
            </h2>
            <p className="type-small mt-6 max-w-xs text-quiet">
              Not aspirations. These are true from the first day of any engagement, and
              they cost us nothing to keep because they are simply how the work should run.
            </p>
          </div>

          <ul className="lg:col-span-7 lg:col-start-6">
            {commitments.map((commitment, i) => (
              <li key={commitment}>
                <Reveal mode="rise" delay={i * 0.06}>
                  <div className="rule-b flex items-start gap-6 py-6">
                    <span className="type-label-sm mt-1 shrink-0 text-ember">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="type-body">{commitment}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
