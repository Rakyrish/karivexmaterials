import type { Metadata, Viewport } from "next";
import { Barlow, Inter } from "next/font/google";

import { Analytics } from "@/components/Analytics";
import { FloatingContact } from "@/components/FloatingContact";
import { JsonLd } from "@/components/JsonLd";
import { QuoteBasketProvider } from "@/components/QuoteBasket";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { NOINDEX_ALL, SITE_ORIGIN } from "@/lib/config";
import { loadCategories, loadServices, loadSettings } from "@/lib/data";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-barlow",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: {
    default: "KariVex Industrial Materials | Pizza Ovens & Roof Cyclones",
    template: "%s | KariVex",
  },
  applicationName: "KariVex Industrial Materials",
  robots: NOINDEX_ALL ? { index: false, follow: false } : undefined,
  // Search Console / Bing Webmaster verification tokens (set in the environment).
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  keywords: [
    "pizza oven materials Kenya",
    "fire bricks Nairobi",
    "pizza oven builders Nairobi",
    "pizza oven repair",
    "refractory cement Kenya",
    "roof cyclones Kenya",
    "roof cyclone installation",
    "turbine ventilator",
  ],
  category: "Construction materials",
  manifest: "/manifest.webmanifest",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#021533",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [settings, categories, services] = await Promise.all([loadSettings(), loadCategories(), loadServices()]);
  return (
    <html lang="en-KE" className={`${inter.variable} ${barlow.variable}`}>
      <body className="flex min-h-screen flex-col antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <QuoteBasketProvider>
          <SiteHeader settings={settings} />
          <main id="main" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter settings={settings} categories={categories} services={services} />
        </QuoteBasketProvider>
        <FloatingContact settings={settings} />
        <JsonLd data={organizationJsonLd(settings, services)} />
        <JsonLd data={websiteJsonLd(settings)} />
        <Analytics measurementId={settings.ga_measurement_id} />
      </body>
    </html>
  );
}
