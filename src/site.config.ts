/**
 * The single source of site-wide values. Every page reads these from here.
 */
export const siteName = "Formula Concentration";
/** The production address. Canonical links point here, not at pages.dev. */
export const siteUrl = "https://formulaconcentration.com";
/** Who runs the site, named on the privacy page. */
export const operatorName = "Tom Lindeback";
export const contactEmail = "enrapt.sites@gmail.com";
export const labelsLastChecked = "September 2026";

export interface NavEntry {
  label: string;
  href: string;
}

/** Header nav, in display order. */
export const nav: readonly NavEntry[] = [
  { label: "Reading labels", href: "/reading-labels" },
  { label: "Building a Recipe", href: "/building-a-recipe" },
  { label: "Calculator", href: "/calculator" },
];

/** The calculator is the home page; `/` redirects here. */
export const homeHref = "/calculator";

export const privacyHref = "/privacy";

/** Shown on the privacy page. Update it whenever the policy changes. */
export const privacyLastUpdated = "1 October 2026";
