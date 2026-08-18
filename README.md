# NPeripheral

Marketing site for **NPeripheral** — a social media marketing and management
company based in Fort Worth, Texas.

> **Appear to your audience.**

Built with Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion
and Lenis. No stock photography and no image assets: every visual on the site
is drawn at runtime.

---

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values you need
npm run dev
```

Open http://localhost:3000.

The site builds and runs with **every** environment variable unset. Each one
switches a capability on rather than being required.

## Environment variables

| Variable | Required | What it does |
| --- | --- | --- |
| `RESEND_API_KEY` | **Before launch** | Sends quote-form submissions to your inbox |
| `LEAD_NOTIFY_EMAIL` | **Before launch** | Where those submissions go |
| `LEAD_FROM_EMAIL` | No | Sender address; defaults to Resend's shared test sender |
| `NEXT_PUBLIC_GA_ID` | No | GA4 measurement ID. No tracking script loads without it |
| `NEXT_PUBLIC_CALENDLY_URL` | No | Adds "book a call" alongside the quote form |
| `NEXT_PUBLIC_SITE_URL` | Production | Canonical tags, Open Graph URLs, sitemap, robots |
| `HUBSPOT_API_KEY` / `GOHIGHLEVEL_*` | No | CRM wire-up points (stubbed in `app/api/lead/route.ts`) |

**Never commit `.env.local`.** `.gitignore` excludes `.env*`, with an exception
only for `.env.example`.

## Scripts

```bash
npm run dev      # dev server
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
npx tsc --noEmit # typecheck
```

## Project structure

```
app/                    routes (App Router)
  api/lead/             quote-form endpoint — validation + email delivery
  api/newsletter/       email-list signup (stub)
  api/chatbot/          rule-based triage for the chat widget
  work/                 concept projects
  onboarding/           how we work together
  help/                 help centre
  legal/                privacy + terms
components/
  sections/             homepage chapters
  visual/Aperture.tsx   the drawn image system
  motion/               reveal, smooth scroll, cursor, preloader
  tour/                 guided product tours
lib/data/               all site copy lives here
lib/site-config.ts      contact details, nav, social links
```

Most copy changes are edits to `lib/data/*` — you should rarely need to touch
a component to change what the site says.

## Content rules

This site is deliberately free of fabricated proof. Before adding anything,
note the conventions it follows:

- **No invented metrics.** There is no stats section, no follower counts and
  no revenue figures, because there are none to report yet.
- **No testimonials until they are real.** The "We're Just Getting Started"
  section stands in for social proof and invites first clients instead.
- **No review or `aggregateRating` schema.** Marking up praise nobody gave is
  a structured-data policy violation.
- **Concept work is badged as concept work.** Items in `lib/data/work.ts` with
  `kind: "concept"` render a badge and a disclaimer. Set `kind: "client"` only
  for delivered work you have permission to show.
- **No guaranteed outcomes.** Services describe work performed, not results
  promised.
- **The address is a mailing address.** It is labelled as such everywhere and
  is kept out of `LocalBusiness` schema — it is a virtual mailbox, not an
  office, and the site never implies otherwise.
- **Social links only when they exist.** Empty entries in `site-config.ts` are
  filtered out rather than rendered as dead links.

## Adding real client work

1. Add an entry to `lib/data/work.ts` with `kind: "client"`.
2. Get written permission to use the client's name.
3. Only add figures you can evidence from their own analytics.

The concept badge and disclaimer disappear automatically for `client` items.

## Accessibility & motion

Semantic landmarks, one `<h1>` per page, visible focus states, labelled form
fields with `aria-describedby` error wiring, and full keyboard support for the
menu, command palette (`⌘K`) and tours. Every animation respects
`prefers-reduced-motion`; the custom cursor only activates on fine pointers.

## License

All rights reserved. The NPeripheral name, wordmark and copy are not licensed
for reuse.
