import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export type PostFrontMatter = {
  title: string;
  description: string;
  publishedAt: string;
  tags?: string[];
  coverImage?: string;
  draft?: boolean;
};

export type PostListItem = PostFrontMatter & {
  slug: string;
  excerpt: string;
};

export type Post = PostListItem & {
  body: string;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

const compareDatesDesc = (a: PostListItem, b: PostListItem) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

export async function getAllPosts(): Promise<PostListItem[]> {
  const files = await fs.readdir(postsDirectory);
  const entries: PostListItem[] = [];

  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;
    const slug = file.replace(/\.mdx$/, "");
    const raw = await fs.readFile(path.join(postsDirectory, file), "utf8");
    const { data, content } = matter(raw);
    const frontMatter = data as PostFrontMatter;

    // Skip draft posts in production
    if (frontMatter.draft) continue;

    entries.push({
      slug,
      excerpt: frontMatter.description ?? (content.slice(0, 160).trim() + "…"),
      ...frontMatter,
    });
  }

  return entries.sort(compareDatesDesc);
}

export async function getPostSlugList(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((post) => post.slug);
}

export async function getPostBySlug(slug: string): Promise<Post> {
  const filePath = path.join(postsDirectory, `${slug}.mdx`);
  const source = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(source);
  const frontMatter = data as PostFrontMatter;

  return {
    slug,
    body: content,
    excerpt:
      frontMatter.description ?? (content.slice(0, 160).trim() + "…"),
    ...frontMatter,
  };
}

// Get all posts including drafts (for scripting/publishing)
export async function getAllPostsIncludingDrafts(): Promise<PostListItem[]> {
  const files = await fs.readdir(postsDirectory);
  const entries: PostListItem[] = [];

  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;
    const slug = file.replace(/\.mdx$/, "");
    const raw = await fs.readFile(path.join(postsDirectory, file), "utf8");
    const { data, content } = matter(raw);
    const frontMatter = data as PostFrontMatter;

    entries.push({
      slug,
      excerpt: frontMatter.description ?? (content.slice(0, 160).trim() + "…"),
      ...frontMatter,
    });
  }

  return entries.sort(compareDatesDesc);
}
