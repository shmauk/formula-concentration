import { deriveFromLabel, formatScoops } from "../lib";
import type { WorkedExample } from "./worked-examples";

export type WorkingLine = {
  /** The sum with the example's numbers, ending "= value". */
  working: string;
  value: string;
};

export type ReadingLabelsWorking = {
  /** `working` is null when the Reconstitution statement already counts scoops. */
  scoops: { working: string | null; value: string };
  displacement: WorkingLine;
  kcalPerScoop: WorkingLine;
};

/** The numbers /reading-labels shows for one worked example, from the recipe maths module. */
export function readingLabelsWorking(example: WorkedExample): ReadingLabelsWorking {
  const { kcalPer100Ml, reconstitutionStatement: statement, gramsPerScoop } = example;
  const { powder, water, preparedVolume } = statement;
  const derived = deriveFromLabel({ kcalPer100Ml, water, preparedVolume, gramsPerScoop, powder });
  if (derived === null) throw new Error(`${example.name}: the label values don't give a result`);

  const scoops = formatScoops(derived.scoops);
  if (Math.abs(derived.scoops - Number(scoops)) > 1e-9) {
    throw new Error(`${example.name}: the Reconstitution statement isn't a whole number of scoops`);
  }
  const { kcalPerScoop, displacement } = derived.display;

  // "× (55 ÷ 1)" is just "× 55", and "÷ (1 × 7.5)" is just "÷ 7.5".
  const volumePerScoop = scoops === "1" ? `${preparedVolume}` : `(${preparedVolume} ÷ ${scoops})`;
  const grams =
    powder.route === "grams" ? `${powder.grams}` : scoops === "1" ? `${gramsPerScoop}` : `(${scoops} × ${gramsPerScoop})`;

  return {
    scoops: {
      working: powder.route === "grams" ? `${powder.grams} ÷ ${gramsPerScoop} = ${scoops}` : null,
      value: scoops,
    },
    displacement: {
      working: `(${preparedVolume} − ${water}) ÷ ${grams} = ${displacement}`,
      value: displacement,
    },
    kcalPerScoop: {
      working: `${kcalPer100Ml} × ${volumePerScoop} ÷ 100 = ${kcalPerScoop}`,
      value: kcalPerScoop,
    },
  };
}
