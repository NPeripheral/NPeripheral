import { AdditiveBlending, Color, Mesh, PlaneGeometry, ShaderMaterial } from "three";

/**
 * A field of stars that twinkle where they stand.
 *
 * This replaces the drifting leaves, and the reason is cost as much as taste.
 * The leaves were an InstancedMesh of 40 objects whose matrices were rebuilt on
 * the CPU every single frame — 40 position/rotation/scale writes plus a full
 * instanceMatrix upload, forever, on every route.
 *
 * Stars that do not travel need none of that. The entire field is one quad and
 * one fragment shader: position comes from a hash of the cell, brightness from
 * a sine of time, and nothing is uploaded after construction. The only per-frame
 * work is writing one float uniform.
 */
const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform vec3  uStar;
  uniform vec3  uAccent;
  uniform float uOpacity;

  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }

  void main() {
    // Grid of cells; each holds one star at a hashed offset, so the field looks
    // scattered rather than gridded but stays perfectly stable frame to frame.
    vec2 uv = vec2(vUv.x * uAspect, vUv.y) * 7.0;
    vec2 cell = floor(uv);
    vec2 f = fract(uv);

    vec3 col = vec3(0.0);
    float alpha = 0.0;

    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 off = vec2(float(x), float(y));
        vec2 h = hash2(cell + off);
        // Only about a third of cells hold a star, so density reads as sky
        // rather than as a texture.
        if (h.x > 0.55) continue;

        vec2 pos = off + vec2(h.x, h.y) * 0.82 + 0.09;
        float d = length(f - pos);

        // Twinkle: each star keeps its own period and phase, so the field never
        // pulses in unison — that synchrony is the giveaway of a fake sky.
        float phase = h.y * 6.2831;
        float rate = 0.6 + h.x * 2.4;
        float tw = 0.45 + 0.55 * sin(uTime * rate + phase);

        // In cell units. At 7 cells across a 1280px viewport a cell is ~180px,
        // so this is roughly a 5-13px star -- the previous 0.008-0.030 worked
        // out at 1-3px, which reads as sensor noise, not as a sky.
        float size = mix(0.028, 0.075, h.y);
        float core = smoothstep(size, 0.0, d) * tw;
        // a soft bloom, and a faint cross-flare on the brightest stars
        float halo = smoothstep(size * 4.0, 0.0, d) * tw * 0.30;
        float flare = h.y > 0.72
          ? max(smoothstep(0.05, 0.0, abs(f.y - pos.y)) * smoothstep(0.09, 0.0, abs(f.x - pos.x)),
                smoothstep(0.05, 0.0, abs(f.x - pos.x)) * smoothstep(0.09, 0.0, abs(f.y - pos.y))) * tw * 0.30
          : 0.0;

        float v = core + halo + flare;
        // One star in roughly twenty carries the accent.
        vec3 tint = h.y > 0.95 ? uAccent : uStar;
        col += tint * v;
        alpha += v;
      }
    }

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0) * uOpacity);
  }
`;

export interface Stars {
  mesh: Mesh;
  update: (t: number) => void;
  setTone: (star: Color, accent: Color, opacity: number) => void;
  dispose: () => void;
}

export function createStars(star: Color, accent: Color): Stars {
  const geometry = new PlaneGeometry(2, 2);
  const material = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uAspect: { value: 1 },
      uStar: { value: star },
      uAccent: { value: accent },
      uOpacity: { value: 0.9 },
    },
  });
  const mesh = new Mesh(geometry, material);
  mesh.position.z = -2.4;
  mesh.scale.set(6, 3.2, 1);

  return {
    mesh,
    update(t) {
      material.uniforms.uTime.value = t;
      material.uniforms.uAspect.value = Math.max(window.innerWidth / window.innerHeight, 0.4);
    },
    setTone(nextStar, nextAccent, opacity) {
      (material.uniforms.uStar.value as Color).copy(nextStar);
      (material.uniforms.uAccent.value as Color).copy(nextAccent);
      material.uniforms.uOpacity.value = opacity;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
