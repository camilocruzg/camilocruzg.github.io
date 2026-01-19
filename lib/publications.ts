import fs from "node:fs/promises";
import path from "node:path";

export type Publication = {
  title: string;
  year?: number | string;
  venue?: string;
  url?: string;
  type?: string;
  doi?: string;
  summary?: string;
  authors?: string[];
};

type PublicationsResult = {
  records: Publication[];
  sourcePath: string;
};

const CANDIDATE_FILES = [
  "data/publications-from-bib.json",
  "data/publications.json",
];

const resolveCandidate = (candidate: string) =>
  path.join(process.cwd(), candidate);

const getExistingCandidate = async () => {
  for (const candidate of CANDIDATE_FILES) {
    try {
      await fs.access(resolveCandidate(candidate));
      return candidate;
    } catch {
      // not there yet
    }
  }
  return CANDIDATE_FILES[CANDIDATE_FILES.length - 1];
};

export async function getPublications(): Promise<PublicationsResult> {
  const candidate = await getExistingCandidate();
  const resolved = resolveCandidate(candidate);

  try {
    const payload = await fs.readFile(resolved, "utf8");
    return {
      records: JSON.parse(payload) as Publication[],
      sourcePath: candidate,
    };
  } catch (error) {
    console.warn(`Unable to read ${candidate}`, error);
    return { records: [], sourcePath: candidate };
  }
}
