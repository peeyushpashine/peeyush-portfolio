import { work } from "@/lib/content";
import Section from "./Section";

export default function Work() {
  if (work.length === 0) return null;
  return (
    <Section id="work" title="Selected work">
      <ul className="space-y-px">
        {work.map((w) => (
          <li key={w.name} className="border-t border-rule py-7">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h3 className="text-base font-medium">{w.name}</h3>
              <span className="eyebrow">{w.where}</span>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">{w.blurb}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {w.tags.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-rule px-3 py-1 font-mono text-[0.6875rem] tracking-wide text-ink-soft"
                >
                  {t}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
