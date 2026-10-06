import Link from "next/link";

import type { SiteSettings, Testimonial } from "@/lib/types";

import { Container } from "./Section";

function Stars({ rating }: { rating: number }) {
  return (
    <p className="text-orange" aria-label={`${rating} out of 5`}>
      <span aria-hidden="true">{"★".repeat(rating)}</span>
      <span aria-hidden="true" className="text-line">{"★".repeat(5 - rating)}</span>
    </p>
  );
}

/** Real customer testimonials (published with consent in the admin). With
 * none published yet, it invites feedback instead of inventing any. No
 * review structured data is emitted: self-published reviews are not
 * eligible for Google review snippets. */
export function Testimonials({
  testimonials,
  settings,
  title = "What our customers say",
}: {
  testimonials: Testimonial[];
  settings: SiteSettings;
  title?: string;
}) {
  return (
    <section aria-labelledby="testimonials-title" className="py-16">
      <Container>
        <span aria-hidden="true" className="block h-1 w-12 rounded bg-orange" />
        <h2 id="testimonials-title" className="mt-3 font-display text-3xl font-extrabold text-navy">
          {title}
        </h2>

        {testimonials.length > 0 ? (
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <li key={t.id}>
                <figure className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-sm">
                  {t.rating ? <Stars rating={t.rating} /> : null}
                  <blockquote className="mt-3 flex-1 text-lg text-ink">
                    <p>&ldquo;{t.quote}&rdquo;</p>
                  </blockquote>
                  <figcaption className="mt-5 border-t border-line pt-4 text-sm">
                    <span className="block font-semibold text-navy">{t.customer_name}</span>
                    {(t.customer_role || t.location) && (
                      <span className="text-slate">{[t.customer_role, t.location].filter(Boolean).join(" · ")}</span>
                    )}
                    {t.service && (
                      <Link href={`/services/${t.service.slug}`} className="mt-1 block text-xs font-semibold text-orange-600 hover:underline">
                        {t.service.name}
                      </Link>
                    )}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              { title: "Pizza ovens", text: "Built, repaired or supplied by us? Tell others how it went." },
              { title: "Roof cyclones", text: "Installed or repaired cyclones with us? We'd love your feedback." },
              { title: "Materials & delivery", text: "Bought materials or had them delivered? Share your experience." },
            ].map((card) => (
              <div key={card.title} className="flex flex-col rounded-2xl border-2 border-dashed border-line bg-mist p-6">
                <p className="text-orange" aria-hidden="true">★★★★★</p>
                <p className="mt-2 font-display text-lg font-bold text-navy">{card.title}</p>
                <p className="mt-1 flex-1 text-slate">{card.text}</p>
                <p className="mt-4 text-sm font-semibold text-slate">Your review could appear here.</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          {settings.google_review_url && (
            <a
              href={settings.google_review_url}
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center rounded-full bg-orange px-6 font-bold text-navy hover:bg-orange-600"
            >
              Review us on Google
            </a>
          )}
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center rounded-full border-2 border-navy px-6 font-bold text-navy hover:bg-navy hover:text-white"
          >
            Share your feedback
          </Link>
        </div>
      </Container>
    </section>
  );
}
