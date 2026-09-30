/**
 * Ad placements and their AdSense ad unit IDs (the `data-ad-slot` number
 * from the AdSense dashboard). The publisher ID comes from the
 * `PUBLIC_ADSENSE_CLIENT` env var instead.
 *
 * A placement with no ad unit ID keeps its reserved space but shows no ad
 * once AdSense is configured.
 */
export const adUnitIds = {
  /** Calculator: after the Recipe result. */
  "after-result": undefined,
  /** Calculator: end of the page, after the explainer. */
  "calculator-end": undefined,
  /** Tutorial pages: under the intro. */
  "tutorial-top": undefined,
  /** Tutorial pages: after the method. */
  "after-method": undefined,
  /** Tutorial pages: end of the page. */
  "tutorial-end": undefined,
  /** The sticky desktop rail on every page with ads. */
  rail: undefined,
} satisfies Record<string, string | undefined>;

export type AdSlotName = keyof typeof adUnitIds;
