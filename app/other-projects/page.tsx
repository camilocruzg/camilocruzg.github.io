import Link from "next/link";
import { getAllProjects } from "@/lib/projects";
import Image from "next/image";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(date),
  );

export default async function OtherProjectsPage() {
  const projects = await getAllProjects();

  return (
    <section className="flex flex-col gap-10">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.4em] text-[color:var(--muted)]">
          Other Projects
        </p>
        <h2 className="text-3xl font-semibold">
          Vector Shift: A Turn-Based Racing Game
        </h2>
        <p className="text-base text-[color:var(--muted)]">
          Development log and design journal for Vector Shift, where strategy meets speed.
        </p>
      </div>

      <div className="grid gap-6">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="border border-[color:var(--foreground)]/10 bg-white/60 p-6 shadow-md shadow-[color:var(--foreground)]/5 dark:bg-black/40"
          >
            {project.coverImage && (
              <div className="mb-4 overflow-hidden">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            <div className="flex items-center justify-between text-sm text-[color:var(--muted)]">
              <span>{formatDate(project.publishedAt)}</span>
              <div className="flex gap-2">
                {project.status && (
                  <span className="rounded-full border border-[color:var(--foreground)]/20 bg-[color:var(--foreground)]/5 px-3 py-0.5">
                    {project.status}
                  </span>
                )}
                {project.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[color:var(--foreground)]/20 px-3 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <Link href={`/other-projects/${project.slug}`}>
              <h3 className="mt-3 text-2xl font-semibold text-[color:var(--foreground)] hover:text-black">
                {project.title}
              </h3>
            </Link>
            <p className="mt-3 text-base text-[color:var(--muted)]">
              {project.description}
            </p>
            {project.tools && project.tools.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
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
            <p className="mt-4 text-sm font-medium text-[color:var(--muted)]">
              Read more ↗
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
