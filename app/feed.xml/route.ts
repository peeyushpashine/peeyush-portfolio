import { getArticles } from "@/lib/articles";
import { person } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function GET() {
  const items = getArticles()
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${SITE_URL}/writing/${a.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/writing/${a.slug}</guid>
      <description>${esc(a.standfirst)}</description>
      <pubDate>${new Date(a.date).toUTCString()}</pubDate>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(person.name)}</title>
    <link>${SITE_URL}</link>
    <description>${esc(person.thesis)}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
