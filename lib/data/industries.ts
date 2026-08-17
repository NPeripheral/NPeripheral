export type IndustryPage = {
  slug: string;
  name: string;
  headline: string;
  gradientWord: string;
  description: string;
  /** Problems we hear, not results we claim. */
  painPoints: string[];
  /** Service slugs from lib/data/services.ts. */
  services: string[];
  approach: string[];
  glow: "purple" | "blue" | "coral" | "lime";
};

/**
 * Who we work with.
 *
 * These pages describe the kinds of business we are built for and how we
 * would approach each one. They contain no client names, no case studies and
 * no performance figures, because there are none to report yet.
 */
export const industryPages: IndustryPage[] = [
  {
    slug: "local-service",
    name: "Local & service businesses",
    headline: "The work is good. The problem is nobody local knows",
    gradientWord: "nobody local knows",
    description:
      "Trades, salons, studios, clinics and service businesses that get most of their work by referral and want a presence that supports it.",
    painPoints: [
      "The account was set up years ago and has not been touched since",
      "Great work happens every day and none of it gets photographed",
      "People find the profile, cannot tell if you cover their area, and leave",
    ],
    services: ["social-media-optimization", "content-creation", "social-media-management"],
    approach: [
      "Fix the profile first — service area, hours, and one obvious way to book",
      "Build the content from work that is already happening on the job",
      "A posting rhythm that survives your busiest week, not just your quietest",
    ],
    glow: "purple",
  },
  {
    slug: "small-product-brands",
    name: "Small product brands",
    headline: "Good products, inconsistent presence",
    gradientWord: "inconsistent presence",
    description:
      "Independent makers, small e-commerce lines and DTC brands with decent photography and no reliable posting pattern.",
    painPoints: [
      "Posting happens in bursts around launches, then stops",
      "The grid looks like three different brands",
      "Content gets made and then never used again",
    ],
    services: ["content-strategy", "content-creation", "short-form-video"],
    approach: [
      "Start with a calendar built from assets you already own",
      "Templates that keep things coherent without redesigning every post",
      "One short-form format the founder can repeat without a studio",
    ],
    glow: "blue",
  },
  {
    slug: "hospitality",
    name: "Food, drink & hospitality",
    headline: "Regulars know you. Neighbours have never heard of you",
    gradientWord: "never heard of you",
    description:
      "Cafés, restaurants, bars and food businesses whose atmosphere is the product and whose social media does not show it.",
    painPoints: [
      "Photos get taken but never posted",
      "Specials and hours change and the profile does not",
      "The account looks the same as every other place in town",
    ],
    services: ["social-media-management", "content-creation", "community-engagement"],
    approach: [
      "Lead with people and process — the things a chain cannot copy",
      "Keep the practical details current, because that is what people check",
      "Reply to comments and messages properly, since hospitality is the product",
    ],
    glow: "coral",
  },
  {
    slug: "professional-services",
    name: "Professional services",
    headline: "Expertise that never leaves the room",
    gradientWord: "never leaves the room",
    description:
      "Consultants, agencies, advisors and B2B service providers whose knowledge is the offer and whose social presence does not reflect it.",
    painPoints: [
      "Posting feels like self-promotion, so it does not happen",
      "The expertise is real and completely invisible online",
      "LinkedIn activity is sporadic and reads as corporate",
    ],
    services: ["social-media-strategy", "content-strategy", "content-creation"],
    approach: [
      "Turn the questions clients actually ask into the content plan",
      "A voice that sounds like a person, not a press release",
      "A cadence sustainable alongside billable work",
    ],
    glow: "lime",
  },
];
