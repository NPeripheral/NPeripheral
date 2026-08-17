import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { blogPosts } from "@/lib/data/blog-posts";
import { industryPages } from "@/lib/data/industries";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${siteConfig.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteConfig.url}/onboarding`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/work`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteConfig.url}/help`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/onboarding`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.url}/legal/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteConfig.url}/legal/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const industryRoutes: MetadataRoute.Sitemap = industryPages.map((industry) => ({
    url: `${siteConfig.url}/industries/${industry.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...industryRoutes];
}
