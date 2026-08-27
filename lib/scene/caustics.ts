import { Mesh, PlaneGeometry, ShaderMaterial, Color, AdditiveBlending } from "three";

/**
 * Procedural caustics — the moving net of light the surface throws on
 * everything below it.
 *
 * Written as a shader rather than a looping video texture: no asset to load, it
 * resolves at any size, and the colour comes from the same tokens as the rest
 * of the scene so the palette still cannot drift.
 *
 * The pattern is domain-warped stacked sine fields. Real caustics are the
 * envelope of refracted rays, and the giveaway of a fake one is uniform cell
 * size — so two octaves run at different scales and speeds, and the result is
 * raised to a power to pull thin bright filaments out of a soft field rather
 * than leaving an even ripple.
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
  uniform vec3  uLight;
  uniform vec3  uDeep;
  uniform float uIntensity;

  // one octave of a warped sine field
  float band(vec2 p, float t) {
    p += 0.30 * vec2(sin(p.y * 2.7 + t * 0.55), cos(p.x * 2.3 - t * 0.48));
    float a = sin(p.x * 3.1 + t * 0.70);
    float b = sin(p.y * 2.7 - t * 0.62);
    float c = sin((p.x + p.y) * 2.1 + t * 0.40);
    return (a + b + c) / 3.0;
  }

  void main() {
    vec2 p = vUv * vec2(7.0, 4.0);
    float n = band(p, uTime) * 0.62 + band(p * 2.15 + 4.0, uTime * 1.35) * 0.38;

    // pull filaments out of the field: soft everywhere, bright along the ridges
    float c = pow(max(n * 0.5 + 0.5, 0.0), 5.0);

    // light falls off with depth, so the net is strongest near the surface
    float depth = smoothstep(0.0, 0.85, vUv.y);
    c *= depth;

    vec3 col = mix(uDeep, uLight, clamp(c * 1.6, 0.0, 1.0));
    gl_FragColor = vec4(col, clamp(c * uIntensity, 0.0, 1.0));
  }
`;

export interface Caustics {
  mesh: Mesh;
  update: (t: number) => void;
  dispose: () => void;
}

export function createCaustics(light: Color, deep: Color): Caustics {
  const geometry = new PlaneGeometry(2, 2);
  const material = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uLight: { value: light },
      uDeep: { value: deep },
      uIntensity: { value: 0.55 },
    },
  });
  const mesh = new Mesh(geometry, material);
  mesh.position.z = -2.6;
  mesh.scale.set(6, 4, 1);

  return {
    mesh,
    update(t) {
      material.uniforms.uTime.value = t;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
