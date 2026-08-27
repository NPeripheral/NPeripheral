import { OrthographicCamera, Scene, WebGLRenderer } from "three";
import { CHAPTERS, type ChapterName, type ChapterState } from "./chapters";
import { createAperture } from "./aperture";
import { createStars } from "./stars";
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
  /** Which ground-* chapter is currently behind the canvas. */
  setGround: (name: string) => void;
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
  const stars = createStars(p.bone, p.ember);
  const ocean = createOcean(p.seaLight, p.sea, p.bone, p.seaDeep, p.sand, p.sandShadow);
  scene.add(aperture.group, stars.mesh, ocean.group);

  // The ocean is the landing chapter only. Everywhere else the scene returns to
  // the ink/ember register the rest of the site is built in.
  let underwater = false;
  let oceanRoute = false;
  let oceanInView = false;
  let gateObserver: IntersectionObserver | null = null;
  let gateEl: HTMLElement | null = null;

  function syncOcean() {
    underwater = oceanRoute && oceanInView;
    // Stars and water are mutually exclusive. Underwater the sky is not
    // visible, so a starfield over the hero reads as a bug rather than as
    // atmosphere -- the water gets its school of fish, and the stars come back
    // the moment the page leaves the water.
    stars.mesh.visible = !underwater;
    // The iris keeps the accent everywhere, underwater included. It is a
    // decorative figure rather than text, so the AA rules that forced the
    // chapter's TYPE to white do not bind it -- and against the darkened
    // surface stop the ember reads as the one warm object in cold water.
    aperture.setColor(p.ember);
  }
  syncOcean();

  let target: ChapterState = { ...CHAPTERS.home };
  const current: ChapterState = { ...CHAPTERS.home };
  let slotEl: HTMLElement | null = null;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let raf = 0;
  let last = performance.now();
  let t = 0;
  let visible = !document.hidden;
  let running = false;
  let destroyed = false;

  function sizeToViewport() {
    // 1.5 rather than 2: 44% fewer pixels per frame for no visible difference
    // on a field of soft stars and a flat-shaded iris. At DPR 2 this canvas was
    // pushing 2.21 Mpx a frame.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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

  /**
   * The water has a surface line: the black sill at the bottom of the hero.
   * Visibility alone cannot express that -- it is on or off for the whole
   * canvas -- so the ocean is drawn in its own pass with the WebGL scissor set
   * to the gate rect. Sand and school are cut off exactly at the sill's top
   * edge, and the pass above it is unclipped.
   */
  function applyOceanScissor(): boolean {
    if (!gateEl) return false;
    const r = gateEl.getBoundingClientRect();
    if (r.width < 1 || r.height < 1 || r.bottom <= 0 || r.top >= window.innerHeight) return false;
    const dpr = renderer.getPixelRatio();
    const top = Math.max(r.top, 0);
    const bottom = Math.min(r.bottom, window.innerHeight);
    const h = bottom - top;
    if (h <= 0) return false;
    renderer.setScissor(
      Math.round(Math.max(r.left, 0) * dpr),
      Math.round((window.innerHeight - bottom) * dpr),
      Math.round(Math.min(r.width, window.innerWidth) * dpr),
      Math.round(h * dpr),
    );
    renderer.setScissorTest(true);
    return true;
  }

  function draw() {
    renderer.autoClear = false;
    renderer.clear();

    // pass 1 -- the ocean, clipped to the water line
    if (underwater && applyOceanScissor()) {
      ocean.group.visible = true;
      const hadAperture = aperture.group.visible;
      aperture.group.visible = false;
      renderer.render(scene, camera);
      aperture.group.visible = hadAperture;
    }

    // pass 2 -- everything else, unclipped
    renderer.setScissorTest(false);
    ocean.group.visible = false;
    renderer.render(scene, camera);
  }

  // ~30fps. A twinkle and a slow drift are indistinguishable from 60, and this
  // halves every cost below at a stroke.
  const FRAME_MS = 1000 / 30;
  let lastDraw = 0;

  function frame(now: number) {
    if (destroyed) return;
    if (!visible) { running = false; return; }
    if (now - lastDraw < FRAME_MS) { raf = requestAnimationFrame(frame); return; }
    lastDraw = now;
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    t += dt;

    // Lerp toward the target chapter — the same object re-forming.
    const k = reduced ? 1 : 1 - Math.exp(-dt * 3);
    current.openness += (target.openness - current.openness) * k;
    current.separation += (target.separation - current.separation) * k;
    current.spin += (target.spin - current.spin) * k;

    aperture.apply(current, reduced ? 0 : t);
    if (!reduced) {
      if (underwater) ocean.update(dt, t);
      if (!underwater) stars.update(t);
    }
    placeAperture();
    draw();
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
    draw();
  } else {
    start();
  }

  // Under reduced motion there is no render loop, so nothing re-runs
  // placeAperture() as the page scrolls -- the canvas is fixed but the slot is
  // not, and the iris would sit frozen at its first viewport position, drifting
  // across unrelated sections. Motion the user asked to avoid, produced by the
  // code meant to avoid it. One rAF-throttled re-place per scroll keeps the
  // figure in its box without ever starting the loop.
  let stillFrame = 0;
  const onStillScroll = () => {
    if (!reduced || stillFrame) return;
    stillFrame = requestAnimationFrame(() => {
      stillFrame = 0;
      placeAperture();
      draw();
    });
  };
  if (reduced) {
    window.addEventListener("scroll", onStillScroll, { passive: true });
  }

  const onVisibility = () => {
    visible = !document.hidden;
    // Guarded: without this, a reduced-motion user who switches tabs and back
    // gets a permanently self-rescheduling render loop. Nothing visibly moves,
    // but the promise was one still frame and stop -- not a silent battery cost.
    if (visible && !reduced) start();
  };
  document.addEventListener("visibilitychange", onVisibility);
  const onResize = () => {
    sizeToViewport();
    if (reduced) { placeAperture(); draw(); return; }
    start();
  };
  window.addEventListener("resize", onResize);

  return {
    setChapter(name) {
      target = { ...CHAPTERS[name] };
      oceanRoute = name === "home";
      if (!oceanRoute) oceanInView = false;
      syncOcean();
      if (!reduced) start();
      else { placeAperture(); draw(); }
    },
    setGround(name) {
      // Stars belong to night. On the light chapters they fade almost out
      // rather than becoming grey specks on cream.
      const onLight = name === "ground-cream" || name === "ground-ember";
      stars.setTone(onLight ? p.ink4 : p.bone, p.ember, onLight ? 0.16 : 0.9);
      if (!reduced) start();
      else { placeAperture(); draw(); }
    },
    setOceanGate(el) {
      gateObserver?.disconnect();
      gateObserver = null;
      gateEl = el;
      if (!el) { oceanInView = false; syncOcean(); return; }
      gateObserver = new IntersectionObserver(
        (entries) => {
          oceanInView = entries[entries.length - 1]?.isIntersecting ?? false;
          syncOcean();
          if (!reduced) start();
          else { placeAperture(); draw(); }
        },
        { threshold: 0 },
      );
      gateObserver.observe(el);
    },
    setSlot(el) { slotEl = el; if (!reduced) start(); else { placeAperture(); draw(); } },
    resize() { sizeToViewport(); start(); },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      gateObserver?.disconnect();
      cancelAnimationFrame(stillFrame);
      window.removeEventListener("scroll", onStillScroll);
      aperture.dispose();
      stars.dispose();
      ocean.dispose();
      renderer.dispose();
    },
  };
}
