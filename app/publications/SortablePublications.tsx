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

export default function SortablePublications({ publications }: Props) {
  const [direction, setDirection] = useState<SortDirection>("desc");
  const sorted = useMemo(() => sortRecords(publications, direction), [publications, direction]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[color:var(--muted)]">Sort publications</span>
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
      <div className="grid gap-5">
        {sorted.map((pub) => (
          <article
            key={pub.title + pub.year}
            className="group space-y-2 border border-[color:var(--foreground)]/10 bg-white/60 p-6 transition hover:border-[color:var(--foreground)]/30"
          >
            <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
              <span>{pub.venue ?? "Independent"}</span>
              <span>{getYearValue(pub)}</span>
            </div>
            <h3 className="text-2xl font-semibold text-[color:var(--foreground)] group-hover:text-black">
              {pub.title}
            </h3>
            {pub.authors?.length ? (
              <p className="text-sm text-[color:var(--muted)]">
                <span className="font-semibold text-[color:var(--foreground)]">Authors:&nbsp;</span>
                {pub.authors.slice(0, 4).join(", ")}
                {pub.authors.length > 4 ? ` + ${pub.authors.length - 4} more` : ""}
              </p>
            ) : null}
            <p className="text-base text-[color:var(--muted)]">{pub.summary}</p>
            <div className="flex flex-wrap gap-3 text-sm text-[color:var(--muted)]">
              {pub.doi && (
                <Link href={`https://doi.org/${pub.doi}`} className="underline" target="_blank" rel="noreferrer">
                  DOI
                </Link>
              )}
              {pub.url && (
                <Link href={pub.url} className="underline" target="_blank" rel="noreferrer">
                  View paper
                </Link>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}