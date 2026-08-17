import type Lenis from "lenis";

/**
 * Registry for the single Lenis instance.
 *
 * Anything that scrolls the page programmatically has to go through Lenis
 * rather than calling scrollIntoView: Lenis drives window.scrollTo every
 * frame toward its own target, so a native smooth scroll starts a fight it
 * always loses — the page ends up somewhere neither party intended.
 */
let instance: Lenis | null = null;

export function registerLenis(next: Lenis | null) {
  instance = next;
}

type ScrollOptions = {
  /** Where the element should end up in the viewport. Defaults to centre. */
  block?: "center" | "start";
  /** Extra offset in px, applied after block positioning. */
  offset?: number;
  duration?: number;
};

/**
 * Scroll an element into view through Lenis when it is running, and fall back
 * to the native behaviour when it is not (reduced motion, or before mount).
 */
export function scrollToElement(el: Element, options: ScrollOptions = {}) {
  const { block = "center", offset = 0, duration } = options;

  if (!instance) {
    el.scrollIntoView({ block, behavior: "smooth" });
    return;
  }

  const centring =
    block === "center"
      ? -Math.max(0, (window.innerHeight - el.getBoundingClientRect().height) / 2)
      : -90; // clear the fixed navigation

  instance.scrollTo(el as HTMLElement, {
    offset: centring + offset,
    duration: duration ?? 0.9,
  });
}

/** True when Lenis is driving the page. */
export function isSmoothScrollActive() {
  return instance !== null;
}
