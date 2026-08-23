import { ImageResponse } from "next/og";
import { getArticle, getArticles, formatDate } from "@/lib/articles";
import { person } from "@/lib/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);
  const title = article?.title ?? person.name;
  const meta = article
    ? `${formatDate(article.date)}  \u00b7  ${article.readingMinutes} min read`
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fafaf8",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#0b3d91" }} />
            <div style={{ fontSize: 24, color: "#545a68" }}>{meta}</div>
          </div>
          <div
            style={{
              fontSize: 60,
              fontWeight: 700,
              color: "#14161a",
              letterSpacing: -1.5,
              lineHeight: 1.12,
              marginTop: 28,
              maxWidth: 960,
            }}
          >
            {title}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ width: 96, height: 3, background: "#0b3d91" }} />
          <div style={{ fontSize: 26, color: "#14161a", fontWeight: 600 }}>{person.name}</div>
          <div style={{ fontSize: 22, color: "#545a68" }}>Lead ML Engineer, Atlassian</div>
        </div>
      </div>
    ),
    size
  );
}
