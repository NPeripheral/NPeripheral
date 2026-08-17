import { ViewTransition } from "react";

/**
 * Route transitions.
 *
 * A template sits between the layout and the page and is given a fresh key on
 * every navigation, so it mounts and unmounts where a layout would persist —
 * which is exactly what <ViewTransition> needs in order to fire enter and exit
 * animations. One file covers every route.
 *
 * The chrome (navigation, footer, cursor, grain) lives in the layout, outside
 * this boundary, so it stays anchored while the content changes underneath it.
 *
 * Animation is asymmetric on purpose: the old page leaves quickly so it stops
 * competing for attention, and the new one arrives more slowly so there is
 * time to register it. Styles live in globals.css under `.np-page`.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition default="np-page">
      <div>{children}</div>
    </ViewTransition>
  );
}
