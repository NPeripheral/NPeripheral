import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button, ArrowRight } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { Tour, type TourStep } from "@/components/tour/Tour";
import { Aperture } from "@/components/visual/Aperture";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "How We Work",
  description:
    "What working with NPeripheral actually looks like — the four stages, what we need from you, what you get back, and what we will not promise.",
  alternates: { canonical: "/onboarding" },
  openGraph: {
    title: `How We Work — ${siteConfig.name}`,
    description: "The four stages of working together, and what happens at each one.",
    url: `${siteConfig.url}/onboarding`,
  },
};

type Phase = {
  id: string;
  window: string;
  name: string;
  body: string;
  fromYou: string[];
  fromUs: string[];
};

/**
 * How we work.
 *
 * This page used to describe a 90-day programme run by a named strategist,
 * media buyer, creative and analyst, ending in a client portal login. None of
 * that exists. What follows is the actual shape of the work, with timings
 * given as ranges because they genuinely depend on scope.
 */
const phases: Phase[] = [
  {
    id: "discover",
    window: "Week one",
    name: "Discover",
    body: "We look at what you already have and talk through what the business is actually trying to do. Nothing gets planned before that conversation.",
    fromYou: [
      "Access to the social accounts you already have",
      "Anything you have made that you like — or hate",
      "About half an hour to talk it through",
    ],
    fromUs: [
      "An honest read on how your presence looks right now",
      "The two or three things worth fixing first",
      "A scope and a price, with no obligation attached",
    ],
  },
  {
    id: "strategize",
    window: "Week one to two",
    name: "Strategize",
    body: "The opportunities become a written plan: which platforms, how often, what kind of content, and what we are aiming at. You approve it before anything is made.",
    fromYou: ["A read-through and your honest reaction", "Any brand guidance or tone rules you already follow"],
    fromUs: [
      "A written plan covering platforms, cadence and content",
      "What we will look at to judge whether it is working",
      "Clear scope, so you know exactly what is and is not included",
    ],
  },
  {
    id: "create",
    window: "Ongoing",
    name: "Create",
    body: "Content gets produced against the plan, formatted for the platform it is going to live on rather than resized between them.",
    fromYou: ["One round of feedback on the first batch", "Photos, footage or product access where we need it"],
    fromUs: [
      "Content ready to publish, on schedule",
      "Templates you keep, so the look holds after we hand back",
      "Captions and formatting done per platform",
    ],
  },
  {
    id: "appear",
    window: "Ongoing",
    name: "Appear",
    body: "Publishing runs on a rhythm, and we adjust as we learn what your audience actually responds to. Consistency is the point, not one good week.",
    fromYou: ["A short check-in at whatever interval suits you"],
    fromUs: [
      "A presence that keeps running without you chasing it",
      "Plain-language updates on what is and is not landing",
      "Adjustments to the plan as things change",
    ],
  },
];

const notPromised = [
  "A follower count, an engagement rate or a revenue figure — those depend on your offer and your market as much as on marketing.",
  "Overnight results. A fair read on a new approach usually takes a couple of months.",
  "That every service applies to you. We will recommend leaving things out if they do not earn their place.",
];

const tourSteps: TourStep[] = [
  {
    target: '[data-tour="phase-discover"]',
    title: "Start at week one",
    body: "Each stage lists a rough window, what we need from you, and what you get back. Timings are ranges because they genuinely depend on scope.",
  },
  {
    target: '[data-tour="from-you"]',
    title: "What we need from you",
    body: "This column is the whole ask. It is short on purpose — the usual reason things stall is waiting on account access.",
  },
  {
    target: '[data-tour="from-us"]',
    title: "What you get back",
    body: "Concrete deliverables. If something is going to be late, you hear it before the date rather than after.",
  },
  {
    target: '[data-tour="not-promised"]',
    title: "And what we won't promise",
    body: "Published in the same size type as everything else, because the things an agency refuses to guarantee tell you more than the things it will.",
  },
];

