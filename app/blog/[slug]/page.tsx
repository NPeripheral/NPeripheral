import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllPosts, getPostBySlug } from "@/lib/sanity";
import { blogPosts } from "@/lib/data/blog-posts";
import { PageHeader } from "@/components/layout/PageHeader";
import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { siteConfig } from "@/lib/site-config";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${siteConfig.url}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = await getAllPosts();
  const related = allPosts.filter((p) => p.category === post.category && p.slug !== post.slug).slice(0, 3);

  const articleJsonLd = {
 "@context": "https://schema.org",
 "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
    datePublished: post.publishedAt,
    mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}`,
  };

  return (
    <>
      <script
        id="ld-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <PageHeader
        breadcrumbs={[
          { label: "Resources", href: "/blog" },
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
      />

      <article className="pb-20">
        <div className="mx-auto max-w-3xl px-6 md:px-10">
          <div className="flex items-center justify-between border-b border-[var(--color-line)] pb-6 text-sm text-quiet">
            <span>
              {post.author} · {formatDate(post.publishedAt)}
            </span>
            <span>{post.readingTime} min read</span>
          </div>

          <div className="prose prose-invert mt-8 max-w-none space-y-5">
            {post.content.map((paragraph, i) => (
              <p key={i} className="type-body text-quiet">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-bone/[0.045] p-8 text-center">
            <p className="text-quiet">Want a strategy built specifically for your business?</p>
            <Button href="/contact" size="lg">
              Get a custom quote
            </Button>
          </div>
        </div>
      </article>

      {related.length ? (
        <section className="border-t border-[var(--color-line)] py-20">
          <div className="mx-auto max-w-6xl px-6 md:px-10">
            <h2 className="type-h3 text-bone">More on {post.category}</h2>
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/blog" className="text-sm font-semibold text-ember hover:text-ember-2">
                ← Back to all articles
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
