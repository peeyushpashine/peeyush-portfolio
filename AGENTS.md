<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

---

# Working on this repo

Personal site for Peeyush Pashine. Next.js 16 (App Router), Tailwind v4,
TypeScript, static, deployed on Vercel. No backend, no database, no CMS.

Read this before changing anything. Most of what follows is a decision that was
already argued about, not a default.

## Who this is for

Frontier lab engineers, senior hiring committees at large tech companies, and
GenAI founders. The site is a **conversion surface, not a discovery surface**:
someone reads an article, clicks the author, and decides in about eight seconds
whether to send a message. Nobody arrives here from search except by name.

Consequence: precision matters more than volume, and a technical error costs far
more than a dull sentence.

## The design idea

The organising concept is **signal and noise**, which is the actual problem
Peeyush works on. Two colours carry the whole page:

- `--color-signal` (deep cobalt `#0b3d91`) only ever means "this matters"
- `--color-noise` (cool grey `#c7cad2`) is everything filtered out

Do not add a third accent colour. The two-colour discipline is the concept.

Type: Archivo for everything, JetBrains Mono **reserved strictly for data**
(years, counts, venues, patent numbers). If something is not data, it is not mono.

**Motion budget: one element.** The journey lane in the hero (`Journey.tsx`) is
the only animated thing on the site and respects `prefers-reduced-motion`. Adding
a second animated element breaks the restraint that makes the first one land. Do
not add scroll reveals, hover lifts, or gradient washes.

## Architecture

- `lib/content.ts` — **every word on the site except articles.** Components read
  from it. Sections return `null` when their array is empty, so a half-finished
  section never ships as an empty heading.
- `lib/site.ts` — base URL, single source. Change on custom domain.
- `lib/articles.ts` — markdown loading, frontmatter, reading time.
- `content/articles/*.md` — one file per article. Filename is the URL slug.
- `components/` — one per section. `Section.tsx` is the shared heading wrapper.
- `app/opengraph-image.tsx` and `app/writing/[slug]/opengraph-image.tsx` —
  generated cards. Every future article gets one with no extra work.

## Adding an article

Drop a `.md` file in `content/articles/`. That is the whole workflow.

```markdown
---
title: "Title"
standfirst: "One sentence that earns the click."
date: "2026-09-05"
originallyAt: "LinkedIn"          # optional
originallyUrl: "https://..."      # optional
draft: true                        # optional, hides it everywhere
---
```

`draft: true` excludes it from the index, routes, sitemap and static generation,
so work in progress can be committed safely.

Images go in `public/diagrams/`, referenced root-relative:
`![Alt text](/diagrams/name.png)`.

## Writing rules

**No em-dashes anywhere.** Not in article copy, not in site copy, not in
component text. Use commas, colons, full stops or parentheses. Grep for the
character before committing.

Other constraints on prose:
- No "It's not X, it's Y" more than once per piece
- No tricolons (three-item parallel lists)
- Keep hedges and specific unglamorous details; they are what make it read as human
- Register is direct and first person, technically confident without
  credentialing. Specifics do the work a job title would otherwise do.

## Disclosure

Work card copy is deliberately conservative: architectural patterns and approach
only. No internal thresholds, tenant counts, latency figures, revenue
attribution or unreleased roadmap. Peeyush works at Atlassian and previously
Walmart; assume anything not already in his public resume or a published talk is
not shareable.

When in doubt write the cautious version. He can loosen it; you cannot unpublish it.

## Deliberately absent

Do not add these without asking:

- **A roadmap or "what I'm working on next" section.** Reads as a todo list to a
  stranger and undercuts the finished-work impression.
- **The resume PDF link.** The current PDF opens with emoji and a "Value I bring
  on the table" section, a register mismatch with this page. It can live in
  `public/` but should not be linked until revised.
- **A GitHub link, if the profile is sparse.** An empty GitHub linked from a
  senior engineer's site is worse than no link.
- **Metrics that sound impressive but are unverifiable.**

## Comments

Giscus, backed by GitHub Discussions on this repo (`components/Comments.tsx`,
configured in `lib/site.ts`). The only third party embed on the site. It was
chosen because it adds no backend, no database and no moderation tooling: GitHub
owns identity, spam and blocking.

Claps were considered and rejected for now, on the same reasoning as the sparse
GitHub link below: a counter reading 2 is worse than no counter. Giscus reactions
give the same affordance without putting a number on the page.

## Deploy

Push to `main`. Vercel builds and deploys automatically. No environment
variables, no build configuration.

```bash
npm run dev     # localhost:3000
npm run build   # must pass before any push
```

Prerender errors in the OG image routes only surface at build time, so never
push without building.

## Known constraints

- OG images are rendered by Satori. Any `div` with more than one child needs an
  explicit `display: flex`. This will bite you.
- Google Fonts must be reachable at build time. Fine locally and on Vercel.

## Open items

- Publication links are empty. If proceedings URLs or a GIDS recording exist,
  add them; a linked talk is one of the strongest artifacts available.
- Seven patents listed. Only the retail allocation one has public reference
  numbers. All marked "Filed"; upgrade any that are granted, since granted is a
  materially stronger claim.
