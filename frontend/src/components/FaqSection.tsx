import { JsonLd } from "./JsonLd";

export interface Faq {
  question: string;
  answer: string;
}

/** Visible FAQ accordion with matching FAQPage structured data. The markup
 * mirrors exactly what is shown on the page. */
export function FaqSection({
  faqs,
  title = "Frequently asked questions",
  id = "faq",
  withSchema = true,
}: {
  faqs: Faq[];
  title?: string;
  id?: string;
  /** Set false when the page publishes one combined FAQPage itself. */
  withSchema?: boolean;
}) {
  if (!faqs.length) return null;
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="font-display text-2xl font-bold text-navy">
        {title}
      </h2>
      <div className="mt-4 divide-y divide-line rounded-xl border border-line bg-white">
        {faqs.map((faq, index) => (
          <details key={faq.question} className="group p-5" open={index === 0}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-semibold text-navy">
              <h3 className="text-base">{faq.question}</h3>
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mist text-lg leading-none transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-ink">{faq.answer}</p>
          </details>
        ))}
      </div>
      {withSchema && (
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      )}
    </section>
  );
}
