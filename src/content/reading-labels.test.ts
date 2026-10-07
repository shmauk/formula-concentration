import { describe, expect, it } from "vitest";
import { readingLabelsWorking } from "./reading-labels";
import { aptamilGoldPlus1, nanOptipro1 } from "./worked-examples";

// Expected strings come from the ticket (#26). If one of these fails, a
// change in the recipe maths module has altered a number on /reading-labels.
describe("readingLabelsWorking", () => {
  it("works NAN OPTIPRO 1 through the grams route", () => {
    const working = readingLabelsWorking(nanOptipro1);
    expect(working.scoops).toEqual({ working: "129 ÷ 4.3 = 30", value: "30" });
    expect(working.displacement).toEqual({ working: "(1000 − 900) ÷ 129 = 0.775", value: "0.775" });
    expect(working.kcalPerScoop).toEqual({ working: "67 × (1000 ÷ 30) ÷ 100 = 22.3", value: "22.3" });
  });

  it("works Aptamil Gold+ 1, whose Reconstitution statement is already in scoops", () => {
    const working = readingLabelsWorking(aptamilGoldPlus1);
    expect(working.scoops).toEqual({ working: null, value: "1" });
    expect(working.displacement).toEqual({ working: "(55 − 50) ÷ 7.5 = 0.667", value: "0.667" });
    expect(working.kcalPerScoop).toEqual({ working: "69 × 55 ÷ 100 = 38.0", value: "38.0" });
  });

  it("counts the grams in a statement of several scoops", () => {
    const working = readingLabelsWorking({
      ...aptamilGoldPlus1,
      gramsPerScoop: 4.6,
      reconstitutionStatement: { powder: { route: "scoops", scoops: 2 }, water: 60, preparedVolume: 67, approximate: true },
    });
    expect(working.displacement).toEqual({ working: "(67 − 60) ÷ (2 × 4.6) = 0.761", value: "0.761" });
  });
});
