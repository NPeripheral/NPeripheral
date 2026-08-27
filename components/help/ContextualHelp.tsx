"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { topicForRoute } from "@/lib/data/help";
import { cn } from "@/lib/utils";

/**
 * Contextual help.
 *
 * A "?" in the navigation that answers for the page you are standing on: it
 * resolves the current route to a help topic, shows the short version inline,
 * and deep-links to the full entry. Falls back to the help index on routes
 * with no dedicated topic, so the affordance is never a dead end.
 */
export function ContextualHelp({ className, variant = "icon" }: { className?: string; variant?: "icon" | "row" }) {
  const pathname = usePathname() ?? "/";
  const topic = topicForRoute(pathname);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Route changes invalidate the answer, so the panel closes with them.
  const [trackedPath, setTrackedPath] = useState(pathname);
  if (pathname !== trackedPath) {
    setTrackedPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  const heading = topic?.title ?? "Help centre";
  const summary =
    topic?.summary ??
    "Answers on engagements, onboarding, reporting and admin — plus a person to ask if the page does not cover it.";
  const href = topic ? `/help#${topic.slug}` : "/help";

  return (
    <div ref={wrapperRef} className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Help with this page"
        className={cn(
          "group/help transition-colors duration-300",
          variant === "icon"
            ? "flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-line)] text-bone/70 hover:border-ember hover:text-ember"
            : "type-label flex w-full items-center justify-between gap-3 py-4 text-quiet",
        )}
      >
        {variant === "icon" ? (
          <span aria-hidden className="type-label-sm leading-none">
            ?
          </span>
        ) : (
          <>
            <span>Help with this page</span>
            <span aria-hidden className="text-ember">
              ?
            </span>
          </>
        )}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={panelId}
            role="dialog"
            aria-label="Help with this page"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "z-[90] w-[min(22rem,calc(100vw-3rem))] border border-[var(--color-line)] bg-[color-mix(in_oklab,var(--color-ink)_96%,transparent)] p-6 backdrop-blur-xl",
              variant === "icon" ? "absolute right-0 top-[calc(100%+0.9rem)]" : "relative mt-2 w-full",
            )}
          >
            <p className="type-label-sm text-ember">
              {topic ? "On this page" : "Help centre"}
            </p>
            <h2 className="type-h3 mt-3 text-bone">{heading}</h2>
            <p className="type-small mt-3 text-quiet">{summary}</p>

            {topic ? (
              <ul className="mt-5 flex flex-col gap-2.5">
                {topic.points.slice(0, 3).map((point) => (
                  <li key={point} className="type-small flex gap-3 text-quiet">
                    <span aria-hidden className="mt-[0.55em] h-px w-3 shrink-0 bg-ember" />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}

            <div className="rule-t mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 pt-5">
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="type-label link-underline text-ember"
              >
                {topic ? "Read the full answer" : "Open the help centre"}
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="type-label-sm link-underline inline-block py-2 text-quieter hover:text-quiet"
              >
                Ask a person
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
