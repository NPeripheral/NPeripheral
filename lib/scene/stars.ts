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

  /**
   * Four-point sparkle. Concave sides, long points on the axes.
   *
   * Along an axis the minor coordinate is 0 so the falloff is just the major
   * one and the point reaches full size; on the diagonal both are equal and the
   * weighted sum grows four times as fast, so the shape pinches in hard. That
   * asymmetry is the whole star -- no polygon, no vertices.
   */
  float sparkle(vec2 d, float size) {
    vec2 a = abs(d);
    float major = max(a.x, a.y);
    float minor = min(a.x, a.y);
    return smoothstep(size, 0.0, major + minor * 3.2);
  }

  void main() {
    vec2 uv = vec2(vUv.x * uAspect, vUv.y) * 6.0;
    vec2 cell = floor(uv);
    vec2 f = fract(uv);

    vec3 col = vec3(0.0);
    float alpha = 0.0;

    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 off = vec2(float(x), float(y));
        vec2 h = hash2(cell + off);
        // Sparse on purpose: roughly a quarter of cells ever hold a star.
        if (h.x > 0.26) continue;

        // Each cell runs its own slow cycle. floor() is the generation counter
        // and fract() is the life of THIS appearance -- so when a star finishes
        // fading it comes back in a different place, because the position hash
        // is seeded with the generation.
        float period = 3.4 + h.y * 4.2;
        float t = uTime / period + h.x * 23.0;
        float gen = floor(t);
        float life = fract(t);

        vec2 hp = hash2(cell + off + gen * 37.13);
        vec2 pos = off + hp * 0.78 + 0.11;

        // Envelope over one life: in, hold, out. Raised to a power so it spends
        // most of the cycle faint and only briefly bright -- a sky that is
        // always fully lit reads as a texture.
        float env = pow(sin(life * 3.14159265), 1.6);

        // The twinkle itself, on its own period so it never syncs with the life
        // cycle or with a neighbour.
        float tw = 0.55 + 0.45 * sin(uTime * (2.2 + hp.x * 3.4) + hp.y * 6.2831);

        float bright = env * tw;
        if (bright <= 0.001) continue;

        // Size is biased, not evenly spread. A linear mix gives a field where
        // every star is mid-sized, which reads as one repeated object; cubing
        // the hash pushes most values to the floor so the sky is mostly small
        // points with the occasional large one. That ratio is what makes a
        // starfield read as depth rather than as a pattern.
        float grade = hp.y * hp.y * hp.y;
        float size = mix(0.013, 0.088, grade);

        float core = sparkle(f - pos, size) * bright;
        float halo = smoothstep(size * 2.6, 0.0, length(f - pos)) * bright * 0.18;

        // The big ones burn a little harder, so scale reads as proximity
        // instead of just as a bigger sprite.
        float v = (core + halo) * (0.85 + grade * 0.5);
        vec3 tint = hp.x > 0.93 ? uAccent : uStar;
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
