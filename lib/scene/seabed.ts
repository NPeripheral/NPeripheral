import { Mesh, PlaneGeometry, ShaderMaterial, Color } from "three";

/**
 * The sea floor: rippled sand, with the surface caustics playing over it.
 *
 * Procedural for the same reason as the caustics — no texture to load, and it
 * resolves at any size. Two things sell sand rather than a brown gradient:
 * ripple bands that run roughly perpendicular to the current and vary in
 * wavelength, and fine grain noise on top so the surface is not smooth. The
 * caustic net is sampled again here rather than projected, which is cheaper and
 * reads the same at this angle.
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
  uniform vec3  uSand;
  uniform vec3  uShadow;
  uniform vec3  uLight;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
               mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
  }

  float caustic(vec2 p, float t) {
    p += 0.3 * vec2(sin(p.y * 2.7 + t * 0.5), cos(p.x * 2.3 - t * 0.45));
    float a = sin(p.x * 3.1 + t * 0.65);
    float b = sin(p.y * 2.7 - t * 0.58);
    float c = sin((p.x + p.y) * 2.1 + t * 0.38);
    return pow(max((a + b + c) / 3.0 * 0.5 + 0.5, 0.0), 5.0);
  }

  void main() {
    // The plane's BOTTOM edge is the floor nearest the viewer and its top edge
    // is the far horizon -- so nearness runs opposite to vUv.y. Getting this
    // backwards hazes out the near sand and leaves a gap above the sill.
    float near = 1.0 - vUv.y;

    vec2 p = vec2(vUv.x * 9.0, vUv.y * 3.2);

    // ripple bands -- wavelength varies so they do not read as corduroy, and
    // they coarsen toward the viewer where the floor is closest
    float ripple = sin(p.y * 26.0 + noise(p * 1.4) * 5.0) * 0.5 + 0.5;
    ripple = pow(ripple, 1.8) * (0.10 + 0.18 * near);

    float grain = noise(vUv * 420.0) * 0.055;

    vec3 sand = mix(uShadow, uSand, 0.45 + ripple + grain);

    // the surface net, strongest on the near floor where the light reaches
    float c = caustic(vec2(vUv.x * 7.0, vUv.y * 3.0), uTime) * (0.35 + 0.65 * near);
    sand = mix(sand, uLight, clamp(c * 0.55, 0.0, 1.0));

    // Water between the eye and the FAR floor: haze belongs at the horizon.
    // The near edge stays fully opaque so the sand meets the sill with no gap.
    float haze = smoothstep(0.42, 1.0, vUv.y);
    gl_FragColor = vec4(sand, 1.0 - haze * 0.9);
  }
`;

export interface Seabed {
  mesh: Mesh;
  update: (t: number) => void;
  dispose: () => void;
}

export function createSeabed(sand: Color, shadow: Color, light: Color): Seabed {
  const geometry = new PlaneGeometry(2, 2);
  const material = new ShaderMaterial({
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uSand: { value: sand },
      uShadow: { value: shadow },
      uLight: { value: light },
    },
  });
  const mesh = new Mesh(geometry, material);
  // Sits low in the frame, behind the school. Kept below roughly the lower
  // quarter so the floor reads as distance underneath the copy rather than as
  // a band cutting through it.
  // The near edge is deliberately pushed below the camera's bottom so the
  // scissor at the sill is what cuts the sand off, never the geometry running
  // out. Anything else leaves a strip of water between sand and sill.
  mesh.position.set(0, -2.35, -2.2);
  mesh.scale.set(6, 1.9, 1);

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
