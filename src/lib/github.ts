import { GITHUB_OWNER, GITHUB_REPO } from "./site";
const GITHUB_BRANCH = "main";

export function getRepoRootUrl(): string {
  if (!GITHUB_OWNER) {
    return "#";
  }

  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;
}

export function getProjectSourceUrl(slug: string): string {
  const repoRoot = getRepoRootUrl();

  if (!repoRoot || repoRoot === "#") {
    return repoRoot;
  }

  return `${repoRoot}/tree/${GITHUB_BRANCH}/src/projects/${slug}`;
}
