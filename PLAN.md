# Implementation Plan: Publications, Post Creation, and Publishing

## Overview
This plan outlines the development of three interconnected features:
1. **Publications List View** - Replace card-based layout with a structured list
2. **Make Post CLI** - Template-based post creation with draft state
3. **Make Publish CLI** - Automated publishing workflow

---

## Feature 1: Publications List View

### Objective
Convert the publications display from card-based grid to a clean, scannable list format.

### Changes Required

#### 1.1 Update `app/publications/page.tsx`
- **Current state**: Uses `SortablePublications` client component with grid layout
- **Changes**:
  - Replace grid layout (`grid gap-6`) with vertical list layout
  - Display each publication as a table row or structured list item
  - Columns/fields: Year, Authors, Title, Venue, DOI/URL link
  - Keep sorting functionality (newest/oldest toggle)
  - Add optional filtering by year or venue
  - Improve readability for longer author lists

#### 1.2 Create new `components/PublicationsList.tsx`
- **Purpose**: Replace or refactor `SortablePublications`
- **Features**:
  - Render publications in tabular/list format
  - Display: `[Year] | Authors | Title | Venue | [Links]`
  - Responsive design (collapse to stacked layout on mobile)
  - Maintain sort controls
  - Optional: Add search/filter by title or author

#### 1.3 Styling Considerations
- Use table or semantic list markup
- Ensure print-friendly styling
- Better visual hierarchy
- Truncate long author lists with "et al." option

### Implementation Steps
1. Analyze current `SortablePublications` component
2. Create new `PublicationsList` component
3. Update `app/publications/page.tsx` to use new component
4. Test responsive behavior
5. Verify styling matches overall site design

---

## Feature 2: Make Post CLI Script

### Objective
Create a command-line tool to scaffold new blog posts with proper front matter and draft state.

### Files to Create

#### 2.1 `scripts/make-post.mjs`
- **Purpose**: Interactive post creation script
- **Language**: Node.js (ES modules)
- **Dependencies**: `fs/promises`, `path`, optional: `inquirer` or `prompts` for CLI input
- **Functionality**:
  - Prompt for post metadata:
    - `title` (required)
    - `description` (required)
    - `tags` (optional, comma-separated)
    - `coverImage` (optional, path relative to public/)
  - Auto-generate:
    - `slug` from title (kebab-case)
    - `publishedAt` as today's date
    - `draft` tag added automatically
  - Create file: `content/posts/YYYY-MM-DD-slug.mdx`
  - Include front matter template and basic markdown structure
  - Output confirmation with file path

#### 2.2 Post Template Structure
```mdx
---
title: "Your Post Title"
description: "One-sentence summary of the post"
publishedAt: "2025-12-16"
tags:
  - draft
  - your-tag
coverImage: '/images/posts/optional-cover.png'
---

## Introduction

Start your post content here...
```

#### 2.3 Package.json Script Entry
```json
"scripts": {
  "make:post": "node scripts/make-post.mjs",
  ...
}
```

### Implementation Steps
1. Create `scripts/make-post.mjs` with inquirer/prompts integration
2. Implement slug generation from title
3. Add file creation logic with front matter
4. Add to package.json scripts
5. Test: `npm run make:post`
6. Document usage in README

### User Workflow
```bash
$ npm run make:post
? Post title: My New Article
? Description: A brief description here
? Tags (comma-separated): feature,update
? Cover image path (optional): /images/posts/cover.png

✓ Created: content/posts/2025-12-16-my-new-article.mdx
```

---

## Feature 3: Make Publish CLI Script

### Objective
Automate the publishing workflow: identify publishable posts, build, and deploy.

### Files to Create

#### 3.1 `scripts/make-publish.mjs`
- **Purpose**: Orchestrate the entire publish workflow
- **Functionality**:
  1. **Scan Posts**: Read all posts in `content/posts/`
  2. **Filter Publishable**: Identify posts without "draft" tag
  3. **Update Timestamps**: Set `publishedAt` to current date if needed (optional)
  4. **Build**: Run `npm run build`
  5. **Deploy**: Run `npm run export && npm run deploy`
  6. **Git Integration** (optional):
     - Stage changed files
     - Commit with message
     - Push to repository
  7. **Report**: Output summary of published posts

