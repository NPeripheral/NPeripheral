"use client";

import { Lines } from "@/components/motion/Lines";
import { Reveal } from "@/components/motion/Reveal";
import { Aperture, type ApertureFigure } from "@/components/visual/Aperture";
import { Breadcrumbs, type Crumb } from "@/components/layout/Breadcrumbs";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  gradientWord,
  description,
  figure = "lens",
  breadcrumbs,
  className,
}: {
  eyebrow?: string;
  title: string;
  /** Rendered in italic ember. */
  gradientWord?: string;
  description?: string;
  figure?: ApertureFigure;
  /** Trail below Home. Renders the visible crumbs and the BreadcrumbList. */
  breadcrumbs?: Crumb[];
  className?: string;
}) {
  const parts = gradientWord ? title.split(gradientWord) : [title];

  return (
    <section className={cn("ground-ink relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-44", className)}>
      <div className="shell grid items-end gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {breadcrumbs ? (
            <div className="mb-8">
              <Breadcrumbs trail={breadcrumbs} />
            </div>
          ) : null}

          {eyebrow ? (
            <Reveal mode="fade" duration={0.6}>
              <div className="rule-b flex items-baseline gap-4 pb-3">
                <span className="type-label-sm text-ember">✳</span>
                <span className="type-label text-quiet">{eyebrow}</span>
              </div>
            </Reveal>
          ) : null}

          <Lines
            as="h1"
            immediate
            delay={0.15}
            className="type-h1 mt-8"
            lines={[
              gradientWord ? (
                <span key="a">
                  {parts[0]}
                  <em className="italic-voice text-ember">{gradientWord}</em>
                  {parts[1]}
                </span>
              ) : (
                <span key="a">{title}</span>
              ),
            ]}
          />

          {description ? (
            <Reveal mode="rise" delay={0.35}>
              <p className="type-lead mt-8 max-w-xl text-quiet">{description}</p>
            </Reveal>
          ) : null}
        </div>

        <Reveal mode="mask" delay={0.3} className="hidden lg:col-span-3 lg:col-start-10 lg:block">
          <Aperture
            figure={figure}
            tone="ink"
            anchor="center"
            dot={4}
            className="aspect-square w-full border border-[var(--color-line)]"
          />
        </Reveal>
      </div>
    </section>
  );
}
