/**
 * One place to change when the custom domain lands.
 * Everything else (sitemap, RSS, canonical tags, OG images) reads from here.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://peeyush-portfolio-sepia.vercel.app";

/**
 * Giscus comments, backed by GitHub Discussions on this repo.
 * `repoId` is the repository's GraphQL node id, already known.
 * `categoryId` comes from https://giscus.app after Discussions is enabled and the
 * giscus app is installed. The comment section renders nothing until it is set,
 * so this is safe to ship half-configured.
 */
export const GISCUS = {
  repo: "peeyushpashine/peeyush-portfolio",
  repoId: "R_kgDOUAhwGg",
  category: "Announcements",
  categoryId: "DIC_kwDOUAhwGs4DEa43",
};
