import {
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  Shape,
  ShapeGeometry,
  type Color,
} from "three";

/**
 * Leaves, not a particle system.
 *
 * A maple silhouette is the slop, and it is slop because it belongs to every
 * site. These are a vesica — the lens formed by two overlapping circles —
 * which is the aperture blade with one end untruncated. Same geometry family
 * as the iris, so a gust reads as the aperture shedding blades rather than as
 * weather.
 *
 * Three discrete sizes, never a continuous range: continuous random sizing is
 * the procedural-noise tell; three sizes read as a decision.
 */
const COUNT = 40;
const SIZES = [0.12, 0.2, 0.34];
const DISTRIBUTION = [24, 12, 4]; // 40 total

/** Every leaf's long axis stays within +/-12 degrees of the 6.5 degree cut axis. */
const AXIS = (6.5 * Math.PI) / 180;
const AXIS_JITTER = (12 * Math.PI) / 180;

function vesica(): Shape {
  const s = new Shape();
  s.moveTo(0, -0.5);
  s.quadraticCurveTo(0.17, 0, 0, 0.5);
  s.quadraticCurveTo(-0.17, 0, 0, -0.5);
  return s;
}

interface Leaf {
  x: number; y: number; z: number;
  size: number;
  roll: number; rollRate: number;
  vx: number; vy: number;
  gust: number;
}

export interface Leaves {
  mesh: InstancedMesh;
  update: (dt: number) => void;
  burst: () => void;
  dispose: () => void;
}

export function createLeaves(base: Color, accent: Color): Leaves {
  const geometry = new ShapeGeometry(vesica(), 8);
  const material = new MeshBasicMaterial({ transparent: true, opacity: 0.85 });
  const mesh = new InstancedMesh(geometry, material, COUNT);
  const dummy = new Object3D();

  const leaves: Leaf[] = [];
  let i = 0;
  DISTRIBUTION.forEach((n, tier) => {
    for (let k = 0; k < n; k++, i++) {
      // Constrain placement to the outer thirds so leaves never sit behind
      // display type — protects the contrast the spec calls non-negotiable.
      const outer = Math.random() < 0.5 ? -1 : 1;
      leaves.push({
        x: outer * (1.6 + Math.random() * 1.6),
        y: (Math.random() - 0.5) * 4,
        z: -0.6 - Math.random() * 0.8,
        size: SIZES[tier],
        roll: Math.random() * Math.PI * 2,
        // One revolution every 45-105s. The leaf periodically presents edge-on
        // and vanishes to a line; that blink is what reads as thin and physical.
        rollRate: 0.06 + Math.random() * 0.08,
        // Linear drift along the cut axis. No sinusoidal sway — a sine wave is
        // the single most recognisable particle-system signature there is.
        vx: Math.cos(AXIS) * (0.04 + Math.random() * 0.05),
        vy: -Math.sin(AXIS) * (0.04 + Math.random() * 0.05),
        gust: 0,
      });
    }
  });

  // Exactly one ember leaf, the largest. One in forty is emphasis; forty is
  // decoration.
  leaves.forEach((_, idx) => mesh.setColorAt(idx, idx === COUNT - 1 ? accent : base));
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

  function update(dt: number) {
    for (let idx = 0; idx < leaves.length; idx++) {
      const l = leaves[idx];
      const boost = 1 + l.gust * 13;
      l.x += l.vx * dt * boost;
      l.y += l.vy * dt * boost;
      l.roll += l.rollRate * dt * (1 + l.gust * 7);
      l.gust *= Math.exp(-dt / 0.55); // tau = 0.55s, settled in ~1.6s
      if (l.gust < 1e-4) l.gust = 0;

      // Wrap rather than fade at the edges — an alpha fade is the screensaver tell.
      if (l.x > 3.6) l.x = -3.6;
      if (l.x < -3.6) l.x = 3.6;
      if (l.y < -2.6) l.y = 2.6;
      if (l.y > 2.6) l.y = -2.6;

      dummy.position.set(l.x, l.y, l.z);
      // Yaw and pitch locked; roll about the long axis only.
      dummy.rotation.set(0, l.roll, AXIS + (idx % 5 - 2) / 2 * AXIS_JITTER);
      dummy.scale.setScalar(l.size);
      dummy.updateMatrix();
      mesh.setMatrixAt(idx, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  function burst() {
    for (const l of leaves) l.gust = 1;
  }

  update(0);

  return {
    mesh,
    update,
    burst,
    dispose() {
      geometry.dispose();
      material.dispose();
      mesh.dispose();
    },
  };
}
