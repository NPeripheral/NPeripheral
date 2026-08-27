import type { SceneHandle } from "./renderer";

/**
 * A module-level pointer to the single live scene.
 *
 * SceneSlot needs to tell the renderer where to draw, and the two are not in a
 * parent/child relationship — the canvas is mounted in the layout, the slots
 * are anywhere on the page. A context would work; this is smaller and the
 * cardinality is genuinely one.
 */
let handle: SceneHandle | null = null;

export function setSceneHandle(h: SceneHandle | null) {
  handle = h;
}

export function getSceneHandle(): SceneHandle | null {
  return handle;
}
