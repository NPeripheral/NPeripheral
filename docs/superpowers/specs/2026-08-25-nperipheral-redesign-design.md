# NPeripheral redesign — design

**Date:** 2026-08-25
**Status:** approved in chat, pending spec review
**Scope:** all 12 routes

## Goal

Rebuild the visual and motion language of nperipheral.com. Keep the existing
palette. Take structural inspiration from overmindlab.ai, push the motion toward
a Persona 5 menu aesthetic, and add a three.js layer with a constrained orbit
control, drifting leaves, and animated scene changes between chapters.

The stated failure mode to avoid is "AI slop": generic, decorated-by-default
pages that could belong to any business.

## The governing tension

`app/globals.css` opens with a design thesis:

> this page is composed, not decorated. One flat ground per chapter. No gradient
> soup. One accent (ember). It is used for emphasis, never for decoration.
> Rule of thirds. Emptiness is a material, not wasted space.

Persona 5 menus, drifting leaves and an always-on 3D scene are decoration by
nature. That is the central design problem, and the resolution is the design:

**Spectacle lives in the seams.** Pages at rest stay composed and editorial —
the thesis survives untouched. All Persona 5 energy is spent on transitions:
the menu, route changes, chapter cuts, scene morphs. Decoration becomes an
event the reader triggers, not wallpaper they sit in. This is also how Persona 5
itself works: its menus detonate, its conversation screens are calm.

## Visual language: role separation

Three references resolve into one system by owning different layers, so they
never argue.

### Overmind owns the page at rest

Bordered panels with corner ticks, mono instrumentation labels, chapter
tag-pills, generous flat ground. The vocabulary already exists — `globals.css`
describes mono as "instrumentation".

### Persona 5 owns motion and the menu

Adopted mechanics, chosen because they survive contact with a real business
site:

- **Staggered cascade entry.** Elements arrive in fast sequence with overshoot,
  never together. The single most P5-feeling device, and nearly free.
- **Diagonal cuts as a masking system.** Chapter boundaries are angled
  `clip-path` slashes rather than horizontal rules. The *cuts* are skewed, not
  the content.
- **Torn-edge masks** on transitions, echoing P5's jagged panels.
- **Halftone**, via the existing `components/visual/HalftoneVeil.tsx` — the
  exact bridge between P5's comic dots and Overmind's dithering.

Deliberately rejected, as the three that read as costume rather than design:
idle jitter, permanent skew on body text, outlined display type.

### The existing palette owns everything

No Persona 5 red enters the system. Ember `#e2542a` is already a red-orange and
carries that energy against ink `#0b0a09`. The cream grounds (`#f2ece1`)
provide P5's stark light/dark flips as "inverted chapters" without leaving the
palette.

Note: the existing palette is already structurally what Overmind uses — a near
-black warm ground with a single orange accent (`#050200` / `#fa680c`). The
Overmind inspiration costs nothing in colour terms.

### Reuse over replacement

`Reveal`, `Magnetic`, `Marquee`, `CustomCursor`, `Preloader`, `ScrollProgress`,
`SmoothScroll`, `TiltCard` are re-timed and re-choreographed, not replaced.
Discarding eleven working components to import a generic animation library is
itself a form of slop.

**Correction (2026-08-25, during planning).** An earlier draft of this spec
proposed a new GSAP-based `Cascade.tsx`. That was wrong. `gsap` is listed in
`package.json` but **no file imports it** — it is a dead dependency.
`framer-motion` is used in 18 files, and a stagger parent already exists at
`components/motion/Reveal.tsx:113` (`Stagger` / `StaggerItem`), with another in
`Lines.tsx`. `Reveal`'s own doc comment states that everything arrives through
it "so timing and easing stay consistent instead of being re-invented per
section."

Introducing GSAP would therefore add a second animation system to a codebase
that deliberately centralised on one. The Persona 5 cascade is instead delivered
by **re-timing the existing `Stagger`/`StaggerItem`** and adding one overshoot
easing curve to `globals.css`. No new animation dependency. `gsap` should be
removed from `package.json` as dead weight.

