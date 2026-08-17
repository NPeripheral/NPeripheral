export type HelpTopic = {
  slug: string;
  title: string;
  category: "Getting started" | "Working together" | "Pricing" | "Admin";
  summary: string;
  points: string[];
  /**
   * Route prefixes this topic answers for. The contextual help launcher picks
   * the longest match, so "/work/x" beats the homepage.
   */
  routes: string[];
  related?: string[];
};

export const helpTopics: HelpTopic[] = [
  {
    slug: "what-we-do",
    title: "What NPeripheral does",
    category: "Getting started",
    summary:
      "Social media marketing and management — strategy, content, and keeping your presence consistent.",
    points: [
      "Seven services, chosen per client. No engagement includes all of them by default.",
      "We usually recommend fewer platforms than you expect, done properly.",
      "We do the work; we do not promise follower counts or revenue.",
      "You own every account and asset involved.",
    ],
    routes: ["/"],
    related: ["how-pricing-works", "how-we-work"],
  },
  {
    slug: "getting-in-touch",
    title: "Getting in touch",
    category: "Getting started",
    summary:
      "Send the form, email, or call. Every enquiry gets a reply within one business day.",
    points: [
      "The form asks what it needs to quote you properly — nothing extra.",
      "No preparation needed; links to what you already have is plenty.",
      "Meetings happen by call or video. Our address is a mailing address, not an office.",
      "You will get a scope and a price, whether or not you go ahead.",
    ],
    routes: ["/contact", "/thank-you"],
    related: ["how-pricing-works"],
  },
  {
    slug: "how-pricing-works",
    title: "How pricing works",
    category: "Pricing",
    summary:
      "Quoted per business, because platforms, posting frequency and content needs vary enormously.",
    points: [
      "Eight factors move a quote — they are all listed on the pricing section.",
      "There is no rate card, because a fixed number would be wrong for most businesses.",
      "You get the price before you commit to anything.",
      "Ad spend, if you run ads, is paid to the platforms directly and stays in your accounts.",
    ],
    routes: ["/#pricing"],
    related: ["what-we-do", "contracts-and-ownership"],
  },
  {
    slug: "how-we-work",
    title: "How we work together",
    category: "Working together",
    summary: "Four stages — discover, strategize, create, appear — with a plan you approve first.",
    points: [
      "Nothing gets published before you have seen and approved the plan.",
      "You always know what is going out, where and why.",
      "The approach gets adjusted as we learn what your audience responds to.",
      "If something is not working, you hear it from us first.",
    ],
    routes: ["/onboarding", "/#process"],
    related: ["what-we-do", "contracts-and-ownership"],
  },
  {
    slug: "reading-our-work",
    title: "Reading our work page",
    category: "Working together",
    summary:
      "Everything shown is currently a concept project — speculative work made to show our approach.",
    points: [
      "Concept projects were not produced for paying clients.",
      "They carry no performance numbers, because there are none to report.",
      "They show how we would approach a type of business, not what we achieved.",
      "Real client work will be labelled as such, with permission, when it exists.",
    ],
    routes: ["/work"],
    related: ["what-we-do"],
  },
  {
    slug: "contracts-and-ownership",
    title: "Contracts, cancellation and ownership",
    category: "Admin",
    summary:
      "No long lock-in, and every account and asset stays in your name.",
    points: [
      "We would rather keep your business because the work is worth keeping.",
      "Accounts, logins, templates and content are yours throughout and afterwards.",
      "Nothing stops working if we stop working together.",
      "The full terms are on the Terms of Service page.",
    ],
    routes: ["/legal/terms"],
    related: ["how-pricing-works"],
  },
  {
    slug: "your-data",
    title: "What we do with your data",
    category: "Admin",
    summary:
      "We collect what an enquiry needs to be answered, and we do not sell it.",
    points: [
      "Form submissions are used to reply to you and scope your work.",
      "Analytics only runs if it has been configured, and ad-storage consent is denied by default.",
      "You can ask us to delete your enquiry at any time by email.",
      "The full detail is in the privacy policy.",
    ],
    routes: ["/legal/privacy"],
    related: ["contracts-and-ownership"],
  },
];

export const helpCategories = ["Getting started", "Working together", "Pricing", "Admin"] as const;

/** Longest matching route prefix wins, so nested routes beat the homepage. */
export function topicForRoute(pathname: string): HelpTopic | undefined {
  let best: HelpTopic | undefined;
  let bestLength = -1;

  for (const topic of helpTopics) {
    for (const route of topic.routes) {
      const base = route.split("#")[0] || "/";
      const matches = base === "/" ? pathname === "/" : pathname.startsWith(base);
      if (matches && base.length > bestLength) {
        best = topic;
        bestLength = base.length;
      }
    }
  }

  return best;
}

export function topicBySlug(slug: string) {
  return helpTopics.find((topic) => topic.slug === slug);
}
