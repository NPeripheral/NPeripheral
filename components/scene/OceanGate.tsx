"use client";

import { useEffect, useRef } from "react";
import { getSceneHandle } from "@/lib/scene/handle";

/**
 * Marks the region the underwater scene is allowed to occupy.
 *
 * The scene canvas is fixed and spans the viewport, so route-gating alone left
 * the school swimming over every section below the hero. This element is
 * stretched across its parent section and its intersection drives the ocean on
 * and off: fish in the hero, and the ink/ember register everywhere else.
 */
export function OceanGate() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // The canvas mounts in the layout and this sits deep in the page, so poll
    // a few frames for the handle rather than losing the ordering race.
    let raf = 0;
    let tries = 0;
    const attach = () => {
      const scene = getSceneHandle();
      if (!scene) {
        if (tries++ < 60) raf = requestAnimationFrame(attach);
        return;
      }
      scene.setOceanGate(el);
    };
    attach();

    return () => {
      cancelAnimationFrame(raf);
      getSceneHandle()?.setOceanGate(null);
    };
  }, []);

  return <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0" />;
}
