#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const postsDir = path.join(__dirname, "../content/posts");
const projectsDir = path.join(__dirname, "../content/projects");
const rootDir = path.join(__dirname, "..");

// Parse command line arguments
const isDryRun = process.argv.includes("--dry-run");

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Get current git status
function getGitStatus() {
  try {
    const status = execSync("git status --porcelain", {
      cwd: rootDir,
      encoding: "utf8",
    }).trim();
    return status.length > 0;
  } catch {
    return false;
  }
}

// Stage git changes
function gitStage(files) {
  try {
    files.forEach((file) => {
      execSync(`git add "${file}"`, { cwd: rootDir });
    });
    return true;
  } catch (error) {
    log(`⚠️  Git stage failed: ${error.message}`, "yellow");
    return false;
  }
}

// Commit changes
function gitCommit(message) {
  try {
    execSync(`git commit -m "${message}"`, { cwd: rootDir });
    return true;
  } catch {
    return false;
  }
}

// Push to remote
function gitPush() {
  try {
    execSync("git push", { cwd: rootDir });
    return true;
  } catch {
    return false;
  }
}

// Find all publishable posts (non-draft)
async function findPublishablePosts() {
  const publishable = [];
  const drafts = [];

  const files = await fs.readdir(postsDir);

  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;

    const filePath = path.join(postsDir, file);
    const content = await fs.readFile(filePath, "utf8");
    const { data } = matter(content);

    const post = {
      filename: file,
      slug: file.replace(/\.mdx$/, ""),
      title: data.title || "Untitled",
      publishedAt: data.publishedAt || "Unknown",
      isDraft: data.draft === true,
    };

    if (post.isDraft) {
      drafts.push(post);
    } else {
      publishable.push(post);
    }
  }

  return { publishable, drafts };
}

// Build the site
function buildSite() {
  try {
    log("Building site...", "blue");
    execSync("npm run build", { cwd: rootDir, stdio: "inherit" });
    return true;
  } catch (error) {
    log(`❌ Build failed: ${error.message}`, "red");
    return false;
  }
}

// Export the site
function exportSite() {
  try {
    log("Exporting static site...", "blue");
    execSync("npm run export", { cwd: rootDir, stdio: "inherit" });
    return true;
  } catch (error) {
    log(`❌ Export failed: ${error.message}`, "red");
    return false;
  }
}

// Deploy the site
function deploySite() {
  try {
    log("Deploying...", "blue");
    execSync("npm run deploy", { cwd: rootDir, stdio: "inherit" });
    return true;
  } catch (error) {
    log(`❌ Deploy failed: ${error.message}`, "red");
    return false;
  }
}

// Main function
async function main() {
  console.log("");
  log("🚀 Publish Workflow", "blue");
  console.log("");

  try {
    // Find publishable posts
    const { publishable, drafts } = await findPublishablePosts();

    if (publishable.length === 0) {
      log("ℹ️  No posts ready to publish (all in draft status)", "yellow");
      if (drafts.length > 0) {
        log("\nDraft posts:", "yellow");
        drafts.forEach((post) => {
          log(`  📋 ${post.publishedAt} - ${post.title}`);
        });
        log(
          '\nTip: Remove "draft: true" from a post to make it publishable.\n',
          "yellow"
        );
      }
      process.exit(0);
    }

    // Show what's ready to publish
    log(`\n✓ Found ${publishable.length} post(s) ready to publish:\n`, "green");
    publishable.forEach((post) => {
      log(`  📄 ${post.publishedAt} - ${post.title}`);
    });

    if (drafts.length > 0) {
      log(`\n(Skipping ${drafts.length} draft post(s))`, "yellow");
    }

    // Dry-run mode
    if (isDryRun) {
      log("\n✓ Dry-run mode: No changes were made\n", "yellow");
      process.exit(0);
    }

    // Confirm before publishing
    console.log("");
    log("Ready to publish. This will:", "blue");
    log("  1. Build the Next.js application");
    log("  2. Export static files");
    log("  3. Deploy to GitHub Pages");
    log("  4. Commit and push changes\n");

    // Build, export, and deploy
    if (!buildSite()) {
      process.exit(1);
    }

    if (!exportSite()) {
      process.exit(1);
    }

    if (!deploySite()) {
      process.exit(1);
    }

    // Git operations
    const hasChanges = getGitStatus();
    if (hasChanges) {
      log("\nPushing to repository...", "blue");

      const filesToStage = publishable.map((p) => `content/posts/${p.filename}`);
      if (gitStage(filesToStage)) {
        const message = `publish: ${publishable.length} post(s) - ${publishable.map((p) => p.title).join(", ")}`;
        if (gitCommit(message)) {
          gitPush();
          log("✓ Changes committed and pushed", "green");
        }
      }
    }

    // Final summary
    console.log("");
    log(`✅ Successfully published ${publishable.length} post(s)!\n`, "green");
    publishable.forEach((post) => {
      log(`  ✓ ${post.title}`);
    });
    console.log("");
  } catch (error) {
    log(`\n❌ Publish failed: ${error.message}\n`, "red");
    process.exit(1);
  }
}

main();
