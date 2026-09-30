// @ts-check
import { defineConfig } from "astro/config";
import svelte from "@astrojs/svelte";

export default defineConfig({
  output: "static",
  integrations: [svelte()],
  // The calculator is the home page. In static output this becomes a
  // meta-refresh page at `/`, which works on any host.
  redirects: {
    "/": "/calculator",
  },
});
