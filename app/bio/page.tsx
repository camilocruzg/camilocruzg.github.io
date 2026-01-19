import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getBioContent } from "@/lib/bio";

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

export default async function BioPage() {
  const { frontMatter, body } = await getBioContent();

  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.4em] text-[color:var(--muted)]">About me</p>
        <h2 className="text-3xl font-semibold text-[color:var(--foreground)]">
          {frontMatter.title ?? "Bio"}
        </h2>
        {frontMatter.summary ? (
          <p className="text-base text-[color:var(--muted)]">{frontMatter.summary}</p>
        ) : null}
      </div>
      <article className="bio-content">
        <MDXRemote source={body} components={mdxComponents} />
      </article>
    </section>
  );
}
