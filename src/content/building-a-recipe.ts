import {
  calculateRecipe,
  type Recipe,
  formatConcentration,
  formatExactScoops,
  formatKcal,
  formatKcalNeeded,
  formatKcalPerMl,
  formatScoops,
  scoopsNoun,
  formatVolume,
  formatVolumeDifference,
  formatWater,
} from "../lib";
import { readingLabelsWorking, type WorkingLine } from "./reading-labels";
import type { WorkedExample } from "./worked-examples";

export type Target = {
  /** Target volume, mL. */
  volume: number;
  /** Target concentration, kcal/30 mL. */
  concentration: number;
};

/** A Recipe in one line, for comparing it with one fewer scoop. */
export type RecipeBrief = {
  /** "5 scoops + 125 mL". */
  recipe: string;
  /** Actual volume, mL. */
  actualVolume: string;
  /** "141.7 mL at 23.61". */
  makes: string;
  /** How far the Actual volume is from the Target volume: "8.3 mL short", "20 mL over". */
  fromTarget: string;
};

export type RecipeWalkthrough = {
  /** Shown beside the follow-along switch. */
  summary: string;
  /** The Recipe card headline, such as "6 scoops + 150 mL water". */
  recipe: string;
  /** What the Recipe makes, such as "170.0 mL at 23.61 kcal/30 mL". */
  makes: string;
  kcalPerMl: string;
  kcalNeeded: string;
  /** `working` ends with scoops before rounding up; `value` is rounded up. */
  scoops: WorkingLine;
  actualKcal: WorkingLine;
  totalDisplacement: WorkingLine;
  /** `working` ends with the water before rounding up; `value` is rounded up to 5 mL. */
  water: WorkingLine;
  actualVolume: WorkingLine;
  actualConcentration: WorkingLine;
  brief: RecipeBrief;
  /** The same steps with one fewer scoop; `used` when it's the Fewer-scoops suggestion. */
  oneFewerScoop: (RecipeBrief & { used: boolean }) | null;
};

/** The numbers /building-a-recipe shows for one worked example, from the Recipe maths module. */
export function recipeWalkthrough(example: WorkedExample, target: Target): RecipeWalkthrough {
  // kcal per scoop and displacement as /reading-labels shows them, so the pages agree.
  const label = readingLabelsWorking(example);
  const kcalPerScoop = label.kcalPerScoop.value;
  const displacement = label.displacement.value;
  const result = calculateRecipe({
    kcalPerScoop: Number(kcalPerScoop),
    displacement: Number(displacement),
    targetVolume: target.volume,
    targetConcentration: target.concentration,
  });
  if (result.kind !== "recipe") throw new Error(`${example.name}: no Recipe for this target`);

  const kcalPerMl = formatKcalPerMl(result.kcalPerMl);
  const kcalNeeded = formatKcalNeeded(result.kcalNeeded);
  const { recipe } = result;
  return {
    summary: `${target.volume} mL at ${target.concentration} · ${kcalPerScoop} kcal, ${displacement} mL`,
    recipe: `${recipeText(recipe)} water`,
    makes: `${makesText(recipe)} kcal/30 mL`,
    kcalPerMl: `${target.concentration} ÷ 30 = ${kcalPerMl}`,
    kcalNeeded: `${target.volume} × ${kcalPerMl} = ${kcalNeeded}`,
    scoops: {
      working: `${kcalNeeded} ÷ ${kcalPerScoop} = ${formatExactScoops(result.exactScoops)}`,
      value: formatScoops(recipe.scoops),
    },
    ...stepsFourToEight(recipe, kcalPerScoop, displacement, kcalPerMl),
    brief: brief(recipe, target),
    oneFewerScoop: result.oneFewerScoop && {
      ...brief(result.oneFewerScoop, target),
      used: result.suggestion !== null,
    },
  };
}

/** Steps 4–8 for a Recipe with a given number of scoops. */
function stepsFourToEight(recipe: Recipe, kcalPerScoop: string, displacement: string, kcalPerMl: string) {
  const scoops = formatScoops(recipe.scoops);
  const actualKcal = formatKcal(recipe.actualKcal);
  const totalDisplacement = formatVolume(recipe.totalDisplacement);
  const water = formatWater(recipe.water);
  const actualVolume = formatVolume(recipe.actualVolume);
  const actualConcentration = formatConcentration(recipe.actualConcentration);
  return {
    actualKcal: line(`${scoops} × ${kcalPerScoop}`, actualKcal),
    totalDisplacement: line(`${scoops} × ${displacement}`, totalDisplacement),
    water: {
      working: `${actualKcal} ÷ ${kcalPerMl} − ${totalDisplacement} = ${formatVolume(recipe.exactWater)}`,
      value: water,
    },
    actualVolume: line(`${water} + ${totalDisplacement}`, actualVolume),
    actualConcentration: line(`${actualKcal} ÷ ${actualVolume} × 30`, actualConcentration),
  };
}

const line = (sum: string, value: string): WorkingLine => ({ working: `${sum} = ${value}`, value });

const scoopsText = (recipe: Recipe): string =>
  `${formatScoops(recipe.scoops)} ${scoopsNoun(recipe.scoops)}`;

/** "170.0 mL at 23.61". */
const makesText = (recipe: Recipe): string =>
  `${formatVolume(recipe.actualVolume)} mL at ${formatConcentration(recipe.actualConcentration)}`;

/** "6 scoops + 150 mL". */
const recipeText = (recipe: Recipe): string => `${scoopsText(recipe)} + ${formatWater(recipe.water)} mL`;

function brief(recipe: Recipe, target: Target): RecipeBrief {
  const actualVolume = formatVolume(recipe.actualVolume);
  // From the volume as shown, so the reader's own subtraction agrees (150 − 141.7 = 8.3, not 8.35).
  const difference = Number(actualVolume) - target.volume;
  const fromTarget =
    difference === 0
      ? "on the Target volume"
      : `${formatVolumeDifference(Math.abs(difference))} mL ${difference < 0 ? "short" : "over"}`;
  return { recipe: recipeText(recipe), actualVolume, makes: makesText(recipe), fromTarget };
}
