# peeyushpashine.com

Personal site. Next.js 16 (App Router), Tailwind v4, TypeScript. Static export, no backend.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy (session 1 goal)

1. `git init && git add -A && git commit -m "portfolio: hero and experience"`
2. Create an empty repo on GitHub, push to it.
3. Go to vercel.com, "Add New Project", import the repo.
4. Accept every default. Next.js is detected automatically; there are no env vars.
5. Deploy. You get a `*.vercel.app` URL in about a minute.

Custom domain is session 2. Vercel → Project → Settings → Domains, then point
the CNAME at Vercel from your registrar.

## Where the content lives

**All copy is in `lib/content.ts`.** Components read from it and render nothing
when an array is empty, so half-finished sections never ship as empty headings.

Session 2 is filling in these arrays, not editing components:

- `work` — selected systems (SnR, Rovo Ops Agent, Provisioner Publisher, Walmart supplier insights)
- `patents` — the eight, titles only
- `publications` — AsML 2022, MLOps framework 2023, GIDS 2025
- `talks` — GIDS 2025, plus Cypher if accepted
- `writing` — the LinkedIn article just published

After filling `work` and `patents`, add the matching entries to the `NAV`
array in `app/page.tsx` and import the section components.

## Design notes

Two colours do the work: `--color-signal` (deep cobalt) and `--color-noise`
(cool grey). That pairing is the subject of the site, not decoration. Signal
is used sparingly and only ever means "this is the thing that matters".

Mono type is reserved for data: years, counts, venues. If something is not
data, it is not mono.

The alert lane in the hero is the one moment of motion on the page. It respects
`prefers-reduced-motion`. Do not add a second animated element; the restraint
around it is what makes it land.

## Quality floor

Responsive to mobile, visible keyboard focus rings, reduced motion respected,
semantic landmarks, static prerender.
