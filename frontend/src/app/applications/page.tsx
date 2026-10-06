import Link from "next/link";

import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ArrowRightIcon } from "@/components/Icons";
import { Container, PageHero } from "@/components/Section";
import { getApplications } from "@/lib/api";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Pizza Oven Projects",
  description:
    "Materials and planning considerations for new pizza oven builds, oven repair and relining, pizzerias and restaurants, and home pizza ovens.",
  path: "/applications",
});

export default async function ApplicationsPage() {
  const applications = await getApplications();
  return (
    <>
      <PageHero
        title="Pizza oven projects"
        breadcrumbs={<Breadcrumbs items={[{ name: "Oven projects", href: "/applications" }]} />}
      >
        <p>
          Start from the job you are doing. Each page explains what to plan for and lists the materials — and you can
          always ask us to do the work.
        </p>
      </PageHero>
      <Container className="py-10">
        <ul className="grid gap-5 md:grid-cols-2">
          {applications.map((application) => (
            <li key={application.slug} className="flex flex-col rounded-xl border border-line bg-white p-6">
              <h2 className="font-display text-2xl font-bold text-navy">
                <Link href={`/applications/${application.slug}`} className="hover:underline">
                  {application.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate">
                {application.product_count} related product{application.product_count === 1 ? "" : "s"}
              </p>
              <p className="mt-3 text-slate">{application.summary}</p>
              <Link
                href={`/applications/${application.slug}`}
                className="mt-auto inline-flex items-center gap-1 pt-4 font-semibold text-navy hover:underline"
                aria-label={`Read about ${application.name}`}
              >
                Selection guide and products <ArrowRightIcon />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
