import type { Metadata, Viewport } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { siteConfig, socialLinks } from "@/lib/site-config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { CustomCursor } from "@/components/motion/CustomCursor";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { PreloaderMount } from "@/components/motion/PreloaderMount";
import { StickyMobileCta } from "@/components/ui/StickyMobileCta";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { SceneCanvas } from "@/components/scene/SceneCanvas";
import { EditMode } from "@/components/dev/EditMode";
import { GroundWatcher } from "@/components/scene/GroundWatcher";

/* Voice: an editorial serif with real italics. */
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

/* Reading: quiet, neutral, gets out of the way. */
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

/* Instrumentation: indices, metrics, metadata. */
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.motto}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "social media marketing",
    "social media management",
    "social media marketing Fort Worth",
    "social media management Fort Worth",
    "digital marketing",
    "social media strategy",
    "content marketing",
    "social media content",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  applicationName: siteConfig.name,
  formatDetection: { telephone: true, email: true, address: true },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.motto}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.motto}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

/* Local business schema.
   Typed as both MarketingAgency and LocalBusiness so it satisfies the
   professional-services vocabulary and the local pack at once, with geo,
   hours and service area attached. */
/* Organization schema — deliberately NOT LocalBusiness.
   LocalBusiness (and its geo, hasMap and openingHoursSpecification fields)
   describes a place customers can visit. Our address is a virtual mailbox,
   so marking it up as a storefront would be a false claim to Google as well
   as to a reader. What is published instead: who we are, how to reach us,
   what we do, and where our clients are. `areaServed` carries the Fort Worth
   signal without inventing a shopfront. */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${siteConfig.url}/#organization`,
  name: siteConfig.name,
  slogan: siteConfig.motto,
  description: siteConfig.description,
  url: siteConfig.url,
  logo: `${siteConfig.url}/icon`,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  email: siteConfig.email,
  telephone: siteConfig.phone,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: siteConfig.email,
    telephone: siteConfig.phone,
    areaServed: "US",
    availableLanguage: "English",
  },
  address: {
    "@type": "PostalAddress",
    name: "Business mailing address",
    streetAddress: `${siteConfig.mailingAddress.line1}, ${siteConfig.mailingAddress.line2}`,
    addressLocality: siteConfig.mailingAddress.city,
    addressRegion: siteConfig.mailingAddress.region,
    postalCode: siteConfig.mailingAddress.postalCode,
    addressCountry: siteConfig.mailingAddress.countryCode,
  },
  areaServed: [
    { "@type": "City", name: "Fort Worth" },
    { "@type": "State", name: "Texas" },
    { "@type": "Country", name: "United States" },
  ],
  knowsAbout: [
    "Social media marketing",
    "Social media management",
    "Content strategy",
    "Short-form video",
    "Social media optimization",
  ],
  ...(socialLinks.length > 0 ? { sameAs: socialLinks.map((s) => s.href) } : {}),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  publisher: { "@id": `${siteConfig.url}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/blog?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable} h-full`}
    >
      <body className="flex min-h-full flex-col bg-ink font-sans text-bone antialiased">
        <Script
          id="ld-organization"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />

        <a
          href="#main-content"
          className="glass fixed left-6 top-6 z-[130] -translate-y-32 px-5 py-3 text-sm font-medium text-bone transition-transform duration-300 focus-visible:translate-y-0"
        >
          Skip to main content
        </a>

        <PreloaderMount />
        <SmoothScroll />
        <SceneCanvas />
        <GroundWatcher />
        <EditMode />
        <ScrollProgress />
        <CustomCursor />

        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />

        <CommandPalette />
        <StickyMobileCta />
        <ChatWidget />
        <GoogleAnalytics />

        {/* One page-wide grain plate. Fixed, so it does not scroll with content. */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[60] opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </body>
    </html>
  );
}
