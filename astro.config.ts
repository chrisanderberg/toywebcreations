import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { GITHUB_OWNER, GITHUB_REPO } from "./src/lib/site";

export default defineConfig({
  site: `https://${GITHUB_OWNER}.github.io`,
  base: `/${GITHUB_REPO}/`,
  output: "static",
  integrations: [react()],
});
