"use client";

import dynamic from "next/dynamic";

/**
 * The curtain must not be server-rendered: whether it should appear at all
 * depends on sessionStorage, which only exists in the browser. Rendering it
 * client-side keeps that decision out of an effect and avoids a hydration
 * mismatch on repeat visits.
 */
const Preloader = dynamic(
  () => import("@/components/motion/Preloader").then((m) => m.Preloader),
  { ssr: false },
);

export function PreloaderMount() {
  return <Preloader />;
}
