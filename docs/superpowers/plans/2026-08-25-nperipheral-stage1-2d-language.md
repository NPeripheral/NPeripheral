# NPeripheral Redesign — Stage 1: 2D Language — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the Persona 5 / Overmind visual language to the site in 2D — diagonal chapter cuts, a re-timed cascade, a panel-and-tick system, and a corrected ground rhythm — with no new dependencies and no 3D.

**Architecture:** Extend the existing design system rather than adding a parallel one. Cuts and panels become `@utility` classes in `globals.css`; the cascade re-times the `Stagger`/`StaggerItem` already in `Reveal.tsx`; ground corrections are single-class edits to section components. No new animation library — `framer-motion` is already used in 18 files and `gsap` is dead weight.

**Tech Stack:** Next.js 16.3, React 19.2, Tailwind v4 (`@utility`), framer-motion, TypeScript.

**Spec:** `docs/superpowers/specs/2026-08-25-nperipheral-redesign-design.md`

## Global Constraints

- **No new dependencies.** Stage 1 adds none. Do not import `gsap`.
- **Cut angle 6.5°**, implemented as a rise of `11.5vw` across a `100vw` bleed. Constant direction, descending left→right.
- **Cuts only where the ground changes** — 5 on the homepage, not 13. One reversal, at `DiptychSection`.
- **Cascade:** stagger `45ms` clamped at index 8; per-item `420ms`; total under `700ms`; `--ease-snap: cubic-bezier(0.2, 1.4, 0.4, 1)`; overshoot on transform only, opacity 0→1 over `200ms` on `--ease-out-soft`; travel `22px` along the cut axis; no rotate, no scale.
- **At most one cascade per chapter**, only on genuine enumerations. Prose and headlines stay on `Reveal` / `Lines`.
- **Do not regress contrast.** `--color-faint: #8f877d` was lifted specifically to clear AA at 10–11px. Any new pairing must be checked.
- **No test framework exists.** Verification is `npx tsc --noEmit`, `npm run lint`, `npm run build`, and visual check in the browser pane. Do not add a test runner.
- Copy and `lib/data/*` are not edited except `work.ts` `tone` fields in Task 5.

---

### Task 1: Motion and cut tokens

**Files:**
- Modify: `app/globals.css` (the `@theme` block, alongside the existing `--ease-*` entries near line 63)

**Interfaces:**
- Consumes: nothing
- Produces: CSS custom properties `--ease-snap`, `--cut-rise`, `--cascade-step`, `--cascade-dur`, `--cascade-x`, `--cascade-y`, available to every later task

- [ ] **Step 1: Add the tokens**

In `app/globals.css`, inside `@theme`, directly after the existing `--ease-in-out-soft` line:

```css
  /* --- Cascade: the Persona 5 entrance, used in the seams only ----------
     --ease-snap overshoots ~8%. --ease-premium is expo-out and mathematically
     cannot overshoot, which is why this curve is new rather than reused.
     Overshoot is applied to transform ONLY; opacity clamps at 1 and a back
     curve on it produces a dead flat spot. */
  --ease-snap: cubic-bezier(0.2, 1.4, 0.4, 1);
  --cascade-step: 45ms;
  --cascade-dur: 420ms;

  /* Travel is 22px along the 6.5° cut axis: (cos 6.5°, sin 6.5°) × 22.
     Cascade and cuts sharing one axis is what makes the system read as
     authored rather than assembled. */
  --cascade-x: 21.86px;
  --cascade-y: 2.49px;

  /* --- Diagonal cuts ----------------------------------------------------
     6.5° is derived, not chosen: the 1344px shell gives 416px columns and
     48px gutters, and atan(48/416) = 6.58°. Expressing the rise in vw keeps
     the angle constant at every breakpoint. */
  --cut-rise: 11.5vw;
```

- [ ] **Step 2: Verify the tokens resolve**

