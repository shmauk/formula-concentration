import { parsePositiveNumber, type RawNumber } from "./input";
import { roundUp, SNAP_TOLERANCE } from "./rounding";

export type RecipeField = "kcalPerScoop" | "gramsPerScoop" | "displacement" | "targetVolume" | "targetConcentration";

/** A recipe input as typed: a number, text, or blank. */
export type RecipeInput = RawNumber;

export type RecipeInputs = {
  /** kcal. */
  kcalPerScoop: RecipeInput;
  /** g. */
  gramsPerScoop: RecipeInput;
  /** Displacement, mL per g. */
  displacement: RecipeInput;
  /** mL. */
  targetVolume: RecipeInput;
  /** kcal/30 mL. */
  targetConcentration: RecipeInput;
};

/** `unusual` still gives a recipe, with a double-check warning on that input; `impossible` gives none. */
export type InputStatus = "ok" | "unusual" | "impossible";

export type RecipeValidation = Record<RecipeField, InputStatus>;

/** Inclusive typical range for each input. Values outside are `unusual`. */
export const TYPICAL_RANGES: Readonly<Record<RecipeField, { min: number; max: number }>> = {
  kcalPerScoop: { min: 10, max: 50 },
  gramsPerScoop: { min: 3, max: 10 },
  displacement: { min: 0.55, max: 0.9 },
  targetVolume: { min: 20, max: 1000 },
  targetConcentration: { min: 20, max: 36 },
};

/** kcal/30 mL. A drift of exactly this much warns. */
export const CONCENTRATION_WARNING_THRESHOLD = 0.5;

/** mL. A Fewer-scoops suggestion must land at most this far from the Target volume. */
export const SUGGESTION_MAX_VOLUME_DIFFERENCE = 10;

const WATER_STEP_ML = 5;

/** Concentration is always expressed per this many mL. */
const CONCENTRATION_VOLUME_ML = 30;

export type Recipe = {
  scoops: number;
  /** mL, rounded up to the nearest 5 mL. */
  water: number;
  actualKcal: number;
  /** g: scoops × grams per scoop. */
  totalPowder: number;
  /** mL: total powder × displacement. */
  totalDisplacement: number;
  /** mL of water before rounding up to the nearest 5 mL. */
  exactWater: number;
  /** mL. */
  actualVolume: number;
  /** kcal/30 mL. */
  actualConcentration: number;
  /** kcal/30 mL: Target concentration minus Actual concentration. Negative when over target. */
  concentrationShortfall: number;
  /** True when the Actual concentration is at least 0.5 kcal/30 mL under the Target concentration. */
  concentrationWarning: boolean;
};

export type RecipeResult =
  | {
      kind: "recipe";
      validation: RecipeValidation;
      /** Target concentration ÷ 30. */
      kcalPerMl: number;
      /** kcal: Target volume × kcal/mL. */
      kcalNeeded: number;
      /** kcal needed ÷ kcal per scoop, before rounding up. */
      exactScoops: number;
      recipe: Recipe;
      /** The Fewer-scoops suggestion, or null when it isn't offered. */
      suggestion: Recipe | null;
      /** The one-fewer-scoop recipe checked for the suggestion, offered or not. Null for a single scoop. */
      oneFewerScoop: Recipe | null;
    }
  | { kind: "impossible"; validation: RecipeValidation };

type ValidInputs = Record<RecipeField, number>;

const FIELDS = Object.keys(TYPICAL_RANGES) as RecipeField[];

export function calculateRecipe(inputs: RecipeInputs): RecipeResult {
  const values: Partial<ValidInputs> = {};
  const validation = {} as RecipeValidation;
  for (const field of FIELDS) {
    const value = parsePositiveNumber(inputs[field]);
    const { min, max } = TYPICAL_RANGES[field];
    if (value === null) {
      validation[field] = "impossible";
    } else {
      values[field] = value;
      validation[field] = value < min || value > max ? "unusual" : "ok";
    }
  }
  if (FIELDS.some((field) => validation[field] === "impossible")) {
    return { kind: "impossible", validation };
  }
  return { validation, ...calculateValidRecipe(values as ValidInputs) };
}

function calculateValidRecipe(inputs: ValidInputs) {
  const kcalPerMl = inputs.targetConcentration / CONCENTRATION_VOLUME_ML;
  const kcalNeeded = inputs.targetVolume * kcalPerMl;
  const exactScoops = kcalNeeded / inputs.kcalPerScoop;
  const recipe = recipeWithScoops(roundUp(exactScoops), inputs, kcalPerMl);
  const oneFewerScoop = recipe.scoops < 2 ? null : recipeWithScoops(recipe.scoops - 1, inputs, kcalPerMl);
  return {
    kind: "recipe" as const,
    kcalPerMl,
    kcalNeeded,
    exactScoops,
    recipe,
    suggestion: fewerScoopsSuggestion(recipe, oneFewerScoop, inputs.targetVolume),
    oneFewerScoop,
  };
}

function recipeWithScoops(scoops: number, inputs: ValidInputs, kcalPerMl: number): Recipe {
  const actualKcal = scoops * inputs.kcalPerScoop;
  const totalPowder = scoops * inputs.gramsPerScoop;
  const totalDisplacement = totalPowder * inputs.displacement;
  const exactWater = actualKcal / kcalPerMl - totalDisplacement;
  const water = roundUp(exactWater, WATER_STEP_ML);
  const actualVolume = water + totalDisplacement;
  const actualConcentration = (actualKcal / actualVolume) * CONCENTRATION_VOLUME_ML;
  const concentrationShortfall = inputs.targetConcentration - actualConcentration;
  return {
    scoops,
    water,
    actualKcal,
    totalPowder,
    totalDisplacement,
    exactWater,
    actualVolume,
    actualConcentration,
    concentrationShortfall,
    concentrationWarning: concentrationShortfall >= CONCENTRATION_WARNING_THRESHOLD - SNAP_TOLERANCE,
  };
}

// Offers the one-fewer-scoop candidate only when it's closer to the Target
// volume and within SUGGESTION_MAX_VOLUME_DIFFERENCE of it.
function fewerScoopsSuggestion(recipe: Recipe, candidate: Recipe | null, targetVolume: number): Recipe | null {
  if (candidate === null) return null;
  const recipeDifference = Math.abs(recipe.actualVolume - targetVolume);
  const candidateDifference = Math.abs(candidate.actualVolume - targetVolume);
  const isCloser = candidateDifference < recipeDifference - SNAP_TOLERANCE;
  const isNearEnough = candidateDifference <= SUGGESTION_MAX_VOLUME_DIFFERENCE + SNAP_TOLERANCE;
  return isCloser && isNearEnough ? candidate : null;
}
