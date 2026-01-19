import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug, getPostSlugList } from "@/lib/posts";

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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const readableDate = new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
  }).format(new Date(post.publishedAt));

  return (
    <article className="space-y-6">
      <Link className="text-sm text-[color:var(--muted)]" href="/">
        ← Back to updates
      </Link>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.5em] text-[color:var(--muted)]">
          {readableDate}
        </p>
        <h1 className="text-4xl font-semibold text-[color:var(--foreground)]">
          {post.title}
        </h1>
        <p className="text-base text-[color:var(--muted)]">{post.description}</p>
        
        {/* Show tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs rounded-full border border-[color:var(--foreground)]/20 px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Cover image */}
      {post.coverImage && (
        <div className="overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={600}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      <section className="space-y-4 text-base text-[color:var(--foreground)]">
        <MDXRemote source={post.body} components={mdxComponents} />
      </section>
    </article>
  );
}

export async function generateStaticParams() {
  const slugs = await getPostSlugList();
  return slugs.map((slug) => ({ slug }));
}
