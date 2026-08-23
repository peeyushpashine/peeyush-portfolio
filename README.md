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

## Writing

Articles are markdown files in `content/articles/`. Adding one is the whole
workflow: drop in a `.md` file, push, done. No component changes.

```markdown
---
title: "Your title"
standfirst: "One sentence that makes someone want to read it."
date: "2026-09-05"
originallyAt: "LinkedIn"          # optional
originallyUrl: "https://..."      # optional
draft: true                        # optional, hides it everywhere
---

Body starts here.
```

The filename becomes the URL: `my-article.md` serves at `/writing/my-article`.

Reading time is computed from word count. Sorting is by date, newest first.
Anything marked `draft: true` is excluded from the index, the sitemap and
static generation, so you can commit work in progress safely.

### Images inside an article

Put them in `public/diagrams/` and reference with a root-relative path:

```markdown
![Alt text that describes the argument](/diagrams/your-image.png)
```

### Before you deploy

`content/articles/where-does-an-engineer-add-value.md` has a placeholder in
its frontmatter: replace `REPLACE_WITH_YOUR_LINKEDIN_URL` with the real
article URL. And export the two diagrams into `public/diagrams/` (see the
README in that folder).

## Reach layer

Everything below is already wired and needs no maintenance.

- **OG images** generated at build time from `app/opengraph-image.tsx` (home) and
  `app/writing/[slug]/opengraph-image.tsx` (per article). Every future article
  gets a card automatically. This is what LinkedIn and Twitter render when you
  paste a link.
- **JSON-LD**: Person schema sitewide, BlogPosting per article. This is what
  makes a search for your name resolve correctly.
- **`/sitemap.xml`, `/robots.txt`, `/feed.xml`** all generated from content.
- **Canonical URLs** on every page.

### When the custom domain lands

Change one line in `lib/site.ts`, or set `NEXT_PUBLIC_SITE_URL` in Vercel's
environment variables. Sitemap, RSS, canonical tags and OG metadata all follow.

### After deploying

Paste your URL into these to confirm the cards render:
- https://www.opengraph.xyz
- https://cards-dev.twitter.com/validator
- https://search.google.com/test/rich-results (for the JSON-LD)

### Resume PDF

Drop your PDF at `public/peeyush-pashine-resume.pdf` and it serves at
`/peeyush-pashine-resume.pdf`. Nothing links to it yet, by design: see the
note in the session 2 handover.
