export type Advantage = {
  key: string;
  title: string;
  description: string;
};

/**
 * Why work with us.
 *
 * These are advantages of a small, focused operation stated as facts about
 * how we work — not apologies for being new, and not comparisons that put
 * words in a competitor's mouth.
 */
export const advantages: Advantage[] = [
  {
    key: "personal",
    title: "Personalized attention",
    description:
      "You are not one account on a list of two hundred. You deal directly with the person doing the work, and your business is one we actually have time to understand.",
  },
  {
    key: "flexible",
    title: "Flexible approach",
    description:
      "Your plan is not locked in a drawer. As your business changes — new products, new priorities, a season that matters — the strategy moves with it.",
  },
  {
    key: "modern",
    title: "Modern content",
    description:
      "Built around the platforms and formats people are genuinely consuming right now, not the ones that worked five years ago.",
  },
  {
    key: "transparent",
    title: "Transparent communication",
    description:
      "Clear expectations, clear scope, and no pretending marketing produces overnight miracles. If something is not working, you hear it from us first.",
  },
  {
    key: "growth",
    title: "Built to grow with you",
    description:
      "NPeripheral is building alongside the businesses it serves. That means we are invested in your results in a way a large agency's junior account manager simply is not.",
  },
];
