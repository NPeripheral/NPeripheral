import type { ApertureFigure } from "@/components/visual/Aperture";

export type WorkKind = "concept" | "client";

export type WorkItem = {
  slug: string;
  /**
   * "concept" renders a Concept Project badge and the disclaimer.
   * "client" is reserved for real, delivered, permission-granted work.
   */
  kind: WorkKind;
  title: string;
  /** The kind of business, not a company that exists. */
  category: string;
  summary: string;
  /** What the approach would be. Never a claimed result. */
  approach: string[];
  figure: ApertureFigure;
  tone: "ink" | "cream" | "ember";
};

/**
 * Our work.
 *
 * Everything here is currently a concept piece: a speculative approach to a
 * type of business, made to show how we think. None of it was delivered to a
 * paying client, none of it carries a performance number, and every card says
 * so on its face.
 *
 * To add real work later: set `kind: "client"`, use the real business name
 * with their permission, and only then add outcomes you can evidence.
 */
export const workItems: WorkItem[] = [
  {
    slug: "neighbourhood-coffee-roaster",
    kind: "concept",
    title: "Neighbourhood coffee roaster",
    category: "Local retail & hospitality",
    summary:
      "A concept for a single-location roaster whose regulars know them well and whose neighbours have never heard of them.",
    approach: [
      "Lead with the people and the process — roasting, latte art, early mornings — because that is what a local shop has that a chain does not",
      "One primary channel done well rather than four kept half-alive",
      "A weekly rhythm the owner can sustain after the engagement ends",
    ],
    figure: "horizon",
    tone: "ember",
  },
  {
    slug: "independent-service-business",
    kind: "concept",
    title: "Independent service business",
    category: "Trades & professional services",
    summary:
      "A concept for a service business that gets work by referral and wants a presence that supports it rather than replaces it.",
    approach: [
      "Before-and-after work as the backbone of the content, since the proof is visual and already happening on the job",
      "Profiles rewritten so someone checking you out at 9pm knows the service area, the hours and how to book",
      "Short-form video concepts built from footage the team can capture on a phone",
    ],
    figure: "column",
    tone: "cream",
  },
  {
    slug: "small-product-brand",
    kind: "concept",
    title: "Small product brand",
    category: "E-commerce & DTC",
    summary:
      "A concept for a small product line with good photography and no consistent posting pattern.",
    approach: [
      "A content calendar built around what already exists, so the first month costs nothing extra to produce",
      "Templates that keep the grid coherent without redesigning every post",
      "A short-form format the founder can repeat weekly without a studio",
    ],
    figure: "orbit",
    tone: "ember",
  },
];

export const conceptDisclaimer =
  "Concept projects are speculative work created to show our approach. They were not produced for paying clients and carry no performance claims.";
