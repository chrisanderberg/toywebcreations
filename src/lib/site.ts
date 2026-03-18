/**
 * Site-wide identity config. Single source of truth for GitHub owner and URLs.
 * Replace YOUR_GITHUB_USERNAME with your actual GitHub username.
 */
export const GITHUB_OWNER = 'YOUR_GITHUB_USERNAME';

export function withBasePath(base: string, path = ''): string {
  const normalizedBase = base === '/' ? '' : base.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');

  return normalizedPath ? `${normalizedBase}/${normalizedPath}` : `${normalizedBase}/`;
}
