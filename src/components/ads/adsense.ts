import { parseAdsenseClient } from "./ads";

/** The AdSense publisher ID, or `undefined` in placeholder mode. */
export const adsenseClient = parseAdsenseClient(
  import.meta.env.PUBLIC_ADSENSE_CLIENT,
);