Run: `npm run build`
Expected: build succeeds. Tailwind v4 fails loudly on malformed `@theme` entries, so a clean build is the check.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(motion): add cascade and diagonal-cut design tokens"
```

---

### Task 2: The `cut-top` utility

**Files:**
- Modify: `app/globals.css` (append after the `@utility ground-ember` block, which ends near line 328)

**Interfaces:**
- Consumes: `--cut-rise` from Task 1
- Produces: `.cut-top` and `.cut-top-reverse` utility classes

- [ ] **Step 1: Add the utilities**

```css
/* A chapter boundary that rakes 6.5° instead of sitting flat.

   The section pulls up by one rise and clips its own top corner away, so the
   PREVIOUS chapter's ground shows through the notch. That is why this only
   works where the ground actually changes — over a matching ground it is
   invisible, which is the intended constraint, not a limitation. */
@utility cut-top {
  margin-top: calc(-1 * var(--cut-rise));
  clip-path: polygon(0 0, 100% var(--cut-rise), 100% 100%, 0 100%);
  padding-top: var(--cut-rise);
}

/* Reversed rake. Used exactly once, at DiptychSection, where the meaning
   itself reverses. A second use makes it variety; one use makes it an
   argument. */
@utility cut-top-reverse {
  margin-top: calc(-1 * var(--cut-rise));
  clip-path: polygon(0 var(--cut-rise), 100% 0, 100% 100%, 0 100%);
  padding-top: var(--cut-rise);
}
```

- [ ] **Step 2: Verify**

Run: `npm run build`
Expected: success.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(layout): add cut-top diagonal chapter boundary utilities"
```

---

### Task 3: `DiagonalCut` — the ember hairline

**Files:**
- Create: `components/motion/DiagonalCut.tsx`

**Interfaces:**
- Consumes: `--cut-rise` from Task 1
- Produces: `export function DiagonalCut(props: { reverse?: boolean; className?: string }): JSX.Element`

- [ ] **Step 1: Create the component**

```tsx
import { cn } from "@/lib/utils";

type DiagonalCutProps = {
  /** Match the section's cut-top-reverse. Used once, at the Diptych. */
  reverse?: boolean;
  className?: string;
};

/**
 * The 1px ember hairline that rides a chapter cut.
 *
 * Drawn as an SVG line corner-to-corner in a box exactly one --cut-rise tall,
 * with preserveAspectRatio="none". That means the line IS the cut angle by
 * construction — it cannot drift out of alignment with the clip-path the way a
 * rotated pseudo-element would, at any viewport width.
 *
 * vectorEffect keeps the stroke 1px after the non-uniform scale.
 *
 * Reuses the seam device already established at
 * components/sections/DiptychSection.tsx:107 (w-px bg-ember).
 */
export function DiagonalCut({ reverse = false, className }: DiagonalCutProps) {
  return (
    <svg
      aria-hidden
      preserveAspectRatio="none"
      viewBox="0 0 100 100"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-10 h-[var(--cut-rise)] w-full text-ember",
        className,
      )}
    >
      <line
        x1="0"
        y1={reverse ? 100 : 0}
        x2="100"
        y2={reverse ? 0 : 100}
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add components/motion/DiagonalCut.tsx
git commit -m "feat(motion): add DiagonalCut ember hairline"
```

---

### Task 4: Re-time the cascade

**Files:**
- Modify: `components/motion/Reveal.tsx` (the `Stagger` parent near line 113 and its `StaggerItem`)

**Interfaces:**
- Consumes: `--ease-snap`, `--cascade-*` from Task 1
- Produces: `export function Cascade(props: { children: ReactNode; className?: string })` and `export function CascadeItem(props: { children: ReactNode; className?: string; as?: "div" | "li" })`

- [ ] **Step 1: Add Cascade beside the existing Stagger**

Append to `components/motion/Reveal.tsx`. Do not modify `Stagger` or `StaggerItem` — existing callers depend on their timing.

