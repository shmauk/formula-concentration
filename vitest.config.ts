import { svelte } from "@sveltejs/vite-plugin-svelte";
import { svelteTesting } from "@testing-library/svelte/vite";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Compiles `.svelte` files for component tests, using Svelte's browser build.
  plugins: [svelte(), svelteTesting()],
  resolve: { conditions: ["browser"] },
  test: {
    include: ["src/**/*.test.ts"],
    // Pure tests run in node; component tests opt into jsdom with a
    // `// @vitest-environment jsdom` comment at the top of the file.
    environment: "node",
  },
});
