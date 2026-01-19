This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
# Personal Website

This is a custom Next.js + Tailwind site with Markdown content, a publications feed, and pages for your bio and side projects. Everything exports statically so it can be hosted on GitHub Pages and re-published on every push.

## Workspace overview

- `/content/posts/*.mdx` powers the **Updates** home page; add Markdown posts with `title`, `description`, `publishedAt`, `tags`, and inline images that live in `/public/images`.
- `/content/projects/*.mdx` feeds the **Other Projects** page (game dev sketches, dashboards, spare-time builds).
- `/data/publications.json` (or `data/publications-from-bib.json` when present) backs the Publications page. Run `ORCID_ID=0000-0000-0000-0000 npm run sync-publications` to refresh it from your ORCID record.
- `/content/bio/bio.mdx` now drives the **Bio** page, so you can edit that file directly and let the layout render whatever sections you need.
- If you download a BibTeX export, drop it in `data/publications.bib` and run `npm run convert-bibtex` (or `node scripts/bibtex-to-json.mjs data/publications.bib data/publications-from-bib.json`) to get the same JSON structure; use the generated file in place of `data/publications.json` or merge the output before deploying.
- `/public/camilo-cv.txt` is a placeholder CV (rename it to `camilo-cv.pdf` and swap the link when you have a PDF version).

## Development

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) while you work.

## Content workflow

1. Write new updates in `content/posts/` using Markdown. Front matter fields include `title`, `description`, `publishedAt`, optional `coverImage`, and `tags`.
2. Document side projects in `content/projects/`. Each document should set `title`, `description`, `status`, `tools`, and an optional `coverImage`, then include short notes in the Markdown body.
3. Refresh academic publications via `npm run sync-publications` (set your `ORCID_ID` first). The script writes to `data/publications.json`, and the Publications page picks it up on the next build.

## Deploying to GitHub Pages

1. Ensure the repo’s GitHub Pages source is set to the `gh-pages` branch (create it by running `npm run deploy` once).
2. Push changes to `main`; your CI or local workflow should run `npm run export` and `npm run deploy` to publish the `out/` directory.
3. Optionally add a GitHub Actions workflow that executes `npm ci && npm run export && npm run deploy` on pushes to `main`.

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the local dev server |
| `npm run build` | Runs the Next.js production build |
| `npm run export` | Exports a static site to `out/` |
| `npm run deploy` | Publishes `out/` to GitHub Pages via `gh-pages` |
| `npm run sync-publications` | Fetches your ORCID works and rewrites `data/publications.json` |
| `npm run convert-bibtex` | Converts `data/publications.bib` into the JSON feed format |

Drop your CV inside `public/` and keep the filename the same to keep the download link working.