```tsx
const SNAP = [0.2, 1.4, 0.4, 1] as const;
const SOFT = [0.22, 1, 0.36, 1] as const;

/**
 * The Persona 5 entrance. Distinct from <Stagger> on purpose.
 *
 * Stagger is for prose arriving; Cascade is for a mechanism firing. It is fast
 * (45ms apart, 420ms each, under 700ms total) because past ~700ms a sequence
 * stops reading as one event and starts reading as a queue — and the whole
 * premise is that this is an event.
 *
 * Budget: at most one per chapter, and only on genuine enumerations. If it
 * becomes the site's default entrance it stops being spectacle.
 */
export function Cascade({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? "show" : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }}
    >
      {children}
    </motion.div>
  );
}

/**
 * `as` exists because the first real caller is a <ul> of services, and
 * `ul > div > li` is invalid HTML. Restricted to the two tags actually needed
 * rather than a generic ElementType, so framer-motion's props stay typed.
 */
export function CascadeItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const reduced = useReducedMotion();
  const Tag = as === "li" ? motion.li : motion.div;
  if (reduced) {
    return as === "li" ? <li className={className}>{children}</li> : <div className={className}>{children}</div>;
  }
  return (
    <Tag
      className={className}
      variants={{
        // Travel is along the 6.5° cut axis, so entrance and layout share one
        // vector. Opacity finishes early on a non-overshooting curve — an
        // overshoot under a semi-transparent item is invisible.
        hidden: { x: -21.86, y: -2.49, opacity: 0 },
        show: {
          x: 0,
          y: 0,
          opacity: 1,
          transition: {
            x: { duration: 0.42, ease: SNAP },
            y: { duration: 0.42, ease: SNAP },
            opacity: { duration: 0.2, ease: SOFT },
          },
        },
      }}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0. If `ReactNode` is not already imported in this file, add it to the existing `import type { ElementType, ReactNode } from "react";` line.

- [ ] **Step 3: Commit**

```bash
git add components/motion/Reveal.tsx
git commit -m "feat(motion): add Cascade entrance, 45ms/420ms on ease-snap"
```

---

### Task 5: Correct the ground rhythm

**Files:**
- Modify: `components/sections/WorkSection.tsx:24` — `ground-cream` → `ground-ink`
- Modify: `components/sections/FaqSection.tsx:15` — `ground-cream` → `ground-ink`
- Modify: `components/sections/JustGettingStarted.tsx:35` — `ground-ember` → `ground-ink`
- Modify: `components/sections/StarterSection.tsx:34` — `ground-ink-2` → `ground-ink`
- Modify: `components/sections/WhyChooseSection.tsx:17` — `ground-ink-2` → `ground-ink`
- Modify: `lib/data/work.ts` — audit per-item `tone`
- Modify: `app/page.tsx` — update the chapter comment to match reality

**Interfaces:**
- Consumes: nothing
- Produces: a ground sequence with no two adjacent chapters sharing a colour

- [ ] **Step 1: Flip the three grounds**

```bash
sed -i '' 's/ground-cream relative py-24 md:py-36/ground-ink relative py-24 md:py-36/' components/sections/WorkSection.tsx
sed -i '' 's/ground-cream relative py-24 md:py-36/ground-ink relative py-24 md:py-36/' components/sections/FaqSection.tsx
sed -i '' 's/ground-ember relative py-24 md:py-32/ground-ink relative py-24 md:py-32/' components/sections/JustGettingStarted.tsx
sed -i '' 's/ground-ink-2 relative py-24 md:py-32/ground-ink relative py-24 md:py-32/' components/sections/StarterSection.tsx
sed -i '' 's/ground-ink-2 relative py-24 md:py-36/ground-ink relative py-24 md:py-36/' components/sections/WhyChooseSection.tsx
```

`ground-ink-2` is retired as a *chapter* ground per the spec — a ~7-unit
luminance step against `ink` does not read at a full-bleed boundary, so
`StarterSection` and `WhyChooseSection` were paying for a distinction the eye
never receives. The utility itself stays, for panels *inside* an ink chapter
where it has an adjacent edge to be measured against.

- [ ] **Step 2: Verify exactly three files changed and the sequence is correct**

```bash
git diff --stat
for s in Hero SignalTicker ManifestoSection ServicesSection StarterSection DiptychSection WorkSection ProcessTimeline JustGettingStarted WhyChooseSection PricingSection FaqSection BrandStatement FinalCta; do
  f=$(find components -name "$s.tsx" | head -1)
  printf '%-22s %s\n' "$s" "$(grep -oE 'ground-[a-z0-9-]+' "$f" | head -1)"
