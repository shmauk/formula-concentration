/**
 * The worksheet's inputs. Formulas A–F are made up, with realistic AU/NZ-style
 * labels, so nobody mistakes them for current label data. Every answer is
 * computed from these by build.ts with the site's recipe maths.
 */
import type { Target } from "../../src/content/building-a-recipe";
import type { StatementPowder } from "../../src/content/worked-examples";

/** A made-up formula's label, as it would print it. */
export type Label = {
  name: string;
  /** kcal per 100 mL of prepared formula. */
  kcalPer100Ml: number;
  reconstitutionStatement: {
    powder: StatementPowder;
    /** mL of water. */
    water: number;
    /** mL of prepared formula it makes. */
    preparedVolume: number;
    approximate: boolean;
  };
  gramsPerScoop: number;
  gramsPerScoopWording: string;
};

/** kcal per scoop and displacement given outright, for recipe-only exercises. */
export type GivenFormula = {
  name: string;
  /** kcal. */
  kcalPerScoop: number;
  /** mL per scoop. */
  displacement: number;
};

export type Exercise =
  | { kind: "label"; label: Label }
  | { kind: "recipe"; formula: GivenFormula; target: Target; expectWarning: boolean }
  | { kind: "full"; label: Label; target: Target }
  | { kind: "concept"; parts: readonly { question: string; answer: string }[] };

const formulaA: Label = {
  name: "Formula A",
  kcalPer100Ml: 68,
  reconstitutionStatement: {
    powder: { route: "scoops", scoops: 2 },
    water: 60,
    preparedVolume: 67,
    approximate: true,
  },
  gramsPerScoop: 4.6,
  gramsPerScoopWording: "1 scoop = 4.6 g",
};

const formulaB: Label = {
  name: "Formula B",
  kcalPer100Ml: 66,
  reconstitutionStatement: {
    powder: { route: "grams", grams: 132 },
    water: 900,
    preparedVolume: 1000,
    approximate: false,
  },
  gramsPerScoop: 4.4,
  gramsPerScoopWording: "Average scoop weight = 4.4 g",
};

const formulaC: GivenFormula = { name: "Formula C", kcalPerScoop: 21.5, displacement: 3.2 };

const formulaD: GivenFormula = { name: "Formula D", kcalPerScoop: 36, displacement: 5 };

const formulaE: Label = {
  name: "Formula E",
  kcalPer100Ml: 67,
  reconstitutionStatement: {
    powder: { route: "grams", grams: 135 },
    water: 900,
    preparedVolume: 1000,
    approximate: false,
  },
  gramsPerScoop: 4.5,
  gramsPerScoopWording: "Average scoop weight = 4.5 g",
};

const formulaF: Label = {
  name: "Formula F",
  kcalPer100Ml: 70,
  reconstitutionStatement: {
    powder: { route: "scoops", scoops: 1 },
    water: 30,
    preparedVolume: 33,
    approximate: true,
  },
  gramsPerScoop: 4.4,
  gramsPerScoopWording: "1 scoop = 4.4 g",
};

/** In worksheet order. */
export const exercises: readonly Exercise[] = [
  // The label already counts scoops, so grams per scoop is a distractor.
  { kind: "label", label: formulaA },
  { kind: "label", label: formulaB },
  { kind: "recipe", formula: formulaC, target: { volume: 180, concentration: 20 }, expectWarning: false },
  { kind: "recipe", formula: formulaC, target: { volume: 150, concentration: 27 }, expectWarning: false },
  // A small bottle of an energy-dense formula: one scoop is a big step, so rounding overshoots.
  { kind: "recipe", formula: formulaD, target: { volume: 60, concentration: 30 }, expectWarning: true },
  { kind: "full", label: formulaE, target: { volume: 180, concentration: 24 } },
  { kind: "full", label: formulaF, target: { volume: 120, concentration: 27 } },
  {
    kind: "concept",
    parts: [
      {
        question: "Why isn't the water simply the Target volume?",
        answer:
          "The powder takes up room too. Each scoop adds its displacement to the volume, so water equal to the Target volume would make more than the Target volume, at a lower concentration than intended.",
      },
      {
        question: "Why are scoops rounded up rather than to the nearest whole scoop?",
        answer:
          "You can only use whole scoops, and rounding up makes sure there is at least enough energy. The water is then sized to dilute that energy back to the Target concentration. Rounding down would leave too little energy for the Target volume.",
      },
      {
        question:
          "A recipe's Actual concentration comes out 0.5 kcal/30 mL or more below the Target concentration. What should you do?",
        answer:
          "Double-check the inputs and the working before using it. A large drop usually means a small Target volume with a large scoop, where one scoop is a big step; confirm the result is acceptable for the patient.",
      },
    ],
  },
];
