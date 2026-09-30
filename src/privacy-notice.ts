/**
 * The first-visit privacy notice's dismissal, kept in one `localStorage` item.
 *
 * GUARD RAIL: personalised ads, extra pixels or saving calculator inputs all
 * mean updating the privacy policy, bumping this key's version so everyone
 * sees the notice again, and re-checking the health-service research (#13)
 * first.
 */
export const PRIVACY_NOTICE_KEY = "privacy-notice-v1";

/*
 * The functions below are inlined into the page as source text (see
 * NoticeBanner.astro), so each must be self-contained: no imports, no
 * references to anything outside its own body.
 *
 * `getStorage` is a function because merely reading `window.localStorage`
 * can throw (for example when storage is blocked). If storage is unavailable
 * the notice shows on every visit.
 */

export function isNoticeDismissed(
  getStorage: () => Storage,
  key: string,
): boolean {
  try {
    return getStorage().getItem(key) !== null;
  } catch {
    return false;
  }
}

export function rememberNoticeDismissed(
  getStorage: () => Storage,
  key: string,
): void {
  try {
    getStorage().setItem(key, "1");
  } catch {
    // Storage unavailable: the notice is hidden for this page only.
  }
}
