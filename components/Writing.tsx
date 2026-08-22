import Link from "next/link";
import { getArticles, formatDate } from "@/lib/articles";
import Section from "./Section";

export default function Writing() {
  const articles = getArticles();
  if (articles.length === 0) return null;

  return (
    <Section id="writing" title="Writing">
      <ul>
        {articles.map((a) => (
          <li key={a.slug} className="border-t border-rule">
            <Link href={`/writing/${a.slug}`} className="group block py-7">
              <div className="grid gap-x-8 gap-y-2 sm:grid-cols-[7rem_1fr]">
                <p className="eyebrow pt-1 tabular-nums">{formatDate(a.date)}</p>
                <div>
                  <h3 className="text-base font-medium leading-snug transition-colors group-hover:text-signal">
                    {a.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
                    {a.standfirst}
                  </p>
                  <p className="eyebrow mt-3">{a.readingMinutes} min read</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
