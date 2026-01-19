import fs from "node:fs/promises";
import path from "node:path";

const ORCID_ID = process.env.ORCID_ID;
const OUTPUT_FILE = path.join(process.cwd(), "data", "publications.json");

if (!ORCID_ID) {
  console.warn("ORCID_ID is not set. Please export it before running this script.");
  process.exit(0);
}

const AGGREGATE_VENUES = ["web of science", "scopus", "crossref"];

const extractVenue = (summary) => {
  const candidates = [
    summary["journal-title"]?.value,
    summary["series-title"]?.value,
    summary["conference-name"]?.value,
    summary["publisher-name"]?.value,
    summary.source?.["source-name"]?.value,
  ];

  const filtered = candidates.filter(Boolean);
  for (const candidate of filtered) {
    const normalized = candidate.toLowerCase();
    if (!AGGREGATE_VENUES.some((agg) => normalized.includes(agg))) {
      return candidate;
    }
  }

  return filtered[0] ?? "Unknown";
};

const extractAuthors = (metadata) => {
  if (!metadata) {
    return [];
  }

  const contributors = metadata["contributors"]?.["contributor"] ?? [];
  const names = contributors
    .map((contributor) =>
      contributor["credit-name"]?.value ||
      contributor["contributor-orcid"]?.["path"] ||
      contributor["contributor-orcid"]?.["uri"] ||
      contributor["contributor-attributes"]?.["contributor-role"],
    )
    .filter(Boolean);

  if (names.length > 0) {
    return Array.from(new Set(names));
  }

  const citation = metadata["citation"]?.["citation-value"] ?? "";
  const citationMatch = citation.match(/author\s*=\s*\{([^}]*)\}/i);
  if (citationMatch) {
    return Array.from(
      new Set(
        citationMatch[1]
          .split(/\s+and\s+/i)
          .map((author) => author.trim())
          .filter(Boolean),
      ),
    );
  }

  return [];
};

const detailCache = new Map();

async function fetchWorkDetail(putCode) {
  if (!putCode) {
    return null;
  }

  if (detailCache.has(putCode)) {
    return detailCache.get(putCode);
  }

  const res = await fetch(`https://pub.orcid.org/v3.0/${ORCID_ID}/work/${putCode}`, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    return null;
  }

  const detail = await res.json();
  detailCache.set(putCode, detail);
  return detail;
}

async function fetchPublications() {
  const url = `https://pub.orcid.org/v3.0/${ORCID_ID}/works`;
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`ORCID request failed: ${res.status} ${res.statusText}`);
  }

  const payload = await res.json();
  const groups = payload.group ?? [];

  const workPromises = groups.map(async (entry) => {
    const summary = entry["work-summary"]?.[0] ?? {};
    const detail = await fetchWorkDetail(summary["put-code"]);
    const metadata = detail ?? summary;

    return {
      title: summary.title?.title?.value ?? "Untitled",
      year: summary["publication-date"]?.year?.value ?? undefined,
      venue: extractVenue(metadata),
      authors: extractAuthors(metadata),
      url: summary["put-code"]
        ? `https://orcid.org/${ORCID_ID}/work/${summary["put-code"]}`
        : undefined,
      type: summary.type?.toLowerCase() ?? "",
      doi: summary["external-ids"]?.["external-id"]?.find((id) =>
        id["external-id-type"]?.toLowerCase() === "doi",
      )?.["external-id-value"],
      summary:
        entry["work-summary"]?.[0]?.["work-title"]?.title?.value ?? "",
    };
  });

  return Promise.all(workPromises);
}

async function main() {
  try {
    const publications = await fetchPublications();
    await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
    await fs.writeFile(OUTPUT_FILE, JSON.stringify(publications, null, 2));
    console.log(`Wrote ${publications.length} publications to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error("Failed to sync publications", error);
    process.exit(1);
  }
}

main();
