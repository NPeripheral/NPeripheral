import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { BlogList } from "@/components/blog/BlogList";
import { getAllPosts } from "@/lib/sanity";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Resources — Blog",
  description:
 "Social media strategy, paid advertising, content, SEO, and branding insights from the NPeripheral team.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Resources — ${siteConfig.name}`,
    description: "Social media strategy, paid advertising, content, SEO, and branding insights.",
    url: `${siteConfig.url}/blog`,
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <>
      <PageHeader
        breadcrumbs={[{ label: "Resources", href: "/blog" }]}
        eyebrow="Resources"
        title="Ideas that help you Appear"
        gradientWord="Appear"
        description="Practical, no-fluff breakdowns of what's actually working in social media marketing right now."
      />

      <section className="pb-24 sm:pb-32">
        <div className="mx-auto max-w-6xl px-6 md:px-10">
          <BlogList posts={posts} />
        </div>
      </section>
    </>
  );
}
