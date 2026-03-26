export const GITHUB = {
  owner: "chrisanderberg",
  repo: "toywebcreations",
  branch: "main"
} as const;

export function repoRootUrl(): string {
  return `https://github.com/${GITHUB.owner}/${GITHUB.repo}`;
}

export function projectSourceUrl(slug: string): string {
  return `https://github.com/${GITHUB.owner}/${GITHUB.repo}/tree/${GITHUB.branch}/src/projects/${slug}`;
}