## The 3D subsystem

A single persistent scene, driven by route state, built from procedural geometry
so it carries no asset pipeline and no loading cost.

### One canvas, app-wide

A single WebGL context mounted once in `app/layout.tsx`, fixed behind content,
alongside the existing `SmoothScroll` / `ScrollProgress` / `CustomCursor`
mounts. Route changes push *state* into it; they never remount it.

Rationale: a context per route causes context loss, leaked buffers and a white
flash on every navigation. A persistent canvas is also what makes scene changes
a morph rather than a reload.

### The aperture

Procedural geometry, not a loaded model: six extruded blades rotated about a
centre. Extends the `Aperture` motif already in `components/visual/`, and the
metaphor is the company's tagline — *Appear to your audience.*

A chapter is a parameter set (blade angle, separation, camera position,
roughness). Transitions lerp between parameter sets, so the same object
re-forms rather than being swapped. No asset pipeline; adding a chapter is
adding six numbers.

| Chapter | Routes | Aperture state |
| --- | --- | --- |
| Home | `/` | slow breathing iris, half-open |
| Services | `/#services`, `/industries/[slug]` | blades fan out, separated |
| Work | `/work`, `/blog`, `/blog/[slug]` | blades stack into a lens barrel, camera pushes through |
| Contact | `/contact`, `/onboarding`, `/thank-you` | iris closes to a slit |
| Quiet | `/about`, `/help`, `/legal/*` | near-still, minimum motion |

### Leaves

One `InstancedMesh`, ~40 instances at rest, single draw call, slow drift. On a
chapter change they take a velocity impulse — a gust scatters them across the
cut, then damping settles them. Sparse at rest so they do not become wallpaper;
violent in the seams so the transition lands.

### Orbit

`OrbitControls` from `three/examples/jsm`, constrained: damped, polar angle
clamped to prevent going under the floor, no pan, slow auto-rotate at rest that
stops on grab. Unconstrained orbit lets a visitor look at the back of nothing
and conclude the site is broken.

### Library choice

Vanilla `three`, not React Three Fiber.

- One dependency rather than three
- No version-compatibility risk against Next 16 and React 19, both very new
- `OrbitControls` ships in `three/examples/jsm`; drei is unnecessary
- Direct control of the render loop, which the idle behaviour below requires

R3F's declarative advantage is thin when the scene is a single procedural
object.

### Performance and accessibility — non-negotiable

- `prefers-reduced-motion` → static frame; no drift, auto-rotate, or gust
- No WebGL2, or a failed context → fall back to the existing `Aperture.tsx` +
  `HalftoneVeil.tsx`, which already look good
- rAF stops when the tab is hidden or the canvas leaves the viewport
  (`IntersectionObserver`)
- The loop idles out when nothing is moving and wakes on interaction. It does
  not run at 60fps behind static text
- `devicePixelRatio` clamped to 2; leaf count and blade segment count reduced
  on coarse pointers
- Scene colours are read from the CSS custom properties in `palette.ts`, so the
  palette stays single-source and cannot drift

## Resolved craft decisions (advisor, 2026-08-25)

All values below are decided, not indicative. Claims were verified against the
source before adoption.

### Diagonal cuts
- **6.5°**, derived from the grid rather than taste: the 1344px shell gives
  416px columns and 48px gutters; `atan(48/416)` = 6.58°. Implemented as a rise
  of **11.5vw across a 100vw bleed**, so the angle is constant at every
  breakpoint.
- **Constant direction**, descending left→right. Alternating produces a
  sawtooth, and a sawtooth is texture — the rhythmic decoration the thesis
  forbids.
- **Only where the ground changes** (5 cuts on the homepage, not 13), with one
  deliberate reversal at `DiptychSection`, the only boundary where the meaning
  itself reverses.
- Cut edge carries a 1px ember hairline, reusing the seam device already at
  `components/sections/DiptychSection.tsx:107`.

