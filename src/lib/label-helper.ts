import { parsePositiveNumber, type RawNumber } from "./input";
import { formatDisplacement, formatKcal } from "./format";

/** The amount of powder in the label's Reconstitution statement. */
export type LabelPowder =
  | { route: "scoops"; scoops: RawNumber }
  | { route: "grams"; grams: RawNumber; gramsPerScoop: RawNumber };

export type LabelInputs = {
  /** Energy per 100 mL of prepared formula, kcal. */
  kcalPer100Ml: RawNumber;
  /** mL of water in the Reconstitution statement. */
  water: RawNumber;
  /** mL of prepared formula the Reconstitution statement says it makes. */
  preparedVolume: RawNumber;
  powder: LabelPowder;
};

export type LabelHelperResult = {
  /** Unrounded, and possibly fractional on the grams route. */
  scoops: number;
  /** Unrounded kcal. */
  kcalPerScoop: number;
  /** Unrounded mL per scoop. */
  displacement: number;
  /** kcal per scoop to 1 dp and displacement to 2 dp, rounded half up. */
  display: { kcalPerScoop: string; displacement: string };
};

/** Derives kcal per scoop and displacement from a label. Returns null for impossible inputs. */
export function deriveFromLabel(inputs: LabelInputs): LabelHelperResult | null {
  const kcalPer100Ml = parsePositiveNumber(inputs.kcalPer100Ml);
  const water = parsePositiveNumber(inputs.water);
  const preparedVolume = parsePositiveNumber(inputs.preparedVolume);
  const scoops = scoopsFrom(inputs.powder);
  if (kcalPer100Ml === null || water === null || preparedVolume === null || scoops === null) return null;
  if (preparedVolume <= water) return null;

  const displacement = (preparedVolume - water) / scoops;
  const kcalPerScoop = (kcalPer100Ml * (preparedVolume / scoops)) / 100;
  return {
    scoops,
    kcalPerScoop,
    displacement,
    display: {
      kcalPerScoop: formatKcal(kcalPerScoop),
      displacement: formatDisplacement(displacement),
    },
  };
}

function scoopsFrom(powder: LabelPowder): number | null {
  if (powder.route === "scoops") return parsePositiveNumber(powder.scoops);
  const grams = parsePositiveNumber(powder.grams);
  const gramsPerScoop = parsePositiveNumber(powder.gramsPerScoop);
  return grams === null || gramsPerScoop === null ? null : grams / gramsPerScoop;
}
