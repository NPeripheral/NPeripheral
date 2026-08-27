"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Edit the page from the page. Development only.
 *
 * Toggle it, click any line of copy, type, click away. The change is written
 * back into the source file, so it survives a restart and shows up in git as a
 * normal diff -- there is no CMS and nothing to deploy.
 *
 * It deliberately edits the SOURCE rather than the DOM. A DOM-only editor looks
 * like it works and loses everything on reload, which is worse than not having
 * one. The consequence is that a string the source builds up from parts cannot
 * be matched, and the editor says so rather than pretending.
 */
// Anchors and buttons are deliberately excluded: contenteditable does not
// suppress their activation, so clicking one to edit its label navigates away
// or toggles the control mid-edit.
const EDITABLE = "h1,h2,h3,h4,p,li,dd,dt,figcaption,blockquote,span";

type Status = { kind: "idle" | "saving" | "saved" | "error"; message?: string };

export function EditMode() {
  const [on, setOn] = useState(false);
  const pathname = usePathname();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const original = useRef<string>("");

  const save = useCallback(async (el: HTMLElement) => {
    const next = (el.textContent ?? "").trim();
    const prev = original.current;
    if (!prev || next === prev) return;

    setStatus({ kind: "saving" });
    try {
      const res = await fetch("/api/edit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ find: prev, replace: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Put the original back: the file did not change, so the page must not
        // pretend it did.
        el.textContent = prev;
        setStatus({ kind: "error", message: data.error ?? "Could not save." });
        return;
      }
      setStatus({ kind: "saved", message: data.file });
    } catch {
      el.textContent = prev;
      setStatus({ kind: "error", message: "Could not reach the dev server." });
    }
  }, []);

  useEffect(() => {
    if (!on) return;

    // Re-read on every pathname change: this component lives in the layout and
    // survives navigation, so a single snapshot leaves the toggle claiming to
    // be on while every node it wired is detached.
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(EDITABLE)).filter(
      (el) =>
        // leaf text only: editing a container would rewrite its children too
        el.children.length === 0 &&
        (el.textContent ?? "").trim().length > 2 &&
        !el.closest("[data-edit-ui]"),
    );

    const onFocus = (e: Event) => {
      // textContent, not innerText: innerText is text-transform aware, so every
      // `type-label` element (uppercase, and most of the site's instrumentation
      // type) reported its RENDERED caps and never matched the source. The user
      // saw "could not find that text" on copy that was plainly there.
      original.current = ((e.target as HTMLElement).textContent ?? "").trim();
      setStatus({ kind: "idle" });
    };
    const onBlur = (e: Event) => void save(e.target as HTMLElement);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        (e.target as HTMLElement).blur();
      }
      if (e.key === "Escape") {
        (e.target as HTMLElement).textContent = original.current;
        (e.target as HTMLElement).blur();
      }
    };

    nodes.forEach((el) => {
      el.setAttribute("contenteditable", "plaintext-only");
      el.dataset.editing = "true";
      el.addEventListener("focus", onFocus);
      el.addEventListener("blur", onBlur);
      el.addEventListener("keydown", onKey as EventListener);
    });

    return () => {
      nodes.forEach((el) => {
        el.removeAttribute("contenteditable");
        delete el.dataset.editing;
        el.removeEventListener("focus", onFocus);
        el.removeEventListener("blur", onBlur);
        el.removeEventListener("keydown", onKey as EventListener);
      });
    };
  }, [on, save, pathname]);

  // Allowlist, not denylist: any NODE_ENV that is not literally "development"
  // (test, staging, unset behind a custom server) must not render this.
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div
      data-edit-ui
      /* Right-aligned and lifted clear of the sticky mobile CTA, which owns
         the bottom of the viewport on small screens -- centred at bottom-4 the
         two controls sat on top of each other. */
      className="fixed bottom-28 right-4 z-[200] select-none sm:bottom-4"
    >
      <div className="flex items-center gap-3 rounded-full border border-white/25 bg-black/90 px-4 py-2 text-white shadow-lg backdrop-blur">
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          className="font-mono text-[11px] uppercase tracking-[0.14em]"
        >
          {on ? "◼ Editing — click text" : "✎ Edit page"}
        </button>

        {status.kind !== "idle" ? (
          <span
            className={`font-mono text-[11px] ${
              status.kind === "error" ? "text-red-300" : "text-white/70"
            }`}
          >
            {status.kind === "saving" ? "saving…" : null}
            {status.kind === "saved" ? `saved → ${status.message}` : null}
            {status.kind === "error" ? status.message : null}
          </span>
        ) : null}
      </div>

      <style>{`
        [data-editing="true"] {
          outline: 1px dashed rgba(255,255,255,0.45);
          outline-offset: 3px;
          cursor: text;
        }
        [data-editing="true"]:focus {
          outline: 2px solid #fff;
          outline-offset: 3px;
        }
      `}</style>
    </div>
  );
}