### Cascade
- Stagger **45ms**, clamped at index 8. Per-item **420ms**. Total budget under
  **700ms** — past that a sequence reads as a queue, not an event.
- New curve: `--ease-snap: cubic-bezier(0.2, 1.4, 0.4, 1)` (~8% overshoot).
  `--ease-premium` is expo-out and cannot overshoot.
- **Overshoot on transform only.** Opacity runs 0→1 over 200ms on
  `--ease-out-soft`, or the overshoot happens under a semi-transparent item.
- Travel **22px along the 6.5° cut axis**. No rotate, no scale.
- **Budget: at most one cascade per chapter**, and only on genuine
  enumerations. Prose and headlines stay on `Reveal` and `Lines`.

### Ground rhythm
`app/page.tsx:39` states the ground alternates "so no two neighbouring sections
share a composition or a colour" — but `PricingSection` and `FaqSection` are
both cream and adjacent. Resolved as:

| Section | From | To | Reason |
| --- | --- | --- | --- |
| Manifesto | cream | **keep** | the page's own voice; earns the first inversion |
| Diptych B | cream | **keep** | ground change *is* the content (before → after) |
| Pricing | cream | **keep** | published prices on a light ground; nothing hidden |
| Work | cream | **ink** | absorbs the Diptych's payoff; figures invert, chapter doesn't |
| Faq | cream | **ink** | utility, not a voice change; cream only because its neighbour was |
| JustGettingStarted | ember | **ink** | candour set in the loudest colour reads as promotion |
| BrandStatement | ember | **keep** | sole full-bleed detonation before the close |
| SignalTicker | ember | **keep** | a rule, not a chapter |

`ground-ink-2` is retired as a *chapter* ground — a ~7-unit luminance step does
not read full-bleed. Retained for panels inside an ink chapter.

### Aperture: 7 blades
Even counts give parallel opposing edges, so half-open reads as a static polygon
(six = a hexagon). Odd counts have no parallel edges and read as rotational —
a mechanism caught mid-motion. Five still reads as "a pentagon"; seven is past
the count the eye resolves at small size. Blade tips take an inner radius so the
closed state is a 7-pointed slit, not a point. **Blade count is identity, not a
performance knob** — reduce segments on coarse pointers, never blades.

### Leaves
- **Vesica silhouette** — the same geometry as an aperture blade, truncated.
  A gust is then the aperture shedding blades, not a particle system. A maple
  silhouette is the slop, because it belongs to every site.
- **Three discrete sizes**, not a range: 12/20/34px long axis, 3:1, distributed
  24/12/4. Continuous random sizing is the procedural tell.
- **Roll about the long axis only**, 0.06–0.14 rad/s. Yaw and pitch locked;
  every long axis within ±12° of the 6.5° cut angle. Aligned reads as
  composition, random reads as debris.
- **No sinusoidal sway** (the particle-system signature) and **no alpha fade at
  edges** (the screensaver tell). Leaves are clipped by the diagonal cut
  instead — spectacle in the seams, made literal.
- **Unlit `MeshBasicMaterial`**, flat colour per instance from `palette.ts`.
  Lighting produces intermediate values the palette does not contain — gradient
  soup through the back door — and would make the flat SVG fallback look like a
  different site.
- `--color-ink-4` on ink, `--color-cream-3` on cream. **Exactly one** leaf, the
  largest, is ember.
- Gust: impulse along the cut axis at ~14× rest velocity, damping τ ≈ 0.55s,
  roll rate ×8 for the duration only.

### CORRECTION: the canvas is a figure, not a background

The earlier "single canvas fixed behind content" was **unbuildable**. Every
`ground-*` utility sets an opaque `background` (verified: `globals.css:291`,
`background: var(--color-ink)`), so a canvas behind content is fully occluded on
every section. The only alternative — translucent sections — destroys "one flat
ground per chapter". The spec picked neither.

Resolved:

