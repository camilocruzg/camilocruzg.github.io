import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Image from "next/image";
import { getProjectBySlug, getProjectSlugList } from "@/lib/projects";

const mdxComponents = {
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      className="text-[color:var(--foreground)]/80 underline decoration-dotted"
      rel={href?.startsWith("/") ? undefined : "noreferrer"}
      target={href?.startsWith("/") ? undefined : "_blank"}
      {...props}
    >
      {children}
    </a>
  ),
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  const readableDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
  }).format(new Date(project.publishedAt));

  return (
    <article className="space-y-6">
      <Link className="text-sm text-[color:var(--muted)]" href="/other-projects">
        ← Back to projects
      </Link>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.5em] text-[color:var(--muted)]">
          {readableDate}
        </p>
        <h1 className="text-4xl font-semibold text-[color:var(--foreground)]">
          {project.title}
        </h1>
        <p className="text-base text-[color:var(--muted)]">{project.description}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {project.status && (
            <span className="text-sm rounded-full border border-[color:var(--foreground)]/20 bg-[color:var(--foreground)]/5 px-3 py-1">
              {project.status}
            </span>
          )}
          {project.tags?.map((tag) => (
            <span
              key={tag}
              className="text-sm rounded-full border border-[color:var(--foreground)]/20 px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
        {project.tools && project.tools.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="text-sm text-[color:var(--muted)]">Tools:</span>
            {project.tools.map((tool) => (
              <span
                key={tool}
                className="text-sm rounded border border-[color:var(--foreground)]/10 bg-[color:var(--foreground)]/5 px-2 py-0.5"
              >
                {tool}
              </span>
            ))}
          </div>
        )}
      </div>
      {project.coverImage && (
        <div className="overflow-hidden">
          <Image
            src={project.coverImage}
            alt={project.title}
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      <section className="space-y-4 text-base text-[color:var(--foreground)]">
        <MDXRemote source={project.body} components={mdxComponents} />
      </section>
    </article>
  );
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugList();
  return slugs.map((slug) => ({ slug }));
}
