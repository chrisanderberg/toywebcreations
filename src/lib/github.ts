import { GITHUB_OWNER } from "./site";

const GITHUB_REPO = "toywebcreations";
const GITHUB_BRANCH = "main";

export function getRepoRootUrl(): string {
  return `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;
}

export function getProjectSourceUrl(slug: string): string {
  return `${getRepoRootUrl()}/tree/${GITHUB_BRANCH}/src/projects/${slug}`;
}
