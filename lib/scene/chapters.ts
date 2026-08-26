/**
 * The whole design of the 3D layer lives in this table.
 *
 * A chapter is a parameter set, and a transition lerps between two of them, so
 * the same aperture re-forms rather than being swapped. Adding a chapter is
 * adding a row here — if it ever requires touching aperture.ts or a page
 * component, the boundary is wrong.
 */
export type ChapterName = "home" | "services" | "work" | "contact" | "quiet";

export interface ChapterState {
  /** 0 = closed to a slit, 1 = fully open. */
  openness: number;
  /** Blade separation along their own radius. */
  separation: number;
  /** Camera distance. */
  distance: number;
  /** Continuous rotation of the whole iris, rad/s. */
  spin: number;
}

export const CHAPTERS: Record<ChapterName, ChapterState> = {
  // Slow breathing iris, half open. The resting state.
  home: { openness: 0.55, separation: 0.0, distance: 3.2, spin: 0.05 },
  // Blades fan out and separate — the mechanism explained.
  services: { openness: 0.75, separation: 0.35, distance: 3.6, spin: 0.09 },
  // Blades stack into a lens barrel; the camera pushes through.
  work: { openness: 0.4, separation: 0.12, distance: 2.3, spin: 0.03 },
  // Iris closes to a slit. Never to a point — real irises do not.
  contact: { openness: 0.08, separation: 0.0, distance: 3.0, spin: 0.02 },
  // Legal, help, about: near-still. Nothing should move under a privacy policy.
  quiet: { openness: 0.45, separation: 0.0, distance: 3.4, spin: 0.0 },
};

export function chapterForPath(pathname: string): ChapterName {
  if (pathname === "/") return "home";
  if (pathname.startsWith("/industries")) return "services";
  if (pathname.startsWith("/work") || pathname.startsWith("/blog")) return "work";
  if (
    pathname.startsWith("/contact") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/thank-you")
  )
    return "contact";
  return "quiet";
}
