"use client";

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
const EDITABLE = "h1,h2,h3,h4,p,li,dd,dt,figcaption,blockquote,span,a,button";

type Status = { kind: "idle" | "saving" | "saved" | "error"; message?: string };

export function EditMode() {
  const [on, setOn] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const original = useRef<string>("");

  const save = useCallback(async (el: HTMLElement) => {
    const next = (el.innerText ?? "").trim();
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
        el.innerText = prev;
        setStatus({ kind: "error", message: data.error ?? "Could not save." });
        return;
      }
      setStatus({ kind: "saved", message: data.file });
    } catch {
      el.innerText = prev;
      setStatus({ kind: "error", message: "Could not reach the dev server." });
    }
  }, []);

  useEffect(() => {
    if (!on) return;

    const nodes = Array.from(document.querySelectorAll<HTMLElement>(EDITABLE)).filter(
      (el) =>
        // leaf text only: editing a container would rewrite its children too
        el.children.length === 0 &&
        (el.textContent ?? "").trim().length > 2 &&
        !el.closest("[data-edit-ui]"),
    );

    const onFocus = (e: Event) => {
      original.current = ((e.target as HTMLElement).innerText ?? "").trim();
      setStatus({ kind: "idle" });
    };
    const onBlur = (e: Event) => void save(e.target as HTMLElement);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        (e.target as HTMLElement).blur();
      }
      if (e.key === "Escape") {
        (e.target as HTMLElement).innerText = original.current;
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
  }, [on, save]);

  if (process.env.NODE_ENV === "production") return null;

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
