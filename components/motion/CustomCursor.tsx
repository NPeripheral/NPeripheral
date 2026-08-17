"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Desktop cursor. A hairline ring that reads the element under the pointer:
 *
 *   data-cursor="view"   → ring fills, shows a label
 *   data-cursor="drag"   → ring widens
 *   data-cursor="hide"   → ring collapses (over text inputs)
 *
 * Touch and coarse pointers never see it, and the native cursor is only
 * suppressed once this component has confirmed it is running.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [state, setState] = useState<"idle" | "view" | "drag" | "hide">("idle");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    document.documentElement.classList.add("has-custom-cursor");

    const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ring = { x: pointer.x, y: pointer.y };
    let frame = 0;

    function onMove(event: PointerEvent) {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      setVisible(true);

      const target = (event.target as HTMLElement | null)?.closest?.(
        "[data-cursor], a, button, input, textarea, select",
      ) as HTMLElement | null;

      if (!target) {
        setState("idle");
        setLabel("");
        return;
      }

      const declared = target.dataset.cursor;
      if (declared === "view" || declared === "drag" || declared === "hide") {
        setState(declared);
        setLabel(target.dataset.cursorLabel ?? (declared === "view" ? "View" : ""));
        return;
      }

      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        setState("hide");
        setLabel("");
        return;
      }

      setState("view");
      setLabel("");
    }

    function onLeave() {
      setVisible(false);
    }

    function tick() {
      ring.x += (pointer.x - ring.x) * 0.18;
      ring.y += (pointer.y - ring.y) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%)`;
      }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  const size = state === "view" ? 74 : state === "drag" ? 96 : state === "hide" ? 0 : 30;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[95] hidden md:block">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex items-center justify-center rounded-full border transition-[width,height,background-color,border-color,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          width: size,
          height: size,
          opacity: visible && state !== "hide" ? 1 : 0,
          borderColor: state === "idle" ? "rgba(244,239,230,0.45)" : "rgba(226,84,42,0.9)",
          backgroundColor: state === "idle" ? "transparent" : "rgba(226,84,42,0.12)",
          backdropFilter: state === "idle" ? undefined : "blur(2px)",
        }}
      >
        {label ? (
          <span className="type-label-sm whitespace-nowrap text-[9px] text-bone">{label}</span>
        ) : null}
      </div>
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1 w-1 rounded-full bg-ember transition-opacity duration-200"
        style={{ opacity: visible && state === "idle" ? 1 : 0 }}
      />
    </div>
  );
}
