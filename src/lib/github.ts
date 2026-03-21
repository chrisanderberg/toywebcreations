import { GITHUB_OWNER, GITHUB_REPO } from './site';

const REPO_BRANCH = 'main';

export const REPO_ROOT = `https://github.com/${GITHUB_OWNER}/${GITHUB_REPO}`;

export function projectSourceLink(slug: string): string {
  return `${REPO_ROOT}/tree/${REPO_BRANCH}/src/projects/${slug}`;
}
