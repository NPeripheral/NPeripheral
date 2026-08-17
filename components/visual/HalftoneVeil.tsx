"use client";

import { useEffect, useRef } from "react";

type HalftoneVeilProps = {
  /** Ground colour the veil is painted in — matches the panel behind it. */
  color: string;
  /** Grid pitch in CSS px. Smaller reads finer and costs more. */
  cell?: number;
  /** How much of each cell a dot fills at rest. 0.5–0.62 veils without hiding. */
  rest?: number;
  /** Radius of the resolved area around the pointer, in CSS px. */
  reach?: number;
};

/**
 * The veil.
 *
 * A grid of ground-coloured dots painted *over* the figure, so the drawing
 * underneath reads as present but unresolved — visible, not seen. Dots shrink
 * toward zero as the pointer approaches, and the figure resolves under it.
 * That is the brand line performed rather than stated.
 *
 * Costs nothing when nobody is pointing at it: the loop only runs while the
 * pointer is inside or the reveal is easing back out, and the panel falls back
 * to a single static paint on touch, coarse pointers and reduced motion.
 */
export function HalftoneVeil({ color, cell = 6, rest = 0.56, reach = 130 }: HalftoneVeilProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const interactive = fine.matches && !reducedQuery.matches;

    let width = 0;
    let height = 0;
    let frame = 0;
    let running = false;

    // Pointer position and the eased reveal radius, both in CSS px.
    const pointer = { x: -9999, y: -9999 };
    const eased = { x: -9999, y: -9999, r: 0 };
    let targetR = 0;

    function paint() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = color;

      const maxR = (cell / 2) * (rest / 0.5);

      for (let y = cell / 2; y < height + cell; y += cell) {
        for (let x = cell / 2; x < width + cell; x += cell) {
          let r = maxR;

          if (eased.r > 0.5) {
            const dx = x - eased.x;
            const dy = y - eased.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < eased.r) {
              // Smoothstep from fully open at the centre to full veil at the rim.
              const t = dist / eased.r;
              const s = t * t * (3 - 2 * t);
              r = maxR * s;
            }
          }

          if (r <= 0.08) continue;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    function tick() {
      eased.x += (pointer.x - eased.x) * 0.22;
      eased.y += (pointer.y - eased.y) * 0.22;
      eased.r += (targetR - eased.r) * 0.12;

      paint();

      // Keep going until the reveal has fully closed, then idle.
      if (targetR > 0 || eased.r > 0.6) {
        frame = requestAnimationFrame(tick);
      } else {
        running = false;
        eased.r = 0;
        paint();
      }
    }

    function start() {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(tick);
    }

    function resize() {
      const rect = parent!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint();
    }

    function onMove(event: PointerEvent) {
      if (event.pointerType !== "mouse") return;
      const rect = parent!.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      if (targetR === 0) {
        // Enter without a sweep: place the eased point before opening up.
        eased.x = pointer.x;
        eased.y = pointer.y;
      }
      targetR = reach;
      start();
    }

    function onLeave() {
      targetR = 0;
      start();
    }

    const observer = new ResizeObserver(resize);
    observer.observe(parent);
    resize();

    if (interactive) {
      parent.addEventListener("pointermove", onMove);
      parent.addEventListener("pointerleave", onLeave);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      if (interactive) {
        parent.removeEventListener("pointermove", onMove);
        parent.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [color, cell, rest, reach]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[3] h-full w-full"
    />
  );
}
