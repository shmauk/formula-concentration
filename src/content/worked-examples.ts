/**
 * The two formulas the tutorial pages follow along with, as their labels
 * print them. Label values only: every derived number is computed from these
 * with the Recipe maths module at build time.
 *
 * Source: AU/NZ labels as published online (issue #7), not checked against tins.
 */

/** The powder side of a Reconstitution statement, as the label words it. */
export type StatementPowder = { route: "grams"; grams: number } | { route: "scoops"; scoops: number };

export type WorkedExample = {
  /** Stable key for the follow-along switch. */
  id: string;
  name: string;
  /** Energy per 100 mL of prepared formula, kcal, as printed. */
  kcalPer100Ml: number;
  reconstitutionStatement: {
    powder: StatementPowder;
    /** mL of water. */
    water: number;
    /** mL of prepared formula it makes. */
    preparedVolume: number;
    /** The label says "makes approximately". */
    approximate: boolean;
  };
  gramsPerScoop: number;
  /** How the label words Grams per scoop. */
  gramsPerScoopWording: string;
  /** ISO date the label was read. */
  labelAccessed: string;
};

export const nanOptipro1: WorkedExample = {
  id: "nan-optipro-1",
  name: "NAN OPTIPRO 1",
  kcalPer100Ml: 67,
  reconstitutionStatement: {
    powder: { route: "grams", grams: 129 },
    water: 900,
    preparedVolume: 1000,
    approximate: false,
  },
  gramsPerScoop: 4.3,
  gramsPerScoopWording: "Average scoop weight = 4.3 g",
  labelAccessed: "2026-09-29",
};

export const aptamilGoldPlus1: WorkedExample = {
  id: "aptamil-gold-plus-1",
  name: "Aptamil Gold+ 1",
  kcalPer100Ml: 69,
  reconstitutionStatement: {
    powder: { route: "scoops", scoops: 1 },
    water: 50,
    preparedVolume: 55,
    approximate: true,
  },
  gramsPerScoop: 7.5,
  gramsPerScoopWording: "1 scoop = 7.5 g",
  labelAccessed: "2026-09-29",
};

/** In follow-along order. The first is the default. */
export const workedExamples: readonly WorkedExample[] = [nanOptipro1, aptamilGoldPlus1];

export type LabelDescription = {
  energy: string;
  reconstitutionStatement: string;
  gramsPerScoop: string;
  /** For example "29 Sep 2026". */
  labelAccessed: string;
};

/** A worked example's label values as text, worded the way the label words them. */
export function describeLabel(example: WorkedExample): LabelDescription {
  const { powder, water, preparedVolume, approximate } = example.reconstitutionStatement;
  const powderText =
    powder.route === "grams"
      ? `${powder.grams} g powder`
      : `${powder.scoops} ${powder.scoops === 1 ? "scoop" : "scoops"}`;
  return {
    energy: `${example.kcalPer100Ml} kcal per 100 mL`,
    reconstitutionStatement: `${powderText} + ${water} mL water makes ${approximate ? "approximately " : ""}${volumeText(preparedVolume)}`,
    gramsPerScoop: example.gramsPerScoopWording,
    labelAccessed: formatDate(example.labelAccessed),
  };
}

const volumeText = (mL: number): string => (mL % 1000 === 0 ? `${mL / 1000} L` : `${mL} mL`);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-29" → "29 Sep 2026". No Date object, so no time-zone surprises. */
function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}