#### 3.2 Workflow Logic
```
1. Validate state
   - Check if any posts are ready to publish
   - Warn if no publishable posts found

2. Dry run mode (optional flag)
   - Show what would be published without making changes
   - `npm run make:publish -- --dry-run`

3. Execute publish
   - Build static site
   - Copy to deploy directory
   - Optional: Git operations

4. Report results
   - List published posts
   - Show deployment status
```

#### 3.3 Package.json Script Entry
```json
"scripts": {
  "make:publish": "node scripts/make-publish.mjs",
  "make:publish:dry": "node scripts/make-publish.mjs --dry-run",
  ...
}
```

### Implementation Steps
1. Create `scripts/make-publish.mjs`
2. Implement post scanning and filtering logic
3. Add build/deploy orchestration
4. Add optional Git integration
5. Add dry-run mode for safety
6. Add logging and reporting
7. Test with sample posts
8. Document in README

### User Workflow
```bash
# Preview what will be published
$ npm run make:publish:dry
Posts ready to publish:
  - 2025-12-16-new-feature.mdx (1 day old)
  - 2025-12-15-update.mdx (2 days old)

# Actually publish
$ npm run make:publish
✓ Building...
✓ Exporting...
✓ Deploying...
✓ Published 2 posts

Deployed posts:
  - New Feature (2025-12-16)
  - Update (2025-12-15)
```

---

## Integration and Workflow

### Combined Post Creation → Publishing Workflow
```bash
# Create a new draft post
npm run make:post
# → content/posts/2025-12-16-my-post.mdx (with "draft" tag)

# Edit the post, remove "draft" tag when ready

# Check what's ready to publish
npm run make:publish:dry

# Publish to the website
npm run make:publish
```

### File Structure After Implementation
```
scripts/
├── make-post.mjs          # New: Post creation script
├── make-publish.mjs       # New: Publishing workflow script
├── sync-publications.mjs  # Existing
└── bibtex-to-json.mjs     # Existing

content/
├── posts/                 # Posts created via make:post
├── projects/              # Existing
└── bio/                   # Existing

app/
├── publications/
│   └── page.tsx          # Updated: List view
└── components/
    └── PublicationsList.tsx  # New: List component
```

---

## Dependencies and Considerations

### Required Packages
- Already available: `fs/promises`, `path`, `gray-matter`
- Optional to add: `inquirer` or `prompts` for better CLI UX
- Optional to add: `simple-git` for Git operations

### Edge Cases to Handle
1. **Duplicate slugs**: Check if file already exists before creating
2. **Empty posts directory**: Handle gracefully when no posts to publish
3. **Draft tag location**: Ensure robust detection (first in array?)
4. **Git conflicts**: Skip if repo not initialized
5. **Build failures**: Report and stop publishing flow

### Safety Features
- **Dry-run mode**: Always preview before publishing
- **Backup**: Keep recent backups before deploy
- **Rollback**: Document rollback procedure
- **Validation**: Check all posts have required front matter

---

## Implementation Priority

### Phase 1 (High Priority)
1. Publications List View
   - Quick visual improvement
   - No breaking changes
   - Improves UX

### Phase 2 (Medium Priority)
2. Make Post Script
   - Streamlines content creation
   - Reduces manual front matter entry
   - Encourages more posts

### Phase 3 (Lower Priority)
3. Make Publish Script
   - Convenience feature
   - Can be done manually initially
   - Nice-to-have automation

---

## Estimated Effort

| Feature | Complexity | Effort |
|---------|-----------|--------|
| Publications List | Low | 1-2 hours |
| Make Post CLI | Medium | 2-3 hours |
| Make Publish CLI | Medium | 2-3 hours |
| **Total** | - | **5-8 hours** |

---

## Questions to Address Before Implementation

### Confirmed Design Decisions ✓

1. **Publications List**: Semantic list markup (not table)
2. **Make Post**: Auto-generate slug from title
3. **Make Publish**: Include Git operations (commit/push)
4. **Draft metadata**: Separate `draft: true` field (not tag-based)
5. **Dry-run**: Essential feature included
