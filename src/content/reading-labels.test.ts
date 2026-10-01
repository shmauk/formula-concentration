import { describe, expect, it } from "vitest";
import { readingLabelsWorking } from "./reading-labels";
import { aptamilGoldPlus1, nanOptipro1 } from "./worked-examples";

// Expected strings come from the ticket (#26). If one of these fails, a
// change in the recipe maths module has altered a number on /reading-labels.
describe("readingLabelsWorking", () => {
  it("works NAN OPTIPRO 1 through the grams route", () => {
    const working = readingLabelsWorking(nanOptipro1);
    expect(working.scoops).toEqual({ working: "129 ÷ 4.3 = 30", value: "30" });
    expect(working.displacement).toEqual({ working: "(1000 − 900) ÷ 30 = 3.33", value: "3.33" });
    expect(working.kcalPerScoop).toEqual({ working: "67 × (1000 ÷ 30) ÷ 100 = 22.3", value: "22.3" });
  });

  it("works Aptamil Gold+ 1, whose Reconstitution statement is already in scoops", () => {
    const working = readingLabelsWorking(aptamilGoldPlus1);
    expect(working.scoops).toEqual({ working: null, value: "1" });
    expect(working.displacement).toEqual({ working: "(55 − 50) ÷ 1 = 5.00", value: "5.00" });
    expect(working.kcalPerScoop).toEqual({ working: "69 × 55 ÷ 100 = 38.0", value: "38.0" });
  });
});
