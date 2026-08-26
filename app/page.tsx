import Script from "next/script";
import { Hero } from "@/components/hero/Hero";
import { SignalTicker } from "@/components/sections/SignalTicker";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { StarterSection } from "@/components/sections/StarterSection";
import { DiptychSection } from "@/components/sections/DiptychSection";
import { WorkSection } from "@/components/sections/WorkSection";
import { PlanBlueprint } from "@/components/sections/PlanBlueprint";
import { JustGettingStarted } from "@/components/sections/JustGettingStarted";
import { WhyChooseSection } from "@/components/sections/WhyChooseSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { BrandStatement } from "@/components/sections/BrandStatement";
import { FinalCta } from "@/components/sections/FinalCta";
import { faqItems } from "@/lib/data/faq";
import { siteConfig } from "@/lib/site-config";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export const metadata = {
  title: `${siteConfig.name} — ${siteConfig.motto}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

/**
 * The homepage is sequenced as chapters. The ground changes at a few
 * deliberate seams — cream for the two moments meant to feel like a break,
 * ember for the two brand-voice beats — but most of the run is ink.
 * Services through why-us is seven chapters straight on ink; composition,
 * not colour, differentiates them (a ruled list, a pinned wipe, a pinned
 * horizontal run, a ruled set of advantages), and cream lands harder at
 * pricing for the wait:
 *
 *   00 hero           ink      thirds, figure right
 *      ticker         ember    horizontal motion
 *   01 premise        cream    single centred column
 *   02 services       ink      ruled list, cursor-tracked panel
 *   03 where you are  ink      three states + figure
 *   04 before/after   ink→cream  pinned wipe
 *   05 our work       ink      concept projects, badged
 *   06 process        ink      pinned horizontal run
 *   07 getting started ink     the invitation, in place of testimonials
 *   08 why us         ink      ruled advantages
 *   09 pricing        cream    quote factors
 *   10 questions      ink      sticky heading + accordion
 *      statement      ember    full-bleed motto
 *   11 close          ink      thirds, mirrors the hero
 *
 * There is no stats section, no testimonial carousel and no ROI projector.
 * All three existed and all three were built on invented numbers.
 */
export default function Home() {
  return (
    <>
      <Script
        id="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero />
      <SignalTicker />
      <ManifestoSection />
      <ServicesSection />
      <StarterSection />
      <DiptychSection />
      <WorkSection />
      <PlanBlueprint />
      <JustGettingStarted />
      <WhyChooseSection />
      <PricingSection />
      <FaqSection />
      <BrandStatement />
      <FinalCta />
    </>
  );
}
