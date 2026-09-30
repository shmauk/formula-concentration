/** Values within this distance of a whole step are treated as on the step. */
export const SNAP_TOLERANCE = 1e-9;

/** Snaps a value within SNAP_TOLERANCE of a multiple of `step` onto it. */
export function snap(value: number, step = 1): number {
  const nearest = Math.round(value / step) * step;
  return Math.abs(value - nearest) <= SNAP_TOLERANCE ? nearest : value;
}

/** Rounds up to a multiple of `step`, after snapping away floating-point noise. */
export function roundUp(value: number, step = 1): number {
  return Math.ceil(snap(value, step) / step) * step;
}

/**
 * Rounds half up to `decimals` places, snapping first so that values like
 * 37.95 (stored as 37.94999…) round to 38.0 rather than 37.9.
 */
export function roundHalfUp(value: number, decimals: number): number {
  const scale = 10 ** decimals;
  return Math.floor(snap(value * scale, 0.5) + 0.5) / scale;
}

/** Rounds half up and shows exactly `decimals` places. */
export function toFixedHalfUp(value: number, decimals: number): string {
  return roundHalfUp(value, decimals).toFixed(decimals);
}
