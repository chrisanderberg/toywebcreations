import { GITHUB_OWNER } from './site';

const REPO_NAME = 'toywebcreations';
const REPO_BRANCH = 'main';

export const REPO_ROOT = `https://github.com/${GITHUB_OWNER}/${REPO_NAME}`;

export function projectSourceLink(slug: string): string {
  return `${REPO_ROOT}/tree/${REPO_BRANCH}/src/projects/${slug}`;
}
