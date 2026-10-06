import { ArticleLayout } from "@/components/ArticleLayout";
import { FaqSection } from "@/components/FaqSection";
import { JsonLd } from "@/components/JsonLd";
import { articleByHref } from "@/lib/articles";
import { absoluteUrl } from "@/lib/config";
import { loadSettings } from "@/lib/data";
import { IMAGES } from "@/lib/images";
import { pageMetadata } from "@/lib/seo";

const meta = articleByHref("/faq");

export const metadata = pageMetadata({
  title: "FAQ: Pizza Ovens, Roof Cyclones & Ordering",
  description: meta.description,
  path: meta.href,
  image: absoluteUrl(IMAGES[meta.imageKey].src.src),
});

export default async function Page() {
  const settings = await loadSettings();
  const ordering = [
    {
      question: "How do I get a price?",
      answer:
        "Add products to the quote basket and send one request, or use the request form on any service page. You can also call, WhatsApp or email us. Prices depend on the item, quantity and delivery location, so we quote each order.",
    },
    {
      question: "Where are you based?",
      answer: `Our warehouse is at ${settings.address_line}. Opening hours: ${settings.hours_text}.`,
    },
    {
      question: "Which areas do you serve?",
      answer: `We serve customers in ${settings.regions_served}. Delivery, building and installation are quoted for your location.`,
    },
    {
      question: "Do you deliver?",
      answer: "Yes. Delivery to your site is quoted with your order, based on location and quantity.",
    },
    {
      question: "How do I contact you?",
      answer: `Call ${settings.primary_phone}${settings.secondary_phone ? ` or ${settings.secondary_phone}` : ""}, WhatsApp us, or email ${settings.email}.`,
    },
  ];
  const pizza = [
    {
      question: "Do you build pizza ovens?",
      answer: "Yes. We build pizza ovens for pizzerias, restaurants, hotels, bakeries and homes, and quote each build individually.",
    },
    {
      question: "Do you repair pizza ovens?",
      answer: "Yes: cracked floors and domes, loose bricks, failed insulation and door seals. Send photos for an assessment.",
    },
    {
      question: "Can I buy the materials and build the oven myself?",
      answer: "Yes. We supply fire bricks, refractory mortar and cement, castable, insulation and door seals, and can help you estimate quantities.",
    },
    {
      question: "Why do pizza ovens need special bricks and cement?",
      answer: "Ordinary bricks and cement are not made for repeated high temperatures and can crack or crumble. Refractory materials are made for oven heat.",
    },
  ];
  const cyclones = [
    {
      question: "What roof cyclones do you sell?",
      answer: "We stock 600 mm (throat diameter) roof cyclones made of stainless steel.",
    },
    {
      question: "Do you install roof cyclones?",
      answer: "Yes. We supply and install them, fitting the base to your roof profile and sealing it against rain.",
    },
    {
      question: "Do you repair roof cyclones?",
      answer: "Yes: squeaking or wobbling heads, worn bearings, stuck cyclones and leaking bases. We can also replace a cyclone that is beyond repair.",
    },
    {
      question: "Do roof cyclones need electricity?",
      answer: "No. They are driven by the wind and rising warm air, so there is no running cost and they keep working during power cuts.",
    },
  ];
  return (
    <ArticleLayout meta={meta} intro={<p>Quick answers about ordering, delivery, pizza ovens and roof cyclones. Can&apos;t find yours? Contact us.</p>}>
      <FaqSection id="faq-ordering" title="Ordering and delivery" faqs={ordering} withSchema={false} />
      <FaqSection id="faq-pizza" title="Pizza ovens" faqs={pizza} withSchema={false} />
      <FaqSection id="faq-cyclones" title="Roof cyclones" faqs={cyclones} withSchema={false} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [...ordering, ...pizza, ...cyclones].map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
    </ArticleLayout>
  );
}
