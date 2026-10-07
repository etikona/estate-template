import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { site } from "@/site.config";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.seo.title, template: `%s | ${site.name}` },
  description: site.seo.description,
  keywords: site.seo.keywords,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    url: site.url,
    images: site.seo.ogImage ? [{ url: site.seo.ogImage, width: 1600, height: 900, alt: site.name }] : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    images: site.seo.ogImage ? [site.seo.ogImage] : undefined,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: site.theme.background,
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: site.name,
  url: site.url,
  description: site.seo.description,
  telephone: site.contact.phone,
  email: site.contact.email,
  image: site.seo.ogImage,
  address: { "@type": "PostalAddress", streetAddress: site.contact.address },
  sameAs: site.social.map((s) => s.href),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const t = site.theme;
  const themeVars = {
    "--background": t.background,
    "--foreground": t.foreground,
    "--muted": t.muted,
    "--accent": t.accent,
    "--border": t.border,
    "--surface": t.surface,
    "--dark": t.dark,
    "--radius": t.radius,
  } as React.CSSProperties;

  return (
    <html lang="en" style={themeVars}>
      <head>
        {/* Without JavaScript, never hide content behind the intro or animation start states */}
        <noscript>
          <style>{`.preloader{display:none!important}[data-hero-line],[data-hero-fade],[data-nav-item]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
