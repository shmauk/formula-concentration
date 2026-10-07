// Lets Node run the site's TypeScript directly: src imports siblings without
// an extension ("./recipe") and folders by name ("../lib"), which Node's
// resolver won't guess.
import { registerHooks } from "node:module";

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith(".") || /\.[cm]?[jt]s$/.test(specifier)) {
      return nextResolve(specifier, context);
    }
    for (const candidate of [`${specifier}.ts`, `${specifier}/index.ts`]) {
      try {
        return nextResolve(candidate, context);
      } catch {
        // Try the next candidate.
      }
    }
    return nextResolve(specifier, context);
  },
});
