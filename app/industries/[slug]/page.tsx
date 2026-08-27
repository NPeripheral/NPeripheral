import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { industryPages } from "@/lib/data/industries";
import { services } from "@/lib/data/services";
import { PageHeader } from "@/components/layout/PageHeader";
import { TiltCard } from "@/components/ui/TiltCard";
import { FinalCta } from "@/components/sections/FinalCta";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { siteConfig } from "@/lib/site-config";
import { DiagonalCut } from "@/components/motion/DiagonalCut";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return industryPages.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const industry = industryPages.find((i) => i.slug === slug);
  if (!industry) return { title: "Not found" };

  return {
    title: `Social Media Marketing for ${industry.name}`,
    description: industry.description,
    alternates: { canonical: `/industries/${industry.slug}` },
    openGraph: {
      title: `Social Media Marketing for ${industry.name} — ${siteConfig.name}`,
      description: industry.description,
      url: `${siteConfig.url}/industries/${industry.slug}`,
    },
  };
}

/**
 * Who we work with.
 *
 * These pages used to close with a fabricated case study for the sector.
 * They now describe the problems we hear and the approach we would take —
 * no client names, no numbers, nothing that implies a track record.
 */
export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const industry = industryPages.find((i) => i.slug === slug);
  if (!industry) notFound();

  const relevant = services.filter((s) => industry.services.includes(s.slug));

  return (
    <>
      <PageHeader
        breadcrumbs={[
          { label: "Who we work with", href: "/#services" },
          { label: industry.name, href: `/industries/${industry.slug}` },
        ]}
        eyebrow={industry.name}
        title={industry.headline}
        gradientWord={industry.gradientWord}
        description={industry.description}
        figure="column"
      />

      <section className="ground-cream py-24 md:py-32">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <h2 className="type-label rule-b pb-3 text-quiet">What we usually hear</h2>
            <Stagger as="ul" className="mt-6" gap={0.07}>
              {industry.painPoints.map((point) => (
                <StaggerItem as="li" key={point} className="rule-b py-5">
                  <p className="type-body text-quiet">{point}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <h2 className="type-label rule-b pb-3 text-ember">How we&apos;d approach it</h2>
            <Stagger as="ul" className="mt-6" gap={0.07}>
              {industry.approach.map((line, i) => (
                <StaggerItem as="li" key={line} className="rule-b flex gap-5 py-5">
                  <span className="type-label-sm mt-1 shrink-0 text-quieter">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="type-body">{line}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      <section className="ground-ink py-24 md:py-32 cut-top">
      <DiagonalCut />
        <div className="shell">
          <div className="rule-b flex items-baseline gap-4 pb-3">
            <span className="type-label-sm text-ember">✳</span>
            <span className="type-label text-quiet">Services that usually apply</span>
          </div>

          <Reveal mode="fade">
            <p className="type-small mt-6 max-w-xl text-quiet">
              A starting point, not a package. The final scope — and the price — depends on
              your platforms, posting frequency and how much content needs producing.
            </p>
          </Reveal>

          <Stagger className="mt-10 grid gap-5 sm:grid-cols-3" gap={0.08}>
            {relevant.map((service) => (
              <StaggerItem key={service.slug}>
                <TiltCard className="h-full p-6">
                  <h3 className="type-h3">{service.title}</h3>
                  <p className="type-small mt-3 text-quiet">{service.summary}</p>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
