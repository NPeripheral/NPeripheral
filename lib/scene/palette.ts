import { Color } from "three";

/**
 * The scene reads its colours from the CSS custom properties rather than
 * carrying its own. The spec requires that the palette cannot drift: if
 * globals.css changes, the 3D changes with it, and there is no second place
 * a colour can be defined.
 */
const FALLBACK: Record<string, string> = {
  "--color-ember": "#e2542a",
  "--color-ink": "#0b0a09",
  "--color-ink-4": "#262120",
  "--color-cream-3": "#dcd2c1",
  "--color-bone": "#f4efe6",
};

export function cssColor(token: string): Color {
  let value = FALLBACK[token] ?? "#ffffff";
  if (typeof window !== "undefined") {
    const read = getComputedStyle(document.documentElement)
      .getPropertyValue(token)
      .trim();
    if (read) value = read;
  }
  try {
    return new Color(value);
  } catch {
    return new Color(FALLBACK[token] ?? "#ffffff");
  }
}

export function palette() {
  return {
    ember: cssColor("--color-ember"),
    ink: cssColor("--color-ink"),
    ink4: cssColor("--color-ink-4"),
    cream3: cssColor("--color-cream-3"),
    bone: cssColor("--color-bone"),
  };
}
