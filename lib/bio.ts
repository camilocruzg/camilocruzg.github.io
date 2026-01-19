import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export type BioFrontMatter = {
  title?: string;
  summary?: string;
};

const bioFile = path.join(process.cwd(), "content", "bio", "bio.mdx");

export async function getBioContent(): Promise<{ frontMatter: BioFrontMatter; body: string }> {
  const source = await fs.readFile(bioFile, "utf8");
  const { data, content } = matter(source);
  return {
    frontMatter: data as BioFrontMatter,
    body: content,
  };
}