"use client";

import dynamic from "next/dynamic";

/**
 * Defers the 3D layer out of the initial bundle.
 *
 * three.js is ~600KB, and a static import in the root layout put it in the
 * first load of every route -- including the privacy policy, which has no
 * scene to draw. It is decorative: nothing on the page depends on it, and the
 * SVG fallback already covers the case where it never arrives. So it has no
 * business competing with content for the first paint.
 *
 * ssr:false because the scene needs a canvas and a WebGL context, neither of
 * which exists on the server. next/dynamic with ssr:false cannot be called
 * from a Server Component, which is why this thin client wrapper exists rather
 * than the layout importing it directly.
 */
const SceneCanvas = dynamic(
  () => import("./SceneCanvas").then((m) => m.SceneCanvas),
  { ssr: false },
);

const GroundWatcher = dynamic(
  () => import("./GroundWatcher").then((m) => m.GroundWatcher),
  { ssr: false },
);

export function SceneMount() {
  return (
    <>
      <SceneCanvas />
      <GroundWatcher />
    </>
  );
}
