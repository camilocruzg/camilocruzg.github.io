# Website Workflow

1. **Add or update posts**
   - Create or edit an MDX file under `content/posts/`.
   - Include front matter: `title`, `description`, `publishedAt`, `tags` (optional), and `coverImage` (optional).
   - Write your post content in Markdown, include images from `public/images/`, and commit the file.

2. **Document other projects**
   - Place each project note inside `content/projects/` with front matter containing `title`, `description`, `status`, `tools`, and `coverImage` if needed.
   - Keep the Markdown body short, mention key takeaways, and commit.

3. **Sync publications**
   - Set `ORCID_ID` in your shell (`export ORCID_ID=0000-0000-0000-0000`).
   - Run `npm run sync-publications` to refresh `data/publications.json` from ORCID.
   - Commit the updated JSON if new entries appear.

4. **Update the bio or CV**
   - Edit `app/bio/page.tsx` to refresh the written highlights or interests.
   - Replace `public/camilo-cv.txt` with `camilo-cv.pdf` (keep the filename consistent) to preserve the download link.

5. **Preview locally**
   - Run `npm run dev` and visit `http://localhost:3000` to verify changes across Updates, Publications, Bio, and Other Projects pages.

6. **Publish**
   - Commit and push to `main`. The GitHub Actions workflow runs `npm run export && npm run deploy` to publish to GitHub Pages automatically.
   - Alternatively, run `npm run export` and `npm run deploy` manually if you prefer local control.
