import Script from "next/script";
import { siteConfig } from "@/lib/site-config";

/**
 * GA4, loaded only when NEXT_PUBLIC_GA_ID is configured — an unconfigured
 * deployment ships no tracking script and no third-party request at all.
 *
 * Loads after hydration so it never competes with rendering, and starts with
 * consent denied for ad storage, which keeps the default behaviour on the
 * defensible side of GDPR/CCPA until a consent banner grants otherwise.
 */
export function GoogleAnalytics() {
  const id = siteConfig.gaId;
  if (!id) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied',
            analytics_storage: 'granted'
          });
          gtag('config', '${id}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
