"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Publication } from "@/lib/publications";

type SortDirection = "asc" | "desc";

const getYearValue = (pub: Publication) => {
  if (typeof pub.year === "number") return pub.year;
  if (typeof pub.year === "string") {
    const parsed = parseInt(pub.year, 10);
    return Number.isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const sortRecords = (records: Publication[], direction: SortDirection) => {
  return [...records].sort((a, b) => {
    const first = getYearValue(a);
    const second = getYearValue(b);
    if (first === second) {
      return a.title.localeCompare(b.title);
    }
    return direction === "asc" ? first - second : second - first;
  });
};

type Props = {
  publications: Publication[];
};

export default function PublicationsList({ publications }: Props) {
  const [direction, setDirection] = useState<SortDirection>("desc");
  const sorted = useMemo(() => sortRecords(publications, direction), [publications, direction]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="text-sm font-semibold text-[color:var(--muted)]">
          Sort publications
        </span>
        <div className="inline-flex divide-x rounded border border-[color:var(--foreground)]/20 bg-white/80">
          {(["desc", "asc"] as SortDirection[]).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setDirection(value)}
              className={`px-4 py-2 text-sm transition ${
                direction === value
                  ? "bg-[color:var(--foreground)]/10 font-semibold"
                  : "hover:bg-[color:var(--foreground)]/5"
              }`}
              aria-pressed={direction === value}
            >
              {value === "desc" ? "Newest first" : "Oldest first"}
            </button>
          ))}
        </div>
      </div>

      <ol className="space-y-4 list-decimal list-inside marker:font-semibold marker:text-[color:var(--muted)]">
        {sorted.map((pub) => {
          const year = getYearValue(pub);
          const displayAuthors =
            pub.authors && pub.authors.length > 0
              ? pub.authors.length > 3
                ? `${pub.authors.slice(0, 3).join(", ")}, et al.`
                : pub.authors.join(", ")
              : "Unknown authors";

          return (
            <li key={pub.title + pub.year} className="pl-2">
              <div className="space-y-1 text-base text-[color:var(--foreground)]">
                <div className="font-semibold leading-snug">
                  {pub.title}
                </div>
                <div className="text-sm text-[color:var(--muted)] space-y-0.5">
                  <div>{displayAuthors}</div>
                  <div className="flex flex-wrap gap-3 items-center">
                    {pub.venue && (
                      <span className="italic">{pub.venue}</span>
                    )}
                    {year > 0 && (
                      <span>({year})</span>
                    )}
                  </div>
                  {pub.summary && (
                    <p className="text-[color:var(--foreground)]/80 mt-2">
                      {pub.summary}
                    </p>
                  )}
                </div>
                {(pub.doi || pub.url) && (
                  <div className="flex flex-wrap gap-3 pt-2 text-sm">
                    {pub.doi && (
                      <Link
                        href={`https://doi.org/${pub.doi}`}
                        className="text-[color:var(--foreground)] underline decoration-dotted hover:decoration-solid"
                        target="_blank"
                        rel="noreferrer"
                      >
                        DOI: {pub.doi}
                      </Link>
                    )}
                    {pub.url && (
                      <Link
                        href={pub.url}
                        className="text-[color:var(--foreground)] underline decoration-dotted hover:decoration-solid"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View paper ↗
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
