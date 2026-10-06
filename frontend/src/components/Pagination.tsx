import Link from "next/link";

export function Pagination({
  page,
  numPages,
  basePath,
  params,
}: {
  page: number;
  numPages: number;
  basePath: string;
  params: Record<string, string | undefined>;
}) {
  if (numPages <= 1) return null;
  const href = (p: number) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (value) search.set(key, value);
    if (p > 1) search.set("page", String(p));
    const text = search.toString();
    return text ? `${basePath}?${text}` : basePath;
  };
  const pages = Array.from({ length: numPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === numPages || Math.abs(p - page) <= 1,
  );
  const linkClass = "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border px-3 font-semibold";
  return (
    <nav aria-label="Pagination" className="mt-10 flex justify-center">
      <ul className="flex flex-wrap items-center gap-2">
        {page > 1 && (
          <li>
            <Link href={href(page - 1)} rel="prev" className={`${linkClass} border-line text-navy hover:bg-mist`}>
              Previous
            </Link>
          </li>
        )}
        {pages.map((p, index) => (
          <li key={p} className="flex items-center gap-2">
            {index > 0 && p - pages[index - 1] > 1 && <span aria-hidden="true">…</span>}
            <Link
              href={href(p)}
              aria-current={p === page ? "page" : undefined}
              className={`${linkClass} ${p === page ? "border-navy bg-navy text-white" : "border-line text-navy hover:bg-mist"}`}
            >
              <span className="sr-only">Page </span>
              {p}
            </Link>
          </li>
        ))}
        {page < numPages && (
          <li>
            <Link href={href(page + 1)} rel="next" className={`${linkClass} border-line text-navy hover:bg-mist`}>
              Next
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