done
```

Expected sequence: `ink, ember, cream, ink, ink, ink, ink, ink, ink, ink, cream, ink, ember, ink`.

Services through WhyChoose is now seven consecutive ink chapters. That is
intentional and is the whole point of the correction: the page currently
changes colour to avoid the harder work of changing composition. The diagonal
cuts, the pinned horizontal `ProcessTimeline`, and the per-section
compositional shifts do that work instead — and cream lands harder for the
wait.

- [ ] **Step 3: Audit work.ts tone**

`WorkSection` now sits on ink, so any item with `tone: "ink"` renders an ink figure on an ink ground and disappears. Open `lib/data/work.ts` and set every item's `tone` to `"cream"` or `"ember"`. The figures invert; the chapter does not.

- [ ] **Step 4: Update the chapter comment in `app/page.tsx`**

The comment beginning "The homepage is sequenced as chapters" lists each section's ground. Update the changed lines so the comment matches the code — it currently claims no two neighbours share a colour, which was already untrue for Pricing/Faq.

- [ ] **Step 5: Verify visually**

Run: `npm run build`, then view `http://localhost:3000` in the browser pane. Confirm the Work figures are legible on ink and `JustGettingStarted` reads as candid rather than promotional.

- [ ] **Step 6: Commit**

```bash
git add components/sections lib/data/work.ts app/page.tsx
git commit -m "refactor(design): correct ground rhythm, retire adjacent cream"
```

---

### Task 6: Apply cuts at the six ground changes

**Files:**
- Modify: `components/sections/ManifestoSection.tsx`
- Modify: `components/sections/ServicesSection.tsx`
- Modify: `components/sections/PricingSection.tsx`
- Modify: `components/sections/FaqSection.tsx`
- Modify: `components/sections/BrandStatement.tsx`
- Modify: `components/sections/FinalCta.tsx`
- Modify: `components/sections/DiptychSection.tsx` (internal A/B seam only)

Do **not** edit `app/page.tsx` in this task — the cut classes live on the
sections themselves. Task 5 owns the only `page.tsx` change.

**Interfaces:**
- Consumes: `.cut-top` / `.cut-top-reverse` (Task 2), `DiagonalCut` (Task 3)
- Produces: the finished Stage 1 homepage

- [ ] **Step 1: Identify the six boundaries**

After Task 5 the chapter grounds change at exactly these seams. `SignalTicker`
is excluded deliberately — it is a 60px rule, not a chapter, so it takes no cut.

| # | Boundary | Section carrying the class | Class |
| --- | --- | --- | --- |
| 1 | SignalTicker (ember) → Manifesto (cream) | `ManifestoSection` | `cut-top` |
| 2 | Manifesto (cream) → Services (ink) | `ServicesSection` | `cut-top` |
| 3 | WhyChoose (ink) → Pricing (cream) | `PricingSection` | `cut-top` |
| 4 | Pricing (cream) → Faq (ink) | `FaqSection` | `cut-top` |
| 5 | Faq (ink) → BrandStatement (ember) | `BrandStatement` | `cut-top` |
| 6 | BrandStatement (ember) → FinalCta (ink) | `FinalCta` | `cut-top` |

**The single reversal is internal to the Diptych.** With `ground-ink-2`
retired, `StarterSection` and `DiptychSection` are both ink, so there is no
boundary at the Diptych's top edge to rake. The place the meaning reverses is
*inside* the section — panel A is ink ("before"), panel B is cream ("after").
Apply `cut-top-reverse` and `<DiagonalCut reverse />` to panel B's container,
not to the `<section>`. This is the only reversal on the page; a second use
makes it variety rather than argument.

