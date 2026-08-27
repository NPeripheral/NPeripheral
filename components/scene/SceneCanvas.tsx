"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { chapterForPath } from "@/lib/scene/chapters";
import { startScene, type SceneHandle } from "@/lib/scene/renderer";
import { setSceneHandle } from "@/lib/scene/handle";

/**
 * One WebGL context for the whole app, mounted once in the layout.
 *
 * A context per route causes context loss, leaked buffers and a white flash on
 * every navigation. A single persistent canvas is also what lets a chapter
 * change be a morph rather than a reload.
 *
 * The canvas is transparent and sits ABOVE the opaque section grounds but
 * BELOW text: the grounds stay flat (the thesis holds) and text contrast is
 * untouched. Only the leaves draw outside a slot; the aperture is positioned
 * into the figure rects the page already reserves.
 */
export function SceneCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const handle = useRef<SceneHandle | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const h = startScene(canvas);
    handle.current = h;
    setSceneHandle(h);
    return () => {
      h?.destroy();
      handle.current = null;
      setSceneHandle(null);
    };
  }, []);

  useEffect(() => {
    handle.current?.setChapter(chapterForPath(pathname ?? "/"));
  }, [pathname]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] h-full w-full"
    />
  );
}
