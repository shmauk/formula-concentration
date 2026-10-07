import { parsePositiveNumber, type RawNumber } from "./input";
import { formatDisplacement, formatKcal } from "./format";

/** The amount of powder in the label's Reconstitution statement. */
export type LabelPowder = { route: "scoops"; scoops: RawNumber } | { route: "grams"; grams: RawNumber };

export type LabelInputs = {
  /** Energy per 100 mL of prepared formula, kcal. */
  kcalPer100Ml: RawNumber;
  /** mL of water in the Reconstitution statement. */
  water: RawNumber;
  /** mL of prepared formula the Reconstitution statement says it makes. */
  preparedVolume: RawNumber;
  /** g. Needed on both routes: to count grams on one, scoops on the other. */
  gramsPerScoop: RawNumber;
  powder: LabelPowder;
};

export type LabelHelperResult = {
  /** Unrounded, and possibly fractional on the grams route. */
  scoops: number;
  /** g of powder in the Reconstitution statement. */
  grams: number;
  /** Unrounded kcal. */
  kcalPerScoop: number;
  /** Unrounded mL per g. */
  displacement: number;
  /** kcal per scoop to 1 dp and displacement to 3 dp, rounded half up. */
  display: { kcalPerScoop: string; displacement: string };
};

/** Derives kcal per scoop and displacement from a label. Returns null for impossible inputs. */
export function deriveFromLabel(inputs: LabelInputs): LabelHelperResult | null {
  const kcalPer100Ml = parsePositiveNumber(inputs.kcalPer100Ml);
  const water = parsePositiveNumber(inputs.water);
  const preparedVolume = parsePositiveNumber(inputs.preparedVolume);
  const gramsPerScoop = parsePositiveNumber(inputs.gramsPerScoop);
  const amount = parsePositiveNumber(inputs.powder.route === "scoops" ? inputs.powder.scoops : inputs.powder.grams);
  if (kcalPer100Ml === null || water === null || preparedVolume === null || gramsPerScoop === null || amount === null) {
    return null;
  }
  if (preparedVolume <= water) return null;

  const scoops = inputs.powder.route === "scoops" ? amount : amount / gramsPerScoop;
  const grams = inputs.powder.route === "grams" ? amount : amount * gramsPerScoop;
  const displacement = (preparedVolume - water) / grams;
  const kcalPerScoop = (kcalPer100Ml * (preparedVolume / scoops)) / 100;
  return {
    scoops,
    grams,
    kcalPerScoop,
    displacement,
    display: {
      kcalPerScoop: formatKcal(kcalPerScoop),
      displacement: formatDisplacement(displacement),
    },
  };
}
