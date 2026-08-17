/** Accepts "calendly.com/you" or "https://calendly.com/you" and returns a
    usable absolute URL, so a missing protocol never produces a dead link. */
function normaliseUrl(value: string | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const siteConfig = {
  name: "NPeripheral",
  motto: "Appear to your audience.",
  tagline:
    "Social media marketing that helps your business build a stronger online presence and show up consistently in front of the right people.",
  description:
    "NPeripheral is a social media marketing and management company helping businesses build a consistent, intentional online presence. Custom plans built around your platforms, goals and budget. Serving Fort Worth, Texas and clients nationwide.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.nperipheral.com",
  ogImage: "/opengraph-image",

  /* --- Contact ---------------------------------------------------------- */
  email: "Deidrion.santiago@Nperipheral.com",
  phone: "800-716-7209",
  phoneHref: "+18007167209",

  /* --- Mailing address --------------------------------------------------
     This is a virtual mailing address, not an office. It is labelled as a
     mailing address everywhere it appears, it is never described as a place
     clients can visit, and it is deliberately kept out of LocalBusiness
     schema — publishing a mailbox as a storefront is exactly the kind of
     claim this site does not make. */
  mailingAddress: {
    line1: "8101 Boat Club Rd",
    line2: "Ste 240 PMB 624",
    city: "Fort Worth",
    region: "TX",
    postalCode: "76179",
    country: "United States",
    countryCode: "US",
  },
  /** Where clients are, not where a building is. */
  serviceArea: "Fort Worth, Texas and clients nationwide",
  remote: true,

  /* --- How we answer ----------------------------------------------------
     A commitment we can actually keep, stated in the same words everywhere. */
  responsePromise: "Every enquiry gets a reply within one business day.",
  responsePromiseShort: "Reply within 1 business day",

  /* --- Booking ----------------------------------------------------------
     Set NEXT_PUBLIC_CALENDLY_URL to switch the site from "email us" to a
     live scheduler. Until then nothing pretends a calendar exists. */
  calendlyUrl: normaliseUrl(process.env.NEXT_PUBLIC_CALENDLY_URL),
  isCalendlyConfigured: Boolean(process.env.NEXT_PUBLIC_CALENDLY_URL),

  gaId: process.env.NEXT_PUBLIC_GA_ID ?? "",
} as const;

/* --------------------------------------------------------------------------
   Social accounts

   Only profiles that actually exist belong here. Add a URL and the link
   appears in the navigation, footer and schema automatically; leave it empty
   and nothing renders. No placeholder links to accounts nobody owns.
   -------------------------------------------------------------------------- */
export type SocialLink = { label: string; href: string };

const socialEntries: SocialLink[] = [
  { label: "Instagram", href: "" },
  { label: "TikTok", href: "" },
  { label: "LinkedIn", href: "" },
  { label: "YouTube", href: "" },
  { label: "Facebook", href: "" },
  { label: "X", href: "" },
];

export const socialLinks = socialEntries.filter((entry) => entry.href.length > 0);
export const hasSocialLinks = socialLinks.length > 0;

/* --------------------------------------------------------------------------
   Address helpers — one source of truth for display and metadata.
   -------------------------------------------------------------------------- */
const a = siteConfig.mailingAddress;

export const addressLines = [a.line1, a.line2, `${a.city}, ${a.region} ${a.postalCode}`, a.country];
export const addressOneLine = `${a.line1}, ${a.line2}, ${a.city}, ${a.region} ${a.postalCode}`;

export type NavLink = {
  label: string;
  href: string;
};

export const navLinks: NavLink[] = [
  { label: "Services", href: "/#services" },
  { label: "Work", href: "/work" },
  { label: "Process", href: "/#process" },
  { label: "Pricing", href: "/#pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const footerLinks = {
  company: [
    { label: "About", href: "/about" },
    { label: "Our Work", href: "/work" },
    { label: "How We Work", href: "/onboarding" },
    { label: "Help Centre", href: "/help" },
    { label: "Resources", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  services: [
    { label: "Social Media Management", href: "/#services" },
    { label: "Content Strategy", href: "/#services" },
    { label: "Content Creation", href: "/#services" },
    { label: "Short-Form Video", href: "/#services" },
    { label: "Social Media Optimization", href: "/#services" },
    { label: "Community Engagement", href: "/#services" },
    { label: "Social Media Strategy", href: "/#services" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
  ],
};
