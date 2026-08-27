import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  PlaneGeometry,
  Shape,
  ShapeGeometry,
} from "three";
import { createCaustics } from "./caustics";
import { createSeabed } from "./seabed";

/**
 * The underwater scene: sunlight shafts from the surface, and fish.
 *
 * Deliberately built from the same primitives as the aperture — flat shapes,
 * unlit basic materials, colours read from tokens. Lighting would produce
 * intermediate values the palette does not contain, and the whole point of an
 * unlit scene is that the palette cannot drift.
 */

const SHAFTS = 9;
const FISH = 18;

/** A fish is a vesica with a tail — the same lens shape as an aperture blade. */
function fishShape(): Shape {
  const s = new Shape();
  s.moveTo(-0.5, 0);
  s.quadraticCurveTo(-0.1, 0.22, 0.34, 0);
  s.quadraticCurveTo(-0.1, -0.22, -0.5, 0);
  return s;
}
function tailShape(): Shape {
  const s = new Shape();
  s.moveTo(0.3, 0);
  s.lineTo(0.56, 0.17);
  s.lineTo(0.5, 0);
  s.lineTo(0.56, -0.17);
  s.lineTo(0.3, 0);
  return s;
}

interface Fish {
  x: number; y: number; z: number;
  speed: number; dir: 1 | -1;
  size: number; phase: number; bob: number;
}

export interface Ocean {
  group: Group;
  update: (dt: number, t: number) => void;
  dispose: () => void;
}

export function createOcean(
  light: Color,
  body: Color,
  accent: Color,
  deep: Color,
  sand: Color,
  sandShadow: Color,
): Ocean {
  const group = new Group();
  const disposables: Array<{ dispose: () => void }> = [];

  // Floor first, then the caustic net over it, then shafts, then the school --
  // painted back to front so the water reads as having depth.
  const seabed = createSeabed(sand, sandShadow, light);
  const caustics = createCaustics(light, deep);
  group.add(seabed.mesh, caustics.mesh);

  // --- sunlight shafts -----------------------------------------------------
  // Long thin planes, additive, leaning off vertical. Additive blending is what
  // makes crossing shafts brighten where they overlap, the way real godrays do.
  const shafts: Mesh[] = [];
  const shaftGeo = new PlaneGeometry(1, 1);
  disposables.push(shaftGeo);
  for (let i = 0; i < SHAFTS; i++) {
    const mat = new MeshBasicMaterial({
      color: light,
      transparent: true,
      opacity: 0.05 + Math.random() * 0.05,
      blending: AdditiveBlending,
      depthWrite: false,
      side: DoubleSide,
    });
    disposables.push(mat);
    const m = new Mesh(shaftGeo, mat);
    m.position.set(-4.5 + (i / (SHAFTS - 1)) * 9, 0.6, -2 - Math.random());
    m.scale.set(0.18 + Math.random() * 0.5, 9, 1);
    m.rotation.z = 0.12 + Math.random() * 0.16;
    group.add(m);
    shafts.push(m);
  }

  // --- fish ----------------------------------------------------------------
  const bodyGeo: BufferGeometry = new ShapeGeometry(fishShape(), 10);
  const tailGeo: BufferGeometry = new ShapeGeometry(tailShape(), 4);
  const fishMat = new MeshBasicMaterial({ transparent: true, opacity: 0.9 });
  disposables.push(bodyGeo, tailGeo, fishMat);

  const bodies = new InstancedMesh(bodyGeo, fishMat, FISH);
  const tails = new InstancedMesh(tailGeo, fishMat, FISH);
  const dummy = new Object3D();

  const school: Fish[] = [];
  for (let i = 0; i < FISH; i++) {
    const dir: 1 | -1 = Math.random() < 0.5 ? 1 : -1;
    school.push({
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 4.4,
      z: -1.2 + Math.random() * 1.6,
      speed: 0.35 + Math.random() * 0.6,
      dir,
      size: 0.22 + Math.random() * 0.34,
      phase: Math.random() * Math.PI * 2,
      bob: 0.1 + Math.random() * 0.22,
    });
    // One fish in the school carries the accent. The rest are the water's own
    // colour, so the school reads as depth rather than as confetti.
    const c = i === FISH - 1 ? accent : body;
    bodies.setColorAt(i, c);
    tails.setColorAt(i, c);
  }
  if (bodies.instanceColor) bodies.instanceColor.needsUpdate = true;
  if (tails.instanceColor) tails.instanceColor.needsUpdate = true;
  group.add(bodies, tails);

  function update(dt: number, t: number) {
    seabed.update(t);
    caustics.update(t);
    for (let i = 0; i < FISH; i++) {
      const f = school[i];
      f.x += f.speed * f.dir * dt;
      // vertical bob only — the horizontal run stays linear so the school
      // reads as swimming rather than as a sine-wave particle field
      const y = f.y + Math.sin(t * 0.8 + f.phase) * f.bob;
      if (f.x > 5.6) f.x = -5.6;
      if (f.x < -5.6) f.x = 5.6;

      const tilt = Math.cos(t * 0.8 + f.phase) * 0.18;
      dummy.position.set(f.x, y, f.z);
      dummy.rotation.set(0, f.dir === 1 ? 0 : Math.PI, f.dir * tilt);
      dummy.scale.setScalar(f.size);
      dummy.updateMatrix();
      bodies.setMatrixAt(i, dummy.matrix);

      // the tail beats faster than the body bobs
      dummy.rotation.z += Math.sin(t * 6 + f.phase) * 0.35 * f.dir;
      dummy.updateMatrix();
      tails.setMatrixAt(i, dummy.matrix);
    }
    bodies.instanceMatrix.needsUpdate = true;
    tails.instanceMatrix.needsUpdate = true;

    // shafts sway slowly, as if the surface above them is moving
    for (let i = 0; i < shafts.length; i++) {
      shafts[i].rotation.z = 0.14 + Math.sin(t * 0.22 + i) * 0.06;
    }
  }

  update(0, 0);

  return {
    group,
    update,
    dispose() {
      bodies.dispose();
      tails.dispose();
      seabed.dispose();
      caustics.dispose();
      disposables.forEach((d) => d.dispose());
    },
  };
}
