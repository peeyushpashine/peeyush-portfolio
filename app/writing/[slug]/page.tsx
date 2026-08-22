import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getArticle, getArticles, formatDate } from "@/lib/articles";
import { person } from "@/lib/content";

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: `${article.title} — ${person.name}`,
    description: article.standfirst,
    openGraph: {
      title: article.title,
      description: article.standfirst,
      type: "article",
      publishedTime: article.date,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 pb-32 sm:px-10">
      <nav className="pt-10">
        <Link href="/#writing" className="eyebrow transition-colors hover:text-signal">
          ← {person.name}
        </Link>
      </nav>

      <article className="pt-14">
        <header>
          <p className="eyebrow tabular-nums">
            {formatDate(article.date)}
            <span className="mx-2 text-noise">/</span>
            {article.readingMinutes} min read
          </p>
          <h1 className="mt-5 text-[2rem] font-semibold leading-[1.12] tracking-[-0.02em] sm:text-[2.5rem]">
            {article.title}
          </h1>
          {article.standfirst && (
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">{article.standfirst}</p>
          )}
        </header>

        <div className="prose mt-14" dangerouslySetInnerHTML={{ __html: article.html }} />

        {article.originallyAt && article.originallyUrl && (
          <p className="eyebrow mt-20 border-t border-rule pt-6">
            First published on{" "}
            <a
              className="text-signal underline-offset-4 hover:underline"
              href={article.originallyUrl}
              target="_blank"
              rel="noreferrer"
            >
              {article.originallyAt}
            </a>
          </p>
        )}
      </article>
    </div>
  );
}
