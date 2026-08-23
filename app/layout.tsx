import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { person, roles, education } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${person.name}, ML Engineer`,
    template: `%s | ${person.name}`,
  },
  description: person.summary,
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
  openGraph: {
    siteName: person.name,
    locale: "en_GB",
    type: "profile",
  },
  twitter: { card: "summary_large_image" },
};

/** Person schema: this is what makes a name search resolve to you correctly. */
function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    url: SITE_URL,
    email: `mailto:${person.email}`,
    jobTitle: roles[0]?.title,
    worksFor: { "@type": "Organization", name: roles[0]?.org },
    address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
    alumniOf: education.map((e) => ({ "@type": "EducationalOrganization", name: e.school })),
    sameAs: [person.linkedin, person.github].filter(Boolean),
    knowsAbout: [
      "Machine learning engineering",
      "MLOps",
      "Multi-agent systems",
      "Alert classification",
      "Large language models",
    ],
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} ${mono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()) }}
        />
        {children}
      </body>
    </html>
  );
}
