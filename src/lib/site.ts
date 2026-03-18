/**
 * Site-wide identity config. Single source of truth for GitHub owner and URLs.
 */
export const GITHUB_OWNER = 'chrisanderberg';
export const SITE_BASE_PATH = '/toywebcreations';

export function withBasePath(base: string, path = ''): string {
  const normalizedBase = base === '/' ? '' : base.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');

  return normalizedPath ? `${normalizedBase}/${normalizedPath}` : `${normalizedBase}/`;
}

export function assetPath(path: string): string {
  return withBasePath(SITE_BASE_PATH, path);
}