- [ ] **Step 2: Apply to each boundary section**

Each of the five sections takes the class on its own `<section>` and renders `<DiagonalCut />` as its first child. Example, in `ManifestoSection.tsx`:

```tsx
<section className="ground-cream cut-top relative py-28 md:py-44">
  <DiagonalCut />
  <div className="shell">
```

For boundary 3, use `cut-top-reverse` and `<DiagonalCut reverse />`.

Import in each: `import { DiagonalCut } from "@/components/motion/DiagonalCut";`

- [ ] **Step 3: Verify no cut sits over a matching ground**

Run the ground-sequence loop from Task 5 Step 2 again and confirm each of the five cut sections has a different ground from the section above it. A cut over a matching ground is invisible and should be removed rather than left in.

- [ ] **Step 4: Full verification**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: all three clean.

Then in the browser pane at 1280×900, screenshot the homepage top to bottom and confirm: the rake is constant and descends left→right at every cut except the Diptych; the ember hairline sits exactly on each cut edge at 1280 and at 390.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx components/sections
git commit -m "feat(layout): rake chapter boundaries at 6.5deg with ember hairline"
```

---

### Task 7: Apply the cascade to the services list

**Files:**
- Modify: `components/sections/ServicesSection.tsx` (the `<ul>` near line 103 and its `<li>` near line 107)

**Interfaces:**
- Consumes: `Cascade`, `CascadeItem` from Task 4
- Produces: the homepage's single cascade

This is the only cascade on the homepage. The services list is a genuine
enumeration — a numbered, ruled list of seven items — which is exactly what the
budget in Global Constraints permits and nothing else on the page qualifies for.

- [ ] **Step 1: Import**

```tsx
import { Cascade, CascadeItem } from "@/components/motion/Reveal";
```

- [ ] **Step 2: Wrap the list**

Change the `<ul>` to be wrapped by `Cascade`, and each `<li>` to be a
`CascadeItem` rendering as `li`. The `onPointerLeave` handler stays on the
`<ul>`:

```tsx
<Cascade>
  <ul onPointerLeave={() => setActive(null)}>
    {services.map((service, i) => {
      const isActive = active === i;
      return (
        <CascadeItem as="li" key={service.slug}>
          <Link
            href="/contact"
            ...unchanged...
          </Link>
        </CascadeItem>
      );
    })}
  </ul>
</Cascade>
```

Do not change anything inside the `<Link>`. The hover/focus state machine
(`setActive`) is untouched.

- [ ] **Step 3: Verify the total stays under budget**

Seven services at 45ms apart plus 420ms for the last item = 690ms. Under the
700ms ceiling. If `lib/data/services.ts` ever exceeds 8 items the clamp in
`Cascade` holds the total at 780ms — acceptable, but do not raise the stagger.

- [ ] **Step 4: Verify markup validity and types**

```bash
npx tsc --noEmit && npm run lint && npm run build
```
Expected: all clean. Then in the browser pane, confirm in DevTools that the
`<ul>` contains only `<li>` children — a `div` between them means `as="li"`
was not passed.

- [ ] **Step 5: Verify motion**

Reload `http://localhost:3000` and scroll to Services. The seven rows should
arrive left-to-right along the rake, fast, finishing as one event. Then set
`prefers-reduced-motion: reduce` and confirm all seven render in place with no
transform.

- [ ] **Step 6: Commit**

```bash
git add components/sections/ServicesSection.tsx
git commit -m "feat(motion): cascade the services enumeration"
```

---

## Verification summary

There is no test runner in this project and Stage 1 does not add one. Every task ends with some combination of:

- `npx tsc --noEmit` — types
- `npm run lint` — eslint
- `npm run build` — Tailwind `@theme`/`@utility` validity and Next build
- Browser-pane screenshot at 1280×900 and 390×844 — the visual result

## Out of scope

three.js, `SceneSlot`, the aperture and the leaves are Stage 2 and have their own plan. Routes other than `/` are Stage 3.
