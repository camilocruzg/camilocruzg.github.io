import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { toJSON } = require('bibtex-parse-js');
const parse = toJSON;

const argv = process.argv.slice(2);
const inputPath = path.resolve(process.cwd(), argv[0] ?? 'data/publications.bib');
const outputPath = path.resolve(process.cwd(), argv[1] ?? 'data/publications-from-bib.json');

const TYPE_MAP = {
  article: 'journal-article',
  inproceedings: 'conference-paper',
  incollection: 'book-chapter',
  conference: 'conference-paper',
  inbook: 'book-chapter',
  phdthesis: 'dissertation',
  "master'sthesis": 'dissertation',
  techreport: 'report',
  misc: 'other',
};

const normalizeTags = (tags) => {
  const normalized = {};
  for (const [rawKey, rawValue] of Object.entries(tags ?? {})) {
    normalized[rawKey.toLowerCase()] = Array.isArray(rawValue) ? rawValue.join(' ') : rawValue;
  }
  return normalized;
};

const parseAuthors = (authorField) => {
  if (!authorField) return [];
  return authorField
    .split(/\s+and\s+/i)
    .map((author) => author.trim())
    .filter(Boolean);
};

const loadEntries = async () => {
  const raw = await readFile(inputPath, 'utf8');
  return parse(raw);
};

const formatEntry = (entry) => {
  const tags = normalizeTags(entry.entryTags);
  const authors = parseAuthors(tags.author ?? tags.authors);
  const title = tags.title?.trim() ?? '';
  const year = tags.year?.trim() ?? '';
  const venue =
    tags.journal ?? tags.booktitle ?? tags.publisher ?? tags.organization ?? tags.school ?? '';
  const doi = tags.doi?.trim() ?? '';
  const url = (tags.url?.trim() || (doi ? `https://doi.org/${doi}` : '')).trim();
  const summary = tags.summary?.trim() ?? '';
  const type = TYPE_MAP[entry.entryType.toLowerCase()] ?? 'other';

  return {
    title,
    year,
    venue: venue?.trim() ?? '',
    authors,
    type,
    summary,
    ...(doi && { doi }),
    ...(url && { url }),
  };
};

const main = async () => {
  const entries = await loadEntries();
  const records = entries.map((entry) => formatEntry(entry));
  await writeFile(outputPath, JSON.stringify(records, null, 2) + '\n');
  console.log(`Converted ${records.length} entries to ${outputPath}`);
};

main().catch((error) => {
  console.error('Failed to convert BibTeX:', error);
  process.exit(1);
});