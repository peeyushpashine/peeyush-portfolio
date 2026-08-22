import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const DIR = path.join(process.cwd(), "content/articles");

export type ArticleMeta = {
  slug: string;
  title: string;
  standfirst: string;
  date: string;
  readingMinutes: number;
  /** Where it first appeared, if anywhere. Shown as a small credit line. */
  originallyAt?: string;
  originallyUrl?: string;
  draft?: boolean;
};

export type Article = ArticleMeta & { html: string };

function readSlugs(): string[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

function parse(slug: string): Article {
  const raw = fs.readFileSync(path.join(DIR, `${slug}.md`), "utf8");
  const { data, content } = matter(raw);

  const words = content.trim().split(/\s+/).length;

  return {
    slug,
    title: String(data.title ?? slug),
    standfirst: String(data.standfirst ?? ""),
    date: String(data.date ?? ""),
    readingMinutes: Math.max(1, Math.round(words / 220)),
    originallyAt: data.originallyAt ? String(data.originallyAt) : undefined,
    originallyUrl: data.originallyUrl ? String(data.originallyUrl) : undefined,
    draft: Boolean(data.draft),
    html: marked.parse(content, { async: false }) as string,
  };
}

/** Published articles, newest first. Drafts never ship. */
export function getArticles(): Article[] {
  return readSlugs()
    .map(parse)
    .filter((a) => !a.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticle(slug: string): Article | null {
  try {
    const a = parse(slug);
    return a.draft ? null : a;
  } catch {
    return null;
  }
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
