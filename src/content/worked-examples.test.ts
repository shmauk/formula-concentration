import { describe, expect, it } from "vitest";
import { aptamilGoldPlus1, describeLabel, nanOptipro1 } from "./worked-examples";

describe("describeLabel", () => {
  it("words NAN OPTIPRO 1's label values as the label does", () => {
    expect(describeLabel(nanOptipro1)).toEqual({
      energy: "67 kcal per 100 mL",
      reconstitutionStatement: "129 g powder + 900 mL water makes 1 L",
      gramsPerScoop: "Average scoop weight = 4.3 g",
      labelAccessed: "29 Sep 2026",
    });
  });

  it("keeps Aptamil Gold+ 1's \"approximately\" and counts its powder in scoops", () => {
    expect(describeLabel(aptamilGoldPlus1)).toEqual({
      energy: "69 kcal per 100 mL",
      reconstitutionStatement: "1 scoop + 50 mL water makes approximately 55 mL",
      gramsPerScoop: "1 scoop = 7.5 g",
      labelAccessed: "29 Sep 2026",
    });
  });
});
