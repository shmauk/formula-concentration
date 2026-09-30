/**
 * The single source of site-wide values. Every page reads these from here.
 * The placeholders stay until branding is decided at launch.
 */
export const siteName = "[Site name]";
export const contactEmail = "[contact email]";
export const labelsLastChecked = "[Month YYYY]";

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
export const privacyLastUpdated = "30 September 2026";
