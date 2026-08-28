"use client";

import { useEffect, useRef } from "react";
import { GISCUS } from "@/lib/site";

/**
 * Comments, backed by GitHub Discussions through giscus.
 *
 * The only third party embed on the site, chosen because it needs no backend,
 * no database and no moderation tooling: GitHub owns the identity, the spam
 * handling and the blocking. Readers here all have a GitHub account, so the
 * sign-in requirement filters rather than blocks.
 *
 * Renders nothing until `categoryId` is configured, so an unconfigured deploy
 * shows no empty shell.
 */
export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (!GISCUS.categoryId || loaded.current || !ref.current) return;
    loaded.current = true;

    const s = document.createElement("script");
    s.src = "https://giscus.app/client.js";
    s.async = true;
    s.crossOrigin = "anonymous";
    Object.entries({
      "data-repo": GISCUS.repo,
      "data-repo-id": GISCUS.repoId,
      "data-category": GISCUS.category,
      "data-category-id": GISCUS.categoryId,
      // One discussion per article, keyed on the URL path.
      "data-mapping": "pathname",
      "data-strict": "1",
      // Reactions give a clap-like affordance without a counter on the page.
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": "light",
      "data-lang": "en",
      "data-loading": "lazy",
    }).forEach(([k, v]) => s.setAttribute(k, v));

    ref.current.appendChild(s);
  }, []);

  if (!GISCUS.categoryId) return null;

  return (
    <section className="mt-20 border-t border-rule pt-10">
      <h2 className="eyebrow">Responses</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
        If one of these diagnostics fires on something you own, I would like to hear what you
        found. Signing in with GitHub posts to this site&apos;s discussions.
      </p>
      <div ref={ref} className="mt-8" />
    </section>
  );
}
