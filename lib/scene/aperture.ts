import {
  BufferGeometry,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  Shape,
  ShapeGeometry,
  type Color,
} from "three";
import type { ChapterState } from "./chapters";

/**
 * Seven blades. Not six.
 *
 * Even counts put parallel edges opposite each other, so a half-open iris
 * reads as a static polygon — six blades is a hexagon, and at the size these
 * render (a 62vh hero figure, 4:3 work cards) the eye names the shape. Odd
 * counts have no parallel edges: every blade faces a vertex across the centre,
 * so the silhouette is unavoidably asymmetric and reads as rotational — a
 * mechanism caught mid-motion. Five still reads as "a pentagon"; seven is past
 * the count the eye resolves at small size, so it resolves as a circle being
 * closed by blades. It is also a real cine-lens count.
 *
 * Blade count is identity, not a performance knob. Reduce SEGMENTS on weak
 * hardware; never reduce BLADES.
 */
export const BLADES = 7;

/** Real irises never close to a point. This is where the slit stops. */
const INNER_RADIUS = 0.08;

/** Radius of the barrel each blade pivots on. */
const PIVOT = 1.02;

/**
 * A real iris blade does not radiate from the centre — it pivots on a point out
 * on the barrel and sweeps its curved inner edge ACROSS the opening. That is
 * what makes the aperture read as machined rather than as an asterisk: adjacent
 * blades overlap, and the opening is the polygon their inner edges leave behind.
 *
 * The blade is built around the origin as its pivot, extending inward (-x) and
 * spanning generously in y so neighbours overlap at every rotation.
 */
function bladeShape(): Shape {
  const s = new Shape();
  s.moveTo(0, -0.62);
  s.lineTo(0, 0.62);
  // the curved inner edge that forms the opening
  s.quadraticCurveTo(-0.95, 0.46, -1.16, -0.12);
  s.lineTo(-0.86, -0.66);
  s.quadraticCurveTo(-0.4, -0.72, 0, -0.62);
  return s;
}

export interface Aperture {
  group: Group;
  apply: (s: ChapterState, t: number) => void;
  dispose: () => void;
}

export function createAperture(color: Color): Aperture {
  const group = new Group();
  const geometry: BufferGeometry = new ShapeGeometry(bladeShape(), 12);
  // Drawn, not rendered. The page frames this box as "FIELD OF VIEW / Fig. 01",
  // so the iris reads as a technical figure: a faint fill that lets overlapping
  // blades stack into tone, and a bright edge that makes each blade legible.
  // A solid mass would be the loudest object on a page whose thesis is restraint.
  const material = new MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.1,
    depthWrite: false,
  });
  const edgeMaterial = new LineBasicMaterial({
    color,
    transparent: true,
    opacity: 0.85,
  });
  const edges = new EdgesGeometry(geometry);

  const blades: Mesh[] = [];
  for (let i = 0; i < BLADES; i++) {
    const m = new Mesh(geometry, material);
    m.add(new LineSegments(edges, edgeMaterial));
    m.rotation.z = (i / BLADES) * Math.PI * 2;
    group.add(m);
    blades.push(m);
  }

  function apply(s: ChapterState, t: number) {
    group.rotation.z = t * s.spin;
    for (let i = 0; i < BLADES; i++) {
      const base = (i / BLADES) * Math.PI * 2;
      const b = blades[i];
      // Each blade sits on the barrel at radius PIVOT and swings about that
      // point. Closing rotates every blade the same way, so their inner edges
      // sweep together and the opening shrinks to a 7-pointed slit rather than
      // Clamp so the closed state leaves a 7-pointed slit, never a point --
      // real irises do not close to a point, and the Contact chapter needs
      // somewhere to stop.
      const swing = (1 - Math.max(s.openness, INNER_RADIUS)) * 0.92;
      const r = PIVOT + s.separation;
      b.position.x = Math.cos(base) * r;
      b.position.y = Math.sin(base) * r;
      b.rotation.z = base + swing;
    }
  }

  return {
    group,
    apply,
    dispose() {
      geometry.dispose();
      edges.dispose();
      material.dispose();
      edgeMaterial.dispose();
    },
  };
}
