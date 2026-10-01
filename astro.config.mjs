// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";
import { homeHref, siteUrl } from "./src/site.config";

export default defineConfig({
  site: siteUrl,
  output: "static",
  integrations: [svelte()],
  // Emit `calculator.html` rather than `calculator/index.html`. Cloudflare
  // Pages serves it at `/calculator`, matching our links with no redirect.
  build: { format: "file" },
  trailingSlash: "never",
  // The calculator is the home page. In static output this becomes a
  // meta-refresh page at `/`, which works on any host.
  redirects: {
    "/": homeHref,
  },
});
