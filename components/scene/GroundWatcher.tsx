"use client";

import { useEffect } from "react";
import { getSceneHandle } from "@/lib/scene/handle";

/**
 * Tells the scene which ground is currently behind it.
 *
 * The leaves float above opaque section grounds, so their colour has to follow
 * whatever is underneath or they read as debris on light chapters and vanish on
 * dark ones. This watches which `ground-*` section occupies the middle of the
 * viewport and reports it — cheap, and it needs no cooperation from the
 * sections themselves.
 */
export function GroundWatcher() {
  useEffect(() => {
    let raf = 0;
    let tries = 0;
    let current = "";

    const read = () => {
      const scene = getSceneHandle();
      if (!scene) {
        if (tries++ < 60) raf = requestAnimationFrame(read);
        return;
      }
      const mid = document.elementFromPoint(
        Math.round(window.innerWidth / 2),
        Math.round(window.innerHeight / 2),
      );
      const section = mid?.closest<HTMLElement>(
        ".ground-ink, .ground-ink-2, .ground-cream, .ground-ember, .ground-sea",
      );
      const name = section
        ? (section.className.match(/ground-[a-z0-9-]+/)?.[0] ?? "ground-ink")
        : "ground-ink";
      if (name !== current) {
        current = name;
        scene.setGround(name);
      }
    };

    read();
    const onScroll = () => read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    // Lenis drives scroll without always firing window scroll, so poll gently
    // as a backstop. Once a second is plenty for a colour that only changes at
    // chapter boundaries.
    const timer = window.setInterval(read, 1000);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearInterval(timer);
    };
  }, []);

  return null;
}
