import { roles } from "@/lib/content";
import Section from "./Section";

export default function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="mt-2">
        {roles.map((r, i) => (
          <li
            key={`${r.org}-${r.title}`}
            className="grid gap-x-8 gap-y-2 border-t border-rule py-7 sm:grid-cols-[7rem_1fr]"
            style={{ borderTopWidth: i === 0 ? 1 : 1 }}
          >
            <div className="eyebrow pt-1 tabular-nums">
              {r.from}
              <span className="mx-1 text-noise">/</span>
              {r.to}
            </div>
            <div>
              <h3 className="text-base font-medium leading-snug">
                {r.title}
                <span className="text-ink-soft">, {r.org}</span>
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{r.note}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
