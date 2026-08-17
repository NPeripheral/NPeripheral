/**
 * There are no price tiers on this site.
 *
 * A fixed rate card would mean pretending every business needs the same work,
 * which is not true and would produce a number that is wrong for almost
 * everyone. Instead we publish the factors that move a quote, so the pricing
 * page explains *why* it varies rather than hiding behind "contact us".
 */

export type QuoteFactor = {
  key: string;
  title: string;
  description: string;
};

export const quoteFactors: QuoteFactor[] = [
  {
    key: "platforms",
    title: "Platforms",
    description:
      "One channel done properly costs less than four. We would rather start focused than spread you thin.",
  },
  {
    key: "frequency",
    title: "Posting frequency",
    description:
      "How often you publish is the single biggest driver of scope — twice a week and daily are very different jobs.",
  },
  {
    key: "content",
    title: "Content requirements",
    description:
      "Whether we are working with assets you already have or producing graphics and copy from scratch.",
  },
  {
    key: "video",
    title: "Video",
    description:
      "Short-form video concepts, scripting and editing carry more production time than static content.",
  },
  {
    key: "management",
    title: "Account management",
    description:
      "Scheduling and publishing only, or full day-to-day management including monitoring and replies.",
  },
  {
    key: "engagement",
    title: "Community engagement",
    description:
      "Monitoring comments and messages and responding in your voice adds ongoing hours every week.",
  },
  {
    key: "strategy",
    title: "Strategy depth",
    description:
      "A one-time plan is different from an approach we revisit and adjust with you month to month.",
  },
  {
    key: "scope",
    title: "Business size and scope",
    description:
      "A single-location business and a multi-brand operation need different amounts of coordination.",
  },
];

/** Shown alongside the factors so nobody has to guess what happens next. */
export const quoteSteps = [
  "Tell us about your business and what you want social media to do for it.",
  "We come back with a scope and a price built around that — usually within one business day.",
  "If it fits, we start. If it does not, you keep the plan and no hard feelings.",
];
