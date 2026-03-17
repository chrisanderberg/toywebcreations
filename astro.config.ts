import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { GITHUB_OWNER } from "./src/lib/site";

export default defineConfig({
  site: `https://${GITHUB_OWNER}.github.io`,
  base: "/toywebcreations/",
  output: "static",
  integrations: [react()],
});
