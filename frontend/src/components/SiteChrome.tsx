import type { ReactNode } from "react";

import { loadCategories, loadServices, loadSettings } from "@/lib/data";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

import { Analytics } from "./Analytics";
import { FloatingContact } from "./FloatingContact";
import { JsonLd } from "./JsonLd";
import { QuoteBasketProvider } from "./QuoteBasket";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/** Header, footer, contact buttons and site-wide structured data around
 * every public page (the dashboard has its own layout). */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const [settings, categories, services] = await Promise.all([loadSettings(), loadCategories(), loadServices()]);
  return (
    <>
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
    </>
  );
}
