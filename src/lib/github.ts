import { GITHUB_OWNER, GITHUB_REPO } from "./site";
const GITHUB_BRANCH = "main";

export function getRepoRootUrl(): string {
  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;
}

export function getProjectSourceUrl(slug: string): string {
  return `${getRepoRootUrl()}/tree/${GITHUB_BRANCH}/src/projects/${slug}`;
}
