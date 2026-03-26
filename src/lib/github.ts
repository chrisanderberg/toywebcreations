/**
 * Central place to tune GitHub URLs for header `sourceLink` and repo root.
 * Update owner/repo to match your published repository.
 */
export const siteGithubConfig = {
  owner: 'toywebcreations',
  repo: 'toywebcreations',
  branch: 'main',
} as const;

export function getRepoRootUrl(): string {
  const { owner, repo } = siteGithubConfig;
  return `https://github.com/${owner}/${repo}`;
}

export function getProjectSourceUrl(slug: string): string {
  const { owner, repo, branch } = siteGithubConfig;
  return `https://github.com/${owner}/${repo}/tree/${branch}/src/projects/${slug}`;
}
