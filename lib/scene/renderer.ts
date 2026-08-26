import { OrthographicCamera, Scene, WebGLRenderer } from "three";
import { CHAPTERS, type ChapterName, type ChapterState } from "./chapters";
import { createAperture } from "./aperture";
import { createLeaves } from "./leaves";
import { createOcean } from "./ocean";
import { palette } from "./palette";

export interface SceneHandle {
  setChapter: (name: ChapterName) => void;
  /**
   * The element whose rect the aperture should fill. Deliberately the ELEMENT,
   * not a DOMRect: the hero figure animates in from y:102%, and Lenis
   * smooth-scroll never fires a window scroll event, so any cached rect is
   * wrong within a frame of being taken.
   */
  setSlot: (el: HTMLElement | null) => void;
  /**
   * The element whose visibility gates the underwater scene. The canvas is
   * fixed, so route-gating alone left the school swimming over every section
   * below the hero; the ocean has to end where the hero does.
   */
  setOceanGate: (el: HTMLElement | null) => void;
  resize: () => void;
  destroy: () => void;
}

export function startScene(canvas: HTMLCanvasElement): SceneHandle | null {
  const gl = canvas.getContext("webgl2", { alpha: true, antialias: true });
  if (!gl) return null;

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
  } catch {
    return null;
  }
  renderer.setClearAlpha(0);

  const scene = new Scene();
  const camera = new OrthographicCamera(-3, 3, 3, -3, 0.1, 100);
  camera.position.z = 5;

  const p = palette();
  const aperture = createAperture(p.ember);
  const leaves = createLeaves(p.ink4, p.ember);
  const ocean = createOcean(p.seaLight, p.sea, p.bone, p.seaDeep, p.sand, p.sandShadow);
  scene.add(aperture.group, leaves.mesh, ocean.group);

  // The ocean is the landing chapter only. Everywhere else the scene returns to
  // the ink/ember register the rest of the site is built in.
  let underwater = false;
  let oceanRoute = false;
  let oceanInView = false;
  let gateObserver: IntersectionObserver | null = null;

  function syncOcean() {
    underwater = oceanRoute && oceanInView;
    ocean.group.visible = underwater;
    // Below the hero the site returns to what it was: leaves, not fish.
    leaves.mesh.visible = !underwater;
    // ground-sea retires the accent to white; the figure drawn over it has to
    // follow, or the one orange object on the page is the 3D one.
    aperture.setColor(underwater ? p.bone : p.ember);
  }
  syncOcean();

  let target: ChapterState = { ...CHAPTERS.home };
  const current: ChapterState = { ...CHAPTERS.home };
  let slotEl: HTMLElement | null = null;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let raf = 0;
  let last = performance.now();
  let t = 0;
  let visible = true;
  let running = false;
  let destroyed = false;

  function sizeToViewport() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(dpr);
    renderer.setSize(w, h, false);
    const aspect = w / h;
    camera.left = -3 * aspect;
    camera.right = 3 * aspect;
    camera.updateProjectionMatrix();
  }

  function placeAperture() {
    if (!slotEl) {
      aperture.group.visible = false;
      return;
    }
    const slot = slotEl.getBoundingClientRect();
    if (slot.width < 1 || slot.height < 1) {
      aperture.group.visible = false;
      return;
    }
    aperture.group.visible = true;
    // Map the slot's screen rect into world space so the aperture sits exactly
    // inside the figure box the page already reserves. The canvas is a figure,
    // not a background: over an opaque ground a background canvas is invisible.
    const w = window.innerWidth;
    const h = window.innerHeight;
    const cx = slot.left + slot.width / 2;
    const cy = slot.top + slot.height / 2;
    const aspect = w / h;
    aperture.group.position.x = ((cx / w) * 2 - 1) * 3 * aspect;
    aperture.group.position.y = -((cy / h) * 2 - 1) * 3;
    const fit = Math.min(slot.width / w, slot.height / h) * 3.4;
    aperture.group.scale.setScalar(Math.max(fit, 0.2));
  }

  function frame(now: number) {
    if (destroyed) return;
    if (!visible) { running = false; return; }
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    t += dt;

    // Lerp toward the target chapter — the same object re-forming.
    const k = reduced ? 1 : 1 - Math.exp(-dt * 3);
    current.openness += (target.openness - current.openness) * k;
    current.separation += (target.separation - current.separation) * k;
    current.distance += (target.distance - current.distance) * k;
    current.spin += (target.spin - current.spin) * k;

    aperture.apply(current, reduced ? 0 : t);
    if (!reduced) {
      if (underwater) ocean.update(dt, t);
      else leaves.update(dt);
    }
    placeAperture();
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (destroyed || running || !visible) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  sizeToViewport();
  placeAperture();
  if (reduced) {
    // Reduced motion: render one still frame and stop. No drift, no spin, no gust.
    aperture.apply(current, 0);
    renderer.render(scene, camera);
  } else {
    start();
  }

  const onVisibility = () => {
    visible = !document.hidden;
    if (visible) start();
  };
  document.addEventListener("visibilitychange", onVisibility);
  const onResize = () => { sizeToViewport(); start(); };
  window.addEventListener("resize", onResize);

  return {
    setChapter(name) {
      target = { ...CHAPTERS[name] };
      oceanRoute = name === "home";
      if (!oceanRoute) oceanInView = false;
      syncOcean();
      if (!reduced) { leaves.burst(); start(); }
      else { placeAperture(); renderer.render(scene, camera); }
    },
    setOceanGate(el) {
      gateObserver?.disconnect();
      gateObserver = null;
      if (!el) { oceanInView = false; syncOcean(); return; }
      gateObserver = new IntersectionObserver(
        (entries) => {
          oceanInView = entries[entries.length - 1]?.isIntersecting ?? false;
          syncOcean();
          if (!reduced) start();
          else { placeAperture(); renderer.render(scene, camera); }
        },
        { threshold: 0 },
      );
      gateObserver.observe(el);
    },
    setSlot(el) { slotEl = el; if (!reduced) start(); else { placeAperture(); renderer.render(scene, camera); } },
    resize() { sizeToViewport(); start(); },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      gateObserver?.disconnect();
      aperture.dispose();
      leaves.dispose();
      ocean.dispose();
      renderer.dispose();
    },
  };
}