- The single persistent context stays mounted in `app/layout.tsx`; per-route
  contexts do cause the loss and flash described earlier.
- **The aperture draws only into rects the page already reserves for figures** —
  the hero's right third (`components/hero/Hero.tsx:115`, already labelled
  `Fig. 01`), the Diptych panels, the Work cards. A `<SceneSlot>` component's
  bounding rect drives the aperture's screen position: one context, many
  placements.
- `<SceneSlot>` renders the existing `<Aperture>` SVG when WebGL is
  unavailable, in the identical box. The fallback becomes the default path
  rather than a separate one.
- **Only leaves render outside a slot** — transparent canvas,
  `pointer-events-none`, z-ordered above the opaque grounds and below text.

This satisfies the success criterion "deleting `lib/scene/` leaves a working
site" literally: delete it and the slots fall back to SVG apertures that already
exist.

## Architecture

```
lib/scene/
  chapters.ts    route → chapter parameter table (the design lives here)
  aperture.ts    procedural blade geometry + morph
  leaves.ts      InstancedMesh drift + gust impulse
  renderer.ts    context, loop, idle/visibility, DPR, teardown
  palette.ts     CSS custom properties → three.Color
components/scene/
  SceneCanvas.tsx     client-only, mounted once in layout
  SceneDirector.tsx   watches pathname, pushes chapter state
  SceneSlot.tsx       reserves a figure rect; falls back to <Aperture/> SVG
components/motion/
  Reveal.tsx          MODIFIED — re-timed Stagger/StaggerItem, overshoot curve
  DiagonalCut.tsx     angled clip-path chapter boundary
```

The boundary test: adding a chapter should mean adding a row to `chapters.ts`
and nothing else. If it requires touching `aperture.ts` or a page component,
the boundary is wrong.

`three` is imported only under `lib/scene/` and `components/scene/`. Page
components never import it, so the 3D layer can be deleted without touching
pages.

## Staging

Each stage is shippable; the site is never left broken.

1. **2D language, no 3D.** Re-timed cascade (via existing `Stagger`),
   diagonal cuts, halftone, chapter tags,
   panel/tick system, re-timed existing motion. Requires no new dependencies.
   The site already reads as redesigned at the end of this stage.
2. **Scene skeleton.** Canvas, renderer, aperture, constrained orbit, both
   fallbacks. No leaves. Measure frame cost before adding more.
3. **Leaves, gust, chapter morphs** wired to routes.
4. **Remaining routes**; blog and legal templates last.

The staging is forced by a real constraint, not ceremony. Stage 1 is verifiable
end to end in this environment: `nperipheral` has its own `node_modules`
including `tsc`, and the dev server can be run and inspected in the browser
pane. Stages 2–4 cannot typecheck until `three` is installed.

## Dependencies

One install, which must be run by the user (this environment has no outbound
network from the shell):

```
npm install three @types/three
```

Note: `node_modules/@react-three/` currently exists but is empty — a leftover
from an aborted install. It should be removed.

## Preserved, explicitly

- All copy and `lib/data/*`. The honest positioning stays, including "no
  engagement includes all seven by default" and the virtual-mailing-address
  restraint.
- JSON-LD (`Organization`, `WebSite`), `sitemap.ts`, `robots.ts`,
  `opengraph-image.tsx`.
- The skip link and focus-visible states.
- `--color-faint: #8f877d`, which the source comment records as having been
  lifted from `#6d655c` specifically to clear AA at 10–11px. Diagonal cuts and
  halftone must not regress contrast; ratios are re-checked on any new pairing.

## Success criteria

- The site reads as designed rather than decorated: a visitor who disables
  JavaScript still sees a composed editorial page.
- No route regresses Lighthouse accessibility below its current score.
- The 3D layer costs 0% CPU when the tab is hidden or the canvas is off-screen.
- `prefers-reduced-motion` produces a still, complete, legible site.
- Deleting `lib/scene/` and `components/scene/` leaves a working site.
