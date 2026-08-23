import { patents, publications, talks } from "@/lib/content";
import Section from "./Section";

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-rule pt-6">
      <h3 className="eyebrow">{label}</h3>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function Research() {
  if (patents.length + publications.length + talks.length === 0) return null;

  return (
    <Section id="research" title="Patents, papers and talks">
      <div className="space-y-10">
        {patents.length > 0 && (
          <Group label={`${patents.length} patents`}>
            <ol className="space-y-3">
              {patents.map((p, i) => (
                <li key={p.title} className="flex gap-4 text-sm leading-relaxed">
                  <span className="font-mono text-xs tabular-nums text-noise">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="max-w-2xl">
                    {p.title}
                    <span className="eyebrow ml-2">{p.status}</span>
                    {p.refs && (
                      <span className="mt-1 block font-mono text-[0.6875rem] text-noise">
                        {p.refs.join("  ·  ")}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ol>
          </Group>
        )}

        {publications.length > 0 && (
          <Group label="Publications">
            <ul className="space-y-4">
              {publications.map((p) => (
                <li key={p.title} className="text-sm leading-relaxed">
                  {p.href ? (
                    <a className="font-medium text-signal underline-offset-4 hover:underline" href={p.href} target="_blank" rel="noreferrer">
                      {p.title}
                    </a>
                  ) : (
                    <span className="font-medium">{p.title}</span>
                  )}
                  <span className="eyebrow ml-2 tabular-nums">
                    {p.venue}
                    {p.year ? `, ${p.year}` : ""}
                    {p.status ? ` · ${p.status}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </Group>
        )}

        {talks.length > 0 && (
          <Group label="Talks">
            <ul className="space-y-4">
              {talks.map((t) => (
                <li key={t.title} className="text-sm leading-relaxed">
                  {t.href ? (
                    <a className="font-medium text-signal underline-offset-4 hover:underline" href={t.href} target="_blank" rel="noreferrer">
                      {t.title}
                    </a>
                  ) : (
                    <span className="font-medium">{t.title}</span>
                  )}
                  <span className="eyebrow ml-2 tabular-nums">{t.venue}, {t.year}</span>
                </li>
              ))}
            </ul>
          </Group>
        )}
      </div>
    </Section>
  );
}
