"use client";

import { useEffect, useRef, useState } from "react";
import { Aperture, type ApertureTone } from "@/components/visual/Aperture";
import { getSceneHandle } from "@/lib/scene/handle";
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
    const scene = getSceneHandle();
    if (!el || !scene) return;
    setLive(true);

    const push = () => scene.setSlot(el.getBoundingClientRect());
    push();

    const ro = new ResizeObserver(push);
    ro.observe(el);
    window.addEventListener("scroll", push, { passive: true });
    window.addEventListener("resize", push);

    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", push);
      window.removeEventListener("resize", push);
      scene.setSlot(null);
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
