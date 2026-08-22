"use client";

import { useEffect, useState } from "react";
import { person } from "@/lib/content";

type Item = { id: string; label: string };

export default function Rail({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-between lg:py-16">
      <div>
        <a href="#top" className="block">
          <span className="block text-[1.375rem] font-semibold leading-tight tracking-tight">
            {person.name}
          </span>
          <span className="eyebrow mt-2 block">Lead ML Engineer, Atlassian</span>
        </a>

        <nav className="mt-10 hidden lg:block">
          <ul className="space-y-3">
            {items.map((it) => {
              const on = active === it.id;
              return (
                <li key={it.id}>
                  <a
                    href={`#${it.id}`}
                    className="group flex items-center gap-3 text-sm transition-colors"
                    style={{ color: on ? "var(--color-ink)" : "var(--color-ink-soft)" }}
                  >
                    <span
                      className="h-px transition-all duration-300"
                      style={{
                        width: on ? 28 : 14,
                        background: on ? "var(--color-signal)" : "var(--color-noise)",
                      }}
                    />
                    {it.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="mt-10 hidden lg:block">
        <ul className="space-y-2 text-sm text-ink-soft">
          <li>
            <a className="transition-colors hover:text-signal" href={`mailto:${person.email}`}>
              Email
            </a>
          </li>
          <li>
            <a className="transition-colors hover:text-signal" href={person.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a className="transition-colors hover:text-signal" href={person.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
