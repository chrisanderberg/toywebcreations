/**
 * Site-wide identity config. Single source of truth for GitHub owner and repo.
 * Configure this via the GITHUB_OWNER and GITHUB_REPO environment variables.
 */
const PLACEHOLDER_GITHUB_OWNER = "YOUR_GITHUB_USERNAME";
const DEFAULT_GITHUB_REPO = "toywebcreations";

function readEnv(name: string): string | undefined {
  const processEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const value = processEnv?.[name]?.trim();
  return value ? value : undefined;
}

export function readGithubOwner(): string | undefined {
  const githubOwner = readEnv("GITHUB_OWNER");

  if (!githubOwner || githubOwner === PLACEHOLDER_GITHUB_OWNER) {
    return undefined;
  }

  return githubOwner;
}

function readGithubRepo(): string | undefined {
  return readEnv("GITHUB_REPO");
}

export const GITHUB_OWNER = readGithubOwner();
export const GITHUB_REPO = readGithubRepo() ?? DEFAULT_GITHUB_REPO;

export function isUserOrOrganizationPagesRepo(owner: string | undefined = GITHUB_OWNER, repo: string = GITHUB_REPO): boolean {
  const normalizedRepo = repo.toLowerCase();

  if (owner) {
    return normalizedRepo === `${owner.toLowerCase()}.github.io`;
  }

  return normalizedRepo.endsWith(".github.io");
}

export function getSiteOrigin(owner: string | undefined = GITHUB_OWNER): string | undefined {
  return owner ? `https://${owner}.github.io` : undefined;
}

export function getSiteUrl(owner: string | undefined = GITHUB_OWNER, repo: string = GITHUB_REPO): string {
  const origin = getSiteOrigin(owner);

  if (!origin) {
    throw new Error(
      "Missing required GITHUB_OWNER environment variable. Set GITHUB_OWNER to your GitHub username before building the GitHub Pages site URL.",
    );
  }

  return isUserOrOrganizationPagesRepo(owner, repo) ? origin : `${origin}/${repo}`;
}

export function getBasePath(owner: string | undefined = GITHUB_OWNER, repo: string = GITHUB_REPO): string {
  return isUserOrOrganizationPagesRepo(owner, repo) ? "/" : `/${repo}/`;
}
