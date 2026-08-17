import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { WorkSection } from "@/components/sections/WorkSection";
import { FinalCta } from "@/components/sections/FinalCta";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Our Work",
  description:
    "Concept projects showing how NPeripheral approaches social media for local businesses, small product brands and service companies. Speculative work, clearly labelled.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: `Our Work — ${siteConfig.name}`,
    description:
      "Concept projects showing how we approach social media for different kinds of business.",
    url: `${siteConfig.url}/work`,
  },
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Our Work", href: "/work" }]}
        eyebrow="Our work"
        title="How we'd approach it"
        gradientWord="approach it"
        description="We're building our client portfolio, so what's here is concept work — speculative approaches to real kinds of business, made to show how we think rather than to claim what we've done."
        figure="orbit"
      />

      <WorkSection standalone />

      <FinalCta />
    </>
  );
}
