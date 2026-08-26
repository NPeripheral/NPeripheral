"use client";

import { useEffect, useRef, useState } from "react";
import { Aperture, type ApertureTone } from "@/components/visual/Aperture";
import { getSceneHandle } from "@/lib/scene/handle";
import type { SceneHandle } from "@/lib/scene/renderer";
import { cn } from "@/lib/utils";

type SceneSlotProps = {
  tone?: ApertureTone;
  label?: string;
  index?: string;
  className?: string;
};

/**
 * A reserved figure rect that the shared 3D aperture draws into.
 *
 * The fallback is not a separate code path — it is the default. When WebGL is
 * unavailable the slot renders the SVG <Aperture/> that already exists, in the
 * identical box, so deleting lib/scene/ leaves a working site.
 */
export function SceneSlot({ tone = "ink", label, index, className }: SceneSlotProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // The canvas is mounted in the layout and this slot is deep in the page, so
    // there is no ordering guarantee between the two effects. Poll a few frames
    // for the handle rather than losing the race and silently rendering nothing;
    // if it never appears, WebGL genuinely is not available and the SVG
    // fallback below is correct.
    let scene: SceneHandle | null = null;
    let raf = 0;
    let tries = 0;

    const push = () => scene?.setSlot(el);

    const attach = () => {
      scene = getSceneHandle();
      if (!scene) {
        if (tries++ < 60) {
          raf = requestAnimationFrame(attach);
        }
        return;
      }
      setLive(true);
      push();
    };
    attach();

    return () => {
      cancelAnimationFrame(raf);
      scene?.setSlot(null);
    };
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {!live ? (
        <Aperture
          figure="lens"
          tone={tone}
          anchor="center"
          dot={4}
          interactive
          label={label}
          index={index}
          className="h-full w-full"
        />
      ) : (
        <>
          <span className="type-label-sm absolute bottom-3 left-4 text-quieter">{label}</span>
          <span className="type-label-sm absolute bottom-3 right-4 text-quieter">{index}</span>
        </>
      )}
    </div>
  );
}
