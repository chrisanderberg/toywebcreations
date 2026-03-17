/**
 * Site-wide identity config. Single source of truth for GitHub owner and URLs.
 * Configure this via the GITHUB_OWNER environment variable.
 */
const PLACEHOLDER_GITHUB_OWNER = "YOUR_GITHUB_USERNAME";

function readGithubOwner(): string {
  const processEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  const githubOwner = processEnv?.GITHUB_OWNER?.trim();

  if (!githubOwner || githubOwner === PLACEHOLDER_GITHUB_OWNER) {
    throw new Error(
      "Missing required GITHUB_OWNER environment variable. Set GITHUB_OWNER to your GitHub username before running Astro build or dev.",
    );
  }

  return githubOwner;
}

export const GITHUB_OWNER = readGithubOwner();
