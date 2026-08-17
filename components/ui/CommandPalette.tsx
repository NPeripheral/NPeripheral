"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { helpTopics } from "@/lib/data/help";
import { navLinks, siteConfig } from "@/lib/site-config";
import { scrollToElement } from "@/lib/smooth-scroll";

type Command = {
  id: string;
  label: string;
  group: "Pages" | "Chapters" | "Help" | "Actions";
  hint?: string;
  /** In-page target on the homepage. */
  anchor?: string;
  href?: string;
  external?: boolean;
};

/* The chapters that carry an id on the homepage. */
const chapters: Command[] = [
  { id: "ch-02", label: "Services", group: "Chapters", hint: "02", anchor: "#services" },
  { id: "ch-05", label: "The output, by channel", group: "Chapters", hint: "05", anchor: "#portfolio" },
  { id: "ch-06", label: "Selected results", group: "Chapters", hint: "06", anchor: "#case-studies" },
  { id: "ch-07", label: "How the work runs", group: "Chapters", hint: "07", anchor: "#process" },
  { id: "ch-05", label: "Our work", group: "Chapters", hint: "05", anchor: "#work" },
  { id: "ch-09", label: "Pricing", group: "Chapters", hint: "09", anchor: "#pricing" },
  { id: "ch-12", label: "Questions", group: "Chapters", hint: "12", anchor: "#faq" },
  { id: "ch-14", label: "Start a project", group: "Chapters", hint: "14", anchor: "#contact-cta" },
];

const pages: Command[] = [
  ...navLinks
    .filter((link) => !link.href.startsWith("/#"))
    .map((link) => ({ id: `p-${link.href}`, label: link.label, group: "Pages" as const, href: link.href })),
  { id: "p-home", label: "Home", group: "Pages", href: "/" },
  { id: "p-onboarding", label: "Onboarding", group: "Pages", href: "/onboarding" },
  { id: "p-help", label: "Help centre", group: "Pages", href: "/help" },
  { id: "p-work", label: "Our work", group: "Pages", href: "/work" },
];

const actions: Command[] = [
  { id: "a-quote", label: "Get a custom quote", group: "Actions", href: "/contact" },
  { id: "a-email", label: `Email ${siteConfig.email}`, group: "Actions", href: `mailto:${siteConfig.email}`, external: true },
  { id: "a-phone", label: `Call ${siteConfig.phone}`, group: "Actions", href: `tel:${siteConfig.phoneHref}`, external: true },
];

const GROUP_ORDER: Command["group"][] = ["Chapters", "Pages", "Help", "Actions"];

/**
 * ⌘K palette.
 *
 * One keystroke to reach any chapter, page, help topic or contact route.
 * Chapters scroll through Lenis when you are already on the homepage and
 * route with a hash when you are not, so the entry point never matters.
 */
export function CommandPalette() {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = "command-palette-list";

  const mounted = typeof document !== "undefined";

  const commands = useMemo<Command[]>(
    () => [
      ...chapters,
      ...pages,
      ...helpTopics.map((topic) => ({
        id: `h-${topic.slug}`,
        label: topic.title,
        group: "Help" as const,
        hint: topic.category,
        href: `/help#${topic.slug}`,
      })),
      ...actions,
    ],
    [],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q
      ? commands.filter(
          (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q) || c.hint?.toLowerCase().includes(q),
        )
      : commands;
    return GROUP_ORDER.flatMap((group) => matched.filter((c) => c.group === group));
  }, [commands, query]);

  const run = useCallback(
    (command: Command) => {
      setOpen(false);
      setQuery("");

      if (command.anchor) {
        if (pathname === "/") {
          const el = document.querySelector(command.anchor);
          if (el) scrollToElement(el, { block: "start" });
        } else {
          router.push(`/${command.anchor}`);
        }
        return;
      }

      if (!command.href) return;
      if (command.external) {
        window.open(command.href, command.href.startsWith("http") ? "_blank" : "_self", "noopener,noreferrer");
      } else {
        router.push(command.href);
      }
    },
    [pathname, router],
  );

  // Global shortcut.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setActive(0);
        setOpen((v) => !v);
      }
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.documentElement.style.overflow = previous;
    };
  }, [open]);

  function onInputKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => Math.min(results.length - 1, i + 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    }
    if (event.key === "Enter") {
      event.preventDefault();
      const command = results[active];
      if (command) run(command);
    }
  }

  // Keep the highlighted row in view as the selection walks the list.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[115] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.2 }}
        >
          <button
            type="button"
            aria-label="Close the command palette"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-[rgba(11,10,9,0.82)] backdrop-blur-sm"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ y: reduced ? 0 : -14, scale: reduced ? 1 : 0.985 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: reduced ? 0 : -10, scale: reduced ? 1 : 0.99 }}
            transition={{ duration: reduced ? 0 : 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl border border-[var(--color-line)] bg-ink shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)]"
          >
            <div className="rule-b flex items-center gap-4 px-5 py-4">
              <span aria-hidden className="type-label-sm text-ember">
                ⌘K
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Jump to a chapter, page or answer…"
                aria-label="Search commands"
                role="combobox"
                aria-expanded
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
                className="type-body w-full bg-transparent text-bone outline-none placeholder:text-quieter"
              />
              <span className="type-label-sm hidden text-quieter sm:block">Esc</span>
            </div>

            <ul ref={listRef} id={listId} role="listbox" aria-label="Commands" className="max-h-[52vh] overflow-y-auto py-2">
              {results.length === 0 ? (
                <li className="px-5 py-8">
                  <p className="type-small text-quiet">
                    Nothing matches “{query}”. Try “pricing”, “onboarding” or “cancel”.
                  </p>
                </li>
              ) : (
                results.map((command, i) => {
                  const first = i === 0 || results[i - 1].group !== command.group;
                  return (
                    <li key={command.id}>
                      {first ? (
                        <p className="type-label-sm px-5 pb-2 pt-4 text-quieter">{command.group}</p>
                      ) : null}
                      <div
                        id={`cmd-${command.id}`}
                        role="option"
                        data-index={i}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => run(command)}
                        aria-selected={i === active}
                        className={`flex w-full cursor-pointer items-baseline gap-4 px-5 py-2.5 text-left transition-colors duration-150 ${
                          i === active ? "bg-bone/[0.06] text-bone" : "text-quiet"
                        }`}
                      >
                        <span
                          aria-hidden
                          className={`type-label-sm w-3 shrink-0 ${i === active ? "text-ember" : "text-transparent"}`}
                        >
                          ›
                        </span>
                        <span className="type-body flex-1 truncate">{command.label}</span>
                        {command.hint ? (
                          <span className="type-label-sm shrink-0 text-quieter">{command.hint}</span>
                        ) : null}
                      </div>
                    </li>
                  );
                })
              )}
            </ul>

            <p className="rule-t type-label-sm px-5 py-3 leading-[1.7] text-quieter">
              ↑↓ to move · ↵ to open · Esc to close
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

/** The affordance that tells people the palette exists. */
export function CommandPaletteHint({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() =>
        document.dispatchEvent(
          new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }),
        )
      }
      aria-label="Open the command palette"
      className={`type-label-sm flex h-9 items-center gap-1.5 rounded-full border border-[var(--color-line)] px-3 text-bone/60 transition-colors duration-300 hover:border-ember hover:text-ember ${className ?? ""}`}
    >
      <span aria-hidden>⌘</span>
      <span aria-hidden>K</span>
    </button>
  );
}
