"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { helpCategories, helpTopics, topicBySlug } from "@/lib/data/help";

/**
 * The help centre body: a filter, a category index, and the topics themselves
 * as ruled disclosure rows. Filtering happens client-side over a small fixed
 * set — no search backend, no request, instant results.
 */
export function HelpIndex() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return helpTopics.filter((topic) => {
      const inCategory = category === "All" || topic.category === category;
      if (!inCategory) return false;
      if (!q) return true;
      return (
        topic.title.toLowerCase().includes(q) ||
        topic.summary.toLowerCase().includes(q) ||
        topic.points.some((point) => point.toLowerCase().includes(q))
      );
    });
  }, [query, category]);

  return (
    <div>
      <div className="rule-b flex flex-col gap-6 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="w-full max-w-md">
          <label htmlFor="help-search" className="type-label-sm block text-quieter">
            Search help
          </label>
          <input
            id="help-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “dashboard”, “cancel”, “ad spend”"
            className="type-body mt-3 w-full border-b border-[var(--rule)] bg-transparent py-3 outline-none transition-colors duration-300 placeholder:text-quieter focus-visible:border-ember"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["All", ...helpCategories].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`type-label-sm rounded-full border px-4 py-2.5 transition-colors duration-300 ${
                category === item
                  ? "border-ember bg-ember text-[#fff6f1]"
                  : "border-[var(--rule)] text-quiet hover:text-current"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="type-label-sm mt-5 text-quieter" role="status">
        {results.length} {results.length === 1 ? "topic" : "topics"}
      </p>

      {results.length === 0 ? (
        <div className="rule-t mt-6 py-16">
          <p className="type-h3">Nothing matches “{query}”.</p>
          <p className="type-small mt-4 max-w-md text-quiet">
            Ask us directly — a person answers, and it is usually faster than
            searching anyway.
          </p>
          <Link href="/contact" className="type-label link-underline mt-6 inline-block text-ember">
            Ask a question
          </Link>
        </div>
      ) : (
        <ul className="mt-6">
          {results.map((topic, i) => (
            <li key={topic.slug} id={topic.slug} className="rule-b scroll-mt-32 py-8 md:py-10">
              <div className="grid gap-5 md:grid-cols-12 md:gap-8">
                <div className="md:col-span-1">
                  <span className="type-label-sm text-quieter">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="md:col-span-5">
                  <p className="type-label-sm text-ember">{topic.category}</p>
                  <h2 className="type-h3 mt-3">{topic.title}</h2>
                  <p className="type-small mt-3 text-quiet">{topic.summary}</p>
                </div>

                <div className="md:col-span-6">
                  <ul className="flex flex-col gap-3">
                    {topic.points.map((point) => (
                      <li key={point} className="type-small flex gap-3 text-quiet">
                        <span aria-hidden className="mt-[0.55em] h-px w-3 shrink-0 bg-ember" />
                        {point}
                      </li>
                    ))}
                  </ul>

                  {topic.related?.length ? (
                    <p className="type-label-sm mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-quieter">
                      <span>See also</span>
                      {topic.related.map((slug) => {
                        const related = topicBySlug(slug);
                        if (!related) return null;
                        return (
                          <a
                            key={slug}
                            href={`#${slug}`}
                            className="link-underline text-quiet hover:text-current"
                          >
                            {related.title}
                          </a>
                        );
                      })}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
