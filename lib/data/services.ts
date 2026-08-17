export type Service = {
  slug: string;
  title: string;
  /** One line, plain language, no promised outcome. */
  summary: string;
  description: string;
  includes: string[];
  icon: "social" | "ads" | "branding" | "content" | "strategy" | "analytics" | "seo";
  glow: "purple" | "blue" | "coral" | "lime";
};

/**
 * What we actually do.
 *
 * Every line describes work performed, not a result promised. Nothing here
 * says "grow your following by X" or "guaranteed engagement" — those are
 * outcomes we do not control and will not sell.
 *
 * Services are chosen per client. No engagement includes all seven by default.
 */
export const services: Service[] = [
  {
    slug: "social-media-management",
    title: "Social Media Management",
    summary: "Your accounts stay active and consistent without you having to run them.",
    description:
      "Day-to-day management of your social presence — scheduling, publishing, and keeping the accounts moving so consistency does not depend on you finding a spare hour.",
    includes: [
      "Content calendar and scheduling",
      "Publishing across your chosen platforms",
      "Ongoing account upkeep",
    ],
    icon: "social",
    glow: "purple",
  },
  {
    slug: "content-strategy",
    title: "Content Strategy",
    summary: "A plan for what to post, where, and why.",
    description:
      "Planning content around your business, your audience and the platforms that matter to you — so posting stops being a guess about what to put up today.",
    includes: [
      "Audience and platform research",
      "Content pillars and posting cadence",
      "A calendar you can actually follow",
    ],
    icon: "strategy",
    glow: "blue",
  },
  {
    slug: "content-creation",
    title: "Content Creation",
    summary: "Graphics, captions and assets built for the feed they live in.",
    description:
      "Producing the social graphics, captions, and marketing materials your plan calls for — designed for the platform they ship to rather than resized from one another.",
    includes: [
      "Social graphics and templates",
      "Captions and copy",
      "Platform-specific formatting",
    ],
    icon: "content",
    glow: "coral",
  },
  {
    slug: "short-form-video",
    title: "Short-Form Video",
    summary: "Concepts and structure for TikTok, Reels and Shorts.",
    description:
      "Developing short-form video concepts and the structure behind them — hooks, pacing, and formats suited to how each platform is actually watched.",
    includes: [
      "Video concepts and hooks",
      "Shot lists and scripting support",
      "Format guidance per platform",
    ],
    icon: "ads",
    glow: "lime",
  },
  {
    slug: "social-media-optimization",
    title: "Social Media Optimization",
    summary: "Making your existing profiles present the business properly.",
    description:
      "Improving what is already there — profiles, bios, branding, highlights, calls-to-action and overall presentation — so someone landing on your page understands what you do straight away.",
    includes: [
      "Profile, bio and link review",
      "Visual consistency across platforms",
      "Clearer calls-to-action",
    ],
    icon: "branding",
    glow: "purple",
  },
  {
    slug: "community-engagement",
    title: "Community Engagement",
    summary: "Staying responsive to the people who reach out.",
    description:
      "Keeping your accounts active in conversation — replying, monitoring mentions, and making sure comments and messages do not sit unanswered for days.",
    includes: [
      "Comment and DM monitoring",
      "Response guidelines in your voice",
      "Flagging anything that needs you",
    ],
    icon: "analytics",
    glow: "blue",
  },
  {
    slug: "social-media-strategy",
    title: "Social Media Strategy",
    summary: "A customized plan built around your goals and your resources.",
    description:
      "A strategy shaped by what your business is trying to do, who you are trying to reach, and what you realistically have time and budget for — not a template applied to every client.",
    includes: [
      "Goal and audience definition",
      "Channel selection and priorities",
      "A plan scoped to your resources",
    ],
    icon: "seo",
    glow: "coral",
  },
];
