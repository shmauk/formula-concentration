import { toFixedHalfUp } from "./rounding";

// Shared precision so every page shows the same numbers. Values only; callers add units.

/** kcal, 1 dp. Also used for kcal per scoop. */
export const formatKcal = (kcal: number): string => toFixedHalfUp(kcal, 1);

/** mL, 1 dp. For Target volume, Actual volume and total displacement. */
export const formatVolume = (mL: number): string => toFixedHalfUp(mL, 1);

/** kcal/30 mL, 2 dp. */
export const formatConcentration = (kcalPer30Ml: number): string => toFixedHalfUp(kcalPer30Ml, 2);

/** Displacement, mL per scoop, 2 dp. */
export const formatDisplacement = (mLPerScoop: number): string => toFixedHalfUp(mLPerScoop, 2);

/** Water, whole mL. */
export const formatWater = (mL: number): string => toFixedHalfUp(mL, 0);

/** Scoops, whole number. */
export const formatScoops = (scoops: number): string => toFixedHalfUp(scoops, 0);

/** "scoop" for one, "scoops" otherwise. */
export const scoopsNoun = (scoops: number): string => (scoops === 1 ? "scoop" : "scoops");

// Intermediate working on /building-a-recipe. Trailing zeros are dropped where
// the value is usually round, so the sums read "150 × 0.8 = 120".
const withoutTrailingZeros = (fixed: string): string =>
  fixed.includes(".") ? fixed.replace(/\.?0+$/, "") : fixed;

/** kcal per mL (Target concentration ÷ 30), at most 3 dp. */
export const formatKcalPerMl = (kcalPerMl: number): string =>
  withoutTrailingZeros(toFixedHalfUp(kcalPerMl, 3));

/** kcal needed (Target volume × kcal/mL), 1 dp without a trailing .0. */
export const formatKcalNeeded = (kcal: number): string => withoutTrailingZeros(formatKcal(kcal));

/** Scoops before rounding up, 2 dp. */
export const formatExactScoops = (scoops: number): string => toFixedHalfUp(scoops, 2);

/** mL between an Actual volume and the Target volume, 1 dp without a trailing .0. */
export const formatVolumeDifference = (mL: number): string => withoutTrailingZeros(formatVolume(mL));
