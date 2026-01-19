import type { NextConfig } from "next";

const repoBasePath = "/personal_website";
const isGithubPages = process.env.GITHUB_PAGES === "true";
const resolvedBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isGithubPages ? repoBasePath : "");
const assetPrefix = resolvedBasePath ? `${resolvedBasePath}/` : undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath: resolvedBasePath || undefined,
  assetPrefix,
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
