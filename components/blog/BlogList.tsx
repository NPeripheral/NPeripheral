"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BlogPost } from "@/lib/data/blog-posts";
import { BlogCard } from "@/components/blog/BlogCard";
import { cn } from "@/lib/utils";

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const categories = useMemo(() => ["All", ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);

  const featured = posts.find((p) => p.featured);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      const matchesCategory = category === "All" || p.category === category;
      const matchesQuery =
        !q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [posts, query, category]);

  const isDefaultView = query.trim() === "" && category === "All";
  const gridPosts = isDefaultView ? filtered.filter((p) => p.slug !== featured?.slug) : filtered;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={cn(
 "rounded-full border px-4 py-2 text-xs font-medium transition-colors",
                category === c
                  ? "border-ember bg-ember-2/10 text-ember-2"
                  : "border-[var(--color-line)] text-quiet hover:border-[var(--color-line)] hover:text-bone",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles…"
            aria-label="Search articles"
            className="glass w-full rounded-full px-5 py-2.5 text-sm text-bone placeholder:text-quieter outline-none focus-visible:border-ember"
          />
        </div>
      </div>

      {isDefaultView && featured ? (
        <div className="mt-10">
          <BlogCard post={featured} featured />
        </div>
      ) : null}

      <motion.div layout className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {gridPosts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-quiet">No articles match your search — try a different term.</p>
      ) : null}
    </div>
  );
}
