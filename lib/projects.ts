import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export type ProjectFrontMatter = {
  title: string;
  description: string;
  publishedAt: string;
  status?: string;
  tools?: string[];
  coverImage?: string;
  tags?: string[];
};

export type ProjectListItem = ProjectFrontMatter & {
  slug: string;
  excerpt: string;
};

export type Project = ProjectListItem & {
  body: string;
};

const projectsDirectory = path.join(process.cwd(), "content", "projects");

const compareDatesDesc = (a: ProjectListItem, b: ProjectListItem) =>
  new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();

export async function getAllProjects(): Promise<ProjectListItem[]> {
  const fileNames = await fs.readdir(projectsDirectory);
  const mdxFiles = fileNames.filter(
    (file) => file.endsWith(".mdx") || file.endsWith(".md"),
  );

  const projects = await Promise.all(
    mdxFiles.map(async (fileName) => {
      const slug = fileName.replace(/\.mdx?$/, "");
      const filePath = path.join(projectsDirectory, fileName);
      const fileContent = await fs.readFile(filePath, "utf-8");
      const { data, content } = matter(fileContent);

      const excerpt = content.split("\n\n")[0] || "";

      return {
        slug,
        excerpt,
        title: data.title,
        description: data.description,
        publishedAt: data.publishedAt,
        status: data.status,
        tools: data.tools,
        coverImage: data.coverImage,
        tags: data.tags,
      } as ProjectListItem;
    }),
  );

  return projects.sort(compareDatesDesc);
}

export async function getProjectSlugList(): Promise<string[]> {
  const projects = await getAllProjects();
  return projects.map((project) => project.slug);
}

export async function getProjectBySlug(slug: string): Promise<Project> {
  const filePath = path.join(projectsDirectory, `${slug}.mdx`);
  const fileContent = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const excerpt = content.split("\n\n")[0] || "";

  return {
    slug,
    body: content,
    excerpt,
    title: data.title,
    description: data.description,
    publishedAt: data.publishedAt,
    status: data.status,
    tools: data.tools,
    coverImage: data.coverImage,
    tags: data.tags,
  };
}
