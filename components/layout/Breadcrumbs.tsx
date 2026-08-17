import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export type Crumb = { label: string; href: string };

/**
 * Breadcrumb trail, rendered as a mono rule above the page title and emitted
 * as BreadcrumbList structured data in the same pass — so the visible trail
 * and the one search engines read can never disagree.
 *
 * Home is prepended automatically; pass only the trail below it. The final
 * crumb is the current page and is not a link.
 */
export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }, ...trail];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: `${siteConfig.url}${crumb.href === "/" ? "" : crumb.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-3">
                {isLast ? (
                  <span className="type-label-sm text-quiet" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="type-label-sm link-underline text-quieter hover:text-quiet"
                  >
                    {crumb.label}
                  </Link>
                )}
                {!isLast ? (
                  <span aria-hidden className="text-ember">
                    /
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
