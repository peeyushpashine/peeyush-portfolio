import { awards, education } from "@/lib/content";

export default function Closing() {
  return (
    <div className="mt-24 grid gap-10 border-t border-rule pt-10 sm:grid-cols-2">
      <div>
        <h3 className="eyebrow">Recognition</h3>
        <ul className="mt-4 space-y-4">
          {awards.map((a) => (
            <li key={a.title} className="text-sm leading-relaxed">
              <span className="font-medium">{a.title}</span>
              <span className="eyebrow ml-2">{a.where}</span>
              <p className="mt-1 text-ink-soft">{a.note}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="eyebrow">Education</h3>
        <ul className="mt-4 space-y-4">
          {education.map((e) => (
            <li key={e.degree} className="text-sm leading-relaxed">
              <span className="font-medium">{e.degree}</span>
              <p className="mt-1 text-ink-soft">
                {e.school}
                <span className="eyebrow ml-2 tabular-nums">{e.year}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
