"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { BlogPost } from "@/lib/data/blog-posts";
import { formatDate, cn } from "@/lib/utils";

const glowGradient: Record<BlogPost["glow"], string> = {
  purple: "from-brand-purple/40 via-brand-blue/20 to-transparent",
  blue: "from-brand-blue/40 via-brand-purple/20 to-transparent",
  coral: "from-brand-coral/40 via-brand-purple/20 to-transparent",
  lime: "from-brand-lime/40 via-brand-blue/20 to-transparent",
};

const glowText: Record<BlogPost["glow"], string> = {
  purple: "text-ember",
  blue: "text-ember",
  coral: "text-ember-2",
  lime: "text-ember-2",
};

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className={cn("group glass overflow-hidden rounded-2xl border border-[var(--color-line)]", featured && "md:col-span-2")}
    >
      <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
        <div className={cn("relative overflow-hidden bg-gradient-to-br p-8", glowGradient[post.glow], featured ? "h-56" : "h-36")}>
          <div className="bg-mesh absolute inset-0 opacity-40 transition-transform duration-700 group-hover:scale-110" aria-hidden />
          <span className="glass relative inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-bone">
            {post.category}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3
            className={cn(
 "font-display font-semibold text-bone transition-colors group-hover:text-ember-2",
              featured ? "text-2xl" : "text-lg",
            )}
          >
            {post.title}
          </h3>
          <p className="mt-2.5 flex-1 type-small text-quiet">{post.excerpt}</p>
          <div className="mt-5 flex items-center justify-between text-xs text-quiet">
            <span>
              {post.author} · {formatDate(post.publishedAt)}
            </span>
            <span className={cn("font-medium", glowText[post.glow])}>{post.readingTime} min read</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
