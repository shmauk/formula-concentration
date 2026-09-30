/** The `ads.txt` file authorising Google to sell ads for this publisher. */
export function adsTxt(client: string): string {
  const publisherId = client.replace(/^ca-/, "");
  return `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;
}

/**
 * Reads the AdSense publisher ID (`ca-pub-` and 16 digits) from
 * `PUBLIC_ADSENSE_CLIENT`. Unset or blank means placeholder mode
 * (`undefined`); anything else malformed fails the build.
 */
export function parseAdsenseClient(raw: string | undefined): string | undefined {
  const value = raw?.trim();
  if (!value) return undefined;
  if (!/^ca-pub-\d{16}$/.test(value)) {
    throw new Error(
      `PUBLIC_ADSENSE_CLIENT must look like "ca-pub-" followed by 16 digits; got "${value}".`,
    );
  }
  return value;
}

export interface AdDimensions {
  width: number;
  height: number;
}

export type AdSize = "leaderboard" | "rectangle" | "skyscraper";

/**
 * Each slot size's dimensions. The phone size applies below the desktop
 * breakpoint (48rem, in `AdSlot.astro`).
 */
export const adSizes: Record<AdSize, { desktop: AdDimensions; phone: AdDimensions }> = {
  leaderboard: {
    desktop: { width: 728, height: 90 },
    phone: { width: 320, height: 100 },
  },
  rectangle: {
    desktop: { width: 336, height: 280 },
    phone: { width: 300, height: 250 },
  },
  // Desktop rail only; the rail is hidden on phones.
  skyscraper: {
    desktop: { width: 300, height: 600 },
    phone: { width: 300, height: 600 },
  },
};

/** The text inside a placeholder-mode slot, e.g. "336×280 · after-result". */
export function placeholderLabel(size: AdDimensions, name: string): string {
  return `${size.width}×${size.height} · ${name}`;
}
