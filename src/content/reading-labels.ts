import { deriveFromLabel, formatScoops } from "../lib";
import type { WorkedExample } from "./worked-examples";

export type WorkingLine = {
  /** The sum with the example's numbers, ending "= value". */
  working: string;
  value: string;
};

export type ReadingLabelsWorking = {
  /** `working` is null when the Reconstitution statement already counts Scoops. */
  scoops: { working: string | null; value: string };
  displacement: WorkingLine;
  kcalPerScoop: WorkingLine;
};

/** The numbers /reading-labels shows for one worked example, from the Recipe maths module. */
export function readingLabelsWorking(example: WorkedExample): ReadingLabelsWorking {
  const { kcalPer100Ml, reconstitutionStatement: statement, gramsPerScoop } = example;
  const { powder, water, preparedVolume } = statement;
  const derived = deriveFromLabel({
    kcalPer100Ml,
    water,
    preparedVolume,
    powder:
      powder.route === "grams"
        ? { route: "grams", grams: powder.grams, gramsPerScoop }
        : { route: "scoops", scoops: powder.scoops },
  });
  if (derived === null) throw new Error(`${example.name}: the label values don't give a result`);

  const scoops = formatScoops(derived.scoops);
  if (Math.abs(derived.scoops - Number(scoops)) > 1e-9) {
    throw new Error(`${example.name}: the Reconstitution statement isn't a whole number of Scoops`);
  }
  const { kcalPerScoop, displacement } = derived.display;

  // "× (55 ÷ 1)" is just "× 55".
  const volumePerScoop = scoops === "1" ? `${preparedVolume}` : `(${preparedVolume} ÷ ${scoops})`;

  return {
    scoops: {
      working: powder.route === "grams" ? `${powder.grams} ÷ ${gramsPerScoop} = ${scoops}` : null,
      value: scoops,
    },
    displacement: {
      working: `(${preparedVolume} − ${water}) ÷ ${scoops} = ${displacement}`,
      value: displacement,
    },
    kcalPerScoop: {
      working: `${kcalPer100Ml} × ${volumePerScoop} ÷ 100 = ${kcalPerScoop}`,
      value: kcalPerScoop,
    },
  };
}
