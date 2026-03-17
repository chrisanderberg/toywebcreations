import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { getBasePath, getSiteOrigin } from "./src/lib/site";

const siteOrigin = getSiteOrigin();

export default defineConfig({
  ...(siteOrigin ? { site: siteOrigin } : {}),
  base: getBasePath(),
  output: "static",
  integrations: [react()],
});
