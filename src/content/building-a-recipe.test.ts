import { describe, expect, it } from "vitest";
import { recipeWalkthrough } from "./building-a-recipe";
import { aptamilGoldPlus1, nanOptipro1 } from "./worked-examples";

// Expected strings come from the ticket (#27). If one of these fails, a
// change in the recipe maths module has altered a number on /building-a-recipe.
const target = { volume: 150, concentration: 24 };

describe("recipeWalkthrough", () => {
  it("works out how many scoops of NAN OPTIPRO 1", () => {
    const working = recipeWalkthrough(nanOptipro1, target);
    expect(working.kcalPerMl).toBe("24 ÷ 30 = 0.8");
    expect(working.kcalNeeded).toBe("150 × 0.8 = 120");
    expect(`${working.scoops.working} → ${working.scoops.value}`).toBe("120 ÷ 22.3 = 5.38 → 6");
  });

  it("works out the water and what NAN OPTIPRO 1 actually gives", () => {
    const working = recipeWalkthrough(nanOptipro1, target);
    expect(working.actualKcal).toEqual({ working: "6 × 22.3 = 133.8", value: "133.8" });
    expect(working.totalPowder).toEqual({ working: "6 × 4.3 = 25.8", value: "25.8" });
    expect(working.totalDisplacement).toEqual({ working: "25.8 × 0.775 = 20.0", value: "20.0" });
    expect(`${working.water.working} → ${working.water.value} mL`).toBe("133.8 ÷ 0.8 − 20.0 = 147.3 → 150 mL");
    expect(working.actualVolume).toEqual({ working: "150 + 20.0 = 170.0", value: "170.0" });
    expect(working.actualConcentration).toEqual({ working: "133.8 ÷ 170.0 × 30 = 23.61", value: "23.61" });
  });

  it("sums up NAN OPTIPRO 1 for the switch and the recipe card", () => {
    const working = recipeWalkthrough(nanOptipro1, target);
    expect(working.summary).toBe("150 mL at 24 · 22.3 kcal, 4.3 g, 0.775 mL per g");
    expect(working.recipe).toBe("6 scoops + 150 mL water");
    expect(working.makes).toBe("170.0 mL at 23.61 kcal/30 mL");
  });

  it("works Aptamil Gold+ 1 through all nine steps", () => {
    const working = recipeWalkthrough(aptamilGoldPlus1, target);
    expect(working.summary).toBe("150 mL at 24 · 38.0 kcal, 7.5 g, 0.667 mL per g");
    expect(working.kcalPerMl).toBe("24 ÷ 30 = 0.8");
    expect(working.kcalNeeded).toBe("150 × 0.8 = 120");
    expect(`${working.scoops.working} → ${working.scoops.value}`).toBe("120 ÷ 38.0 = 3.16 → 4");
    expect(working.actualKcal).toEqual({ working: "4 × 38.0 = 152.0", value: "152.0" });
    expect(working.totalPowder).toEqual({ working: "4 × 7.5 = 30.0", value: "30.0" });
    expect(working.totalDisplacement).toEqual({ working: "30.0 × 0.667 = 20.0", value: "20.0" });
    expect(`${working.water.working} → ${working.water.value} mL`).toBe("152.0 ÷ 0.8 − 20.0 = 170.0 → 170 mL");
    expect(working.actualVolume).toEqual({ working: "170 + 20.0 = 190.0", value: "190.0" });
    expect(working.actualConcentration).toEqual({ working: "152.0 ÷ 190.0 × 30 = 24.00", value: "24.00" });
    expect(working.recipe).toBe("4 scoops + 170 mL water");
    expect(working.makes).toBe("190.0 mL at 24.00 kcal/30 mL");
  });

  it("uses one fewer scoop of NAN OPTIPRO 1: 8.3 mL short beats 20 mL over", () => {
    const { brief, oneFewerScoop } = recipeWalkthrough(nanOptipro1, target);
    expect(brief.fromTarget).toBe("20 mL over");
    expect(oneFewerScoop).toEqual({
      recipe: "5 scoops + 125 mL",
      actualVolume: "141.7",
      makes: "141.7 mL at 23.61",
      fromTarget: "8.3 mL short",
      used: true,
    });
  });

  it("uses one fewer scoop of Aptamil Gold+ 1: 5 mL short beats 40 mL over", () => {
    const { brief, oneFewerScoop } = recipeWalkthrough(aptamilGoldPlus1, target);
    expect(brief.fromTarget).toBe("40 mL over");
    expect(oneFewerScoop).toMatchObject({
      recipe: "3 scoops + 130 mL",
      makes: "145.0 mL at 23.58",
      fromTarget: "5 mL short",
      used: true,
    });
  });

  it("doesn't use one fewer scoop of Aptamil Gold+ 1 at 150 mL at 20: 35 mL short", () => {
    const { brief, oneFewerScoop } = recipeWalkthrough(aptamilGoldPlus1, { volume: 150, concentration: 20 });
    expect(brief.recipe).toBe("3 scoops + 160 mL");
    expect(brief.makes).toBe("175.0 mL at 19.54");
    expect(oneFewerScoop).toMatchObject({
      recipe: "2 scoops + 105 mL",
      actualVolume: "115.0",
      fromTarget: "35 mL short",
      used: false,
    });
  });
});
