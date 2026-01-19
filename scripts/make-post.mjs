#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "../content/posts");

// Create readline interface for prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (prompt) =>
  new Promise((resolve) => {
    rl.question(prompt, resolve);
  });

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// Format date as YYYY-MM-DD
function formatDate(date = new Date()) {
  return date.toISOString().split("T")[0];
}

// Create front matter YAML
function createFrontMatter(title, description, slug, tags) {
  const tagsYaml =
    tags.length > 0
      ? "\ntags:\n" + tags.map((tag) => `  - ${tag}`).join("\n")
      : "";

  return `---
title: "${title}"
description: "${description}"
publishedAt: "${formatDate()}"
draft: true${tagsYaml}
---`;
}

// Main function
async function main() {
  console.log("\n📝 Create a new blog post\n");

  try {
    const title = await question("Post title: ");
    if (!title.trim()) {
      console.error("❌ Title is required");
      process.exit(1);
    }

    const description = await question("Description: ");
    if (!description.trim()) {
      console.error("❌ Description is required");
      process.exit(1);
    }

    const tagsInput = await question("Tags (comma-separated, optional): ");
    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    const coverImage = await question(
      "Cover image path (optional, e.g. /images/posts/cover.png): "
    );

    rl.close();

    // Generate slug
    const slug = generateSlug(title);

    // Check if file already exists
    const filename = `${formatDate()}-${slug}.mdx`;
    const filePath = path.join(postsDir, filename);

    try {
      await fs.access(filePath);
      console.error(
        `❌ Post already exists: ${filename}\nTip: Choose a different title or manually rename the file.`
      );
      process.exit(1);
    } catch {
      // File doesn't exist, which is good
    }

    // Create post content
    const frontMatter = createFrontMatter(title, description, slug, tags);
    let content = `${frontMatter}

## Introduction

Add your post content here. You can use markdown formatting, including:

- Bullet points
- **Bold text**
- *Italic text*
- [Links](https://example.com)
- Code blocks:

\`\`\`javascript
// Your code here
\`\`\`

## Section 2

Continue with more sections as needed.
`;

    if (coverImage.trim()) {
      content = `${frontMatter}

![Cover image](${coverImage.trim()})

## Introduction

Add your post content here...`;
    }

    // Create posts directory if it doesn't exist
    try {
      await fs.access(postsDir);
    } catch {
      await fs.mkdir(postsDir, { recursive: true });
    }

    // Write file
    await fs.writeFile(filePath, content);

    console.log(`
✅ Post created successfully!

File: content/posts/${filename}
Status: 📋 Draft (remove "draft: true" when ready to publish)

Next steps:
1. Edit the file to add your content
2. Remove "draft: true" from front matter when ready
3. Run "npm run make:publish" to check and deploy

`);
  } catch (error) {
    if (error.code !== "ERR_USE_AFTER_CLOSE") {
      console.error("❌ Error creating post:", error.message);
      process.exit(1);
    }
  }
}

main();
