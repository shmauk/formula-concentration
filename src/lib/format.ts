import { toFixedHalfUp } from "./rounding";

// Shared precision so every page shows the same numbers. Values only; callers add units.

/** kcal, 1 dp. Also used for Kcal per scoop. */
export const formatKcal = (kcal: number): string => toFixedHalfUp(kcal, 1);

/** mL, 1 dp. For Target volume, Actual volume and total Displacement. */
export const formatVolume = (mL: number): string => toFixedHalfUp(mL, 1);

/** kcal/30 mL, 2 dp. */
export const formatConcentration = (kcalPer30Ml: number): string => toFixedHalfUp(kcalPer30Ml, 2);

/** Displacement, mL per Scoop, 2 dp. */
export const formatDisplacement = (mLPerScoop: number): string => toFixedHalfUp(mLPerScoop, 2);

/** Water, whole mL. */
export const formatWater = (mL: number): string => toFixedHalfUp(mL, 0);

/** Scoops, whole number. */
export const formatScoops = (scoops: number): string => toFixedHalfUp(scoops, 0);
