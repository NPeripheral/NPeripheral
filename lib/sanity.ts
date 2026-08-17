import { createClient, type SanityClient } from "next-sanity";
import { blogPosts as localPosts, type BlogPost } from "@/lib/data/blog-posts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-01-01";

export const isSanityConfigured = Boolean(projectId);

/**
 * Headless CMS integration (Sanity).
 *
 * The blog is fully functional today using the local mock data in
 * lib/data/blog-posts.ts. To go live with real content:
 *   1. Create a Sanity project and set NEXT_PUBLIC_SANITY_PROJECT_ID
 *      (and optionally NEXT_PUBLIC_SANITY_DATASET) in your environment.
 *   2. Add a `post` document type with fields: title, slug, excerpt,
 *      body (array of blocks / portable text), category, author,
 *      publishedAt, readingTime, featured, glow.
 *   3. getAllPosts()/getPostBySlug() below will automatically start
 *      querying Sanity instead of the local fallback — no other code
 *      changes required.
 */
export const sanityClient: SanityClient | null = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

const POSTS_QUERY = `*[_type == "post"] | order(publishedAt desc){
  "slug": slug.current,
  title,
  excerpt,
  "content": body[].children[].text,
  category,
  author,
  publishedAt,
  readingTime,
  featured,
  glow
}`;

const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  "slug": slug.current,
  title,
  excerpt,
  "content": body[].children[].text,
  category,
  author,
  publishedAt,
  readingTime,
  featured,
  glow
}`;

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!sanityClient) return localPosts;
  try {
    const posts = await sanityClient.fetch<BlogPost[]>(POSTS_QUERY);
    return posts?.length ? posts : localPosts;
  } catch {
    return localPosts;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  if (!sanityClient) return localPosts.find((p) => p.slug === slug);
  try {
    const post = await sanityClient.fetch<BlogPost | null>(POST_BY_SLUG_QUERY, { slug });
    return post ?? localPosts.find((p) => p.slug === slug);
  } catch {
    return localPosts.find((p) => p.slug === slug);
  }
}