export default function OnboardingPage() {
  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "How We Work", href: "/onboarding" }]}
        eyebrow="How we work"
        title="What working together looks like"
        gradientWord="working together"
        description="Four stages, ending in the one the company is named after. Published so you know exactly what to expect before you spend anything."
        figure="wave"
      />

      <section className="ground-ink pb-16">
        <div className="shell">
          <div className="rule-t flex flex-col gap-5 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="type-label text-quiet">A guided walkthrough, four steps</p>
            <Tour steps={tourSteps} storageKey="how-we-work" label="Walk me through it" />
          </div>
        </div>
      </section>

      <section className="ground-cream py-20 md:py-28">
        <div className="shell">
          <ol>
            {phases.map((phase, i) => (
              <li
                key={phase.id}
                id={phase.id}
                data-tour={`phase-${phase.id}`}
                className="rule-b scroll-mt-32 py-12 md:py-16"
              >
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-4">
                    <Reveal mode="rise">
                      <p className="type-label-sm text-ember">
                        {String(i + 1).padStart(2, "0")} — {phase.window}
                      </p>
                      <h2 className="type-h2 mt-4">{phase.name}</h2>
                      <p className="type-small mt-5 max-w-sm text-quiet">{phase.body}</p>
                    </Reveal>
                  </div>

                  <div className="lg:col-span-4" {...(i === 0 ? { "data-tour": "from-you" } : {})}>
                    <Reveal mode="rise" delay={0.08}>
                      <h3 className="type-label rule-b pb-3 text-quiet">What we need from you</h3>
                      <ul className="mt-5 flex flex-col gap-3">
                        {phase.fromYou.map((item) => (
                          <li key={item} className="type-small flex gap-3 text-quiet">
                            <span aria-hidden className="mt-[0.55em] h-px w-3 shrink-0 bg-ember" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  </div>

                  <div className="lg:col-span-4" {...(i === 0 ? { "data-tour": "from-us" } : {})}>
                    <Reveal mode="rise" delay={0.16}>
                      <h3 className="type-label rule-b pb-3 text-ember">What you get back</h3>
                      <ul className="mt-5 flex flex-col gap-3">
                        {phase.fromUs.map((item) => (
                          <li key={item} className="type-small flex gap-3">
                            <span aria-hidden className="mt-[0.55em] h-px w-3 shrink-0 bg-ember" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </Reveal>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* The refusals, given the same weight as the promises. */}
      <section className="ground-ink-2 py-20 md:py-28" data-tour="not-promised">
        <div className="shell grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="rule-b flex items-baseline gap-4 pb-3">
              <span className="type-label-sm text-ember">✳</span>
              <span className="type-label text-quiet">What we won&apos;t promise</span>
            </div>
            <h2 className="type-h2 mt-8">
              The honest <em className="italic-voice text-ember">part</em>.
            </h2>
          </div>

          <ul className="lg:col-span-7 lg:col-start-6">
            {notPromised.map((item, i) => (
              <li key={item}>
                <Reveal mode="rise" delay={i * 0.07}>
                  <div className="rule-b flex items-start gap-6 py-6">
                    <span className="type-label-sm mt-1 shrink-0 text-quieter">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="type-body text-quiet">{item}</p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ground-ink py-20 md:py-28">
        <div className="shell grid items-start gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6" data-tour="onboarding-help">
            <div className="rule-b flex items-baseline gap-4 pb-3">
              <span className="type-label-sm text-ember">✳</span>
              <span className="type-label text-quiet">If something is unclear</span>
            </div>
            <h2 className="type-h2 mt-8">
              Never guess at <em className="italic-voice text-ember">process</em>.
            </h2>
            <p className="type-lead mt-6 max-w-md text-quiet">
              The help centre covers services, pricing and admin. The{" "}
              <span className="text-bone">?</span> in the navigation answers for whichever
              page you are on. {siteConfig.responsePromise}
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Button href="/contact" size="lg" trailingIcon={<ArrowRight />}>
                Get a custom quote
              </Button>
              <Button href="/help" size="lg" variant="secondary">
                Open the help centre
              </Button>
            </div>

            <p className="type-small mt-8 text-quieter">
              Curious how we think?{" "}
              <Link href="/work" className="link-underline text-quiet">
                See our work
              </Link>
              .
            </p>
          </div>

          <Reveal mode="mask" className="hidden lg:col-span-4 lg:col-start-9 lg:block">
            <Aperture
              figure="wave"
              tone="ink"
              anchor="center"
              dot={4}
              label="How we work"
              index="Fig. 04"
              className="aspect-[3/4] w-full border border-[var(--color-line)]"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
