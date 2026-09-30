import { describe, expect, it } from "vitest";
import { formatConcentration, formatScoops, formatVolume, formatWater } from "./format";
import { calculateRecipe, type Recipe, type RecipeField, type RecipeInput } from "./recipe";

function recipeFor(kcalPerScoop: number, displacement: number, targetVolume: number, targetConcentration: number) {
  const result = calculateRecipe({ kcalPerScoop, displacement, targetVolume, targetConcentration });
  if (result.kind !== "recipe") throw new Error("expected a Recipe");
  return result;
}

describe("calculateRecipe", () => {
  it("NAN 22.3 / 3.33 / 150 / 24 gives 6 Scoops + 150 mL", () => {
    const { recipe } = recipeFor(22.3, 3.33, 150, 24);
    expect(recipe.scoops).toBe(6);
    expect(recipe.water).toBe(150);
    expect(recipe.actualVolume).toBeCloseTo(169.98, 9);
    expect(recipe.actualConcentration).toBeCloseTo(23.61, 2);
    expect(recipe.concentrationWarning).toBe(false);
  });

  it("Karicare 37.4 / 5 / 120 / 24 warns on the Recipe (0.79 under)", () => {
    const { recipe } = recipeFor(37.4, 5, 120, 24);
    expect(recipe.scoops).toBe(3);
    expect(recipe.water).toBe(130);
    expect(recipe.actualVolume).toBe(145);
    expect(recipe.actualConcentration).toBeCloseTo(23.21, 2);
    expect(recipe.concentrationWarning).toBe(true);
  });

  it("warns when the Actual concentration is exactly 0.5 under the Target concentration", () => {
    // 1 Scoop + 25 mL -> 30 mL at 31.0 against 31.5. Floating point computes the drift as 0.4999999999999964.
    const { recipe } = recipeFor(31, 5, 20, 31.5);
    expect(recipe.scoops).toBe(1);
    expect(recipe.water).toBe(25);
    expect(recipe.actualVolume).toBe(30);
    expect(recipe.concentrationWarning).toBe(true);
  });

  it("does not warn when the Actual concentration is under 0.5 below the Target concentration", () => {
    // Aptamil 38.0 / 5 / 150 / 20: 0.46 under.
    const { recipe } = recipeFor(38, 5, 150, 20);
    expect(recipe.scoops).toBe(3);
    expect(recipe.water).toBe(160);
    expect(recipe.actualVolume).toBe(175);
    expect(recipe.actualConcentration).toBeCloseTo(19.54, 2);
    expect(recipe.concentrationWarning).toBe(false);
  });
});

describe("Fewer-Scoops suggestion", () => {
  it("NAN 22.3 / 3.33 / 150 / 24 suggests 5 Scoops + 125 mL", () => {
    const { suggestion } = recipeFor(22.3, 3.33, 150, 24);
    expect(suggestion?.scoops).toBe(5);
    expect(suggestion?.water).toBe(125);
    expect(suggestion?.actualVolume).toBeCloseTo(141.65, 9);
    expect(suggestion?.actualConcentration).toBeCloseTo(23.61, 2);
    expect(suggestion?.concentrationWarning).toBe(false);
  });

  it("Aptamil 38.0 / 5 / 150 / 24 suggests 3 Scoops + 130 mL", () => {
    const { recipe, suggestion } = recipeFor(38, 5, 150, 24);
    expect(recipe.scoops).toBe(4);
    expect(recipe.water).toBe(170);
    expect(recipe.actualVolume).toBe(190);
    expect(recipe.actualConcentration).toBeCloseTo(24.0, 2);
    expect(recipe.concentrationWarning).toBe(false);
    expect(suggestion?.scoops).toBe(3);
    expect(suggestion?.water).toBe(130);
    expect(suggestion?.actualVolume).toBe(145);
    expect(suggestion?.actualConcentration).toBeCloseTo(23.59, 2);
    expect(suggestion?.concentrationWarning).toBe(false);
  });

  it("NAN 22.3 / 3.33 / 60 / 27 suggests 2 Scoops + 45 mL, which warns", () => {
    const { recipe, suggestion } = recipeFor(22.3, 3.33, 60, 27);
    expect(recipe.scoops).toBe(3);
    expect(recipe.water).toBe(65);
    expect(recipe.actualVolume).toBeCloseTo(74.99, 9);
    expect(recipe.actualConcentration).toBeCloseTo(26.76, 2);
    expect(recipe.concentrationWarning).toBe(false);
    expect(suggestion?.scoops).toBe(2);
    expect(suggestion?.water).toBe(45);
    expect(suggestion?.actualVolume).toBeCloseTo(51.66, 9);
    expect(suggestion?.actualConcentration).toBeCloseTo(25.9, 2);
    expect(suggestion?.concentrationWarning).toBe(true);
  });

  it("is not offered when one fewer Scoop lands more than 10 mL from the Target volume", () => {
    // Aptamil 38.0 / 5 / 150 / 20: 2 Scoops + 105 mL -> 115.0 mL is 35 mL short.
    expect(recipeFor(38, 5, 150, 20).suggestion).toBeNull();
  });

  it("is not offered when one fewer Scoop is no closer to the Target volume", () => {
    // Karicare 37.4 / 5 / 120 / 24: 145 mL is 25 mL over; 2 Scoops + 85 mL -> 95 mL is 25 mL under.
    expect(recipeFor(37.4, 5, 120, 24).suggestion).toBeNull();
  });

  it("is not offered when the Recipe is a single Scoop", () => {
    const { recipe, suggestion } = recipeFor(31, 5, 20, 31.5);
    expect(recipe.scoops).toBe(1);
    expect(suggestion).toBeNull();
  });
});

describe("floating-point snapping", () => {
  it("23 kcal per scoop, 150 mL at 23 gives 5 Scoops, not 6", () => {
    expect(recipeFor(23, 4, 150, 23).recipe.scoops).toBe(5);
  });

  it("15 / 5 / 205 / 22 gives 170 mL water, not 175", () => {
    expect(recipeFor(15, 5, 205, 22).recipe.water).toBe(170);
  });
});

describe("working values", () => {
  it("exposes the intermediate values page 2 prints", () => {
    // Aptamil 38.0 / 5 / 150 / 24: 0.8 kcal/mL, 120 kcal needed, 3.157... Scoops -> 4,
    // 152 kcal, 20 mL Displacement, 190 - 20 = 170 mL water exactly.
    const result = recipeFor(38, 5, 150, 24);
    expect(result.kcalPerMl).toBeCloseTo(0.8, 12);
    expect(result.kcalNeeded).toBeCloseTo(120, 9);
    expect(result.exactScoops).toBeCloseTo(3.157894736842, 9);
    expect(result.recipe.actualKcal).toBe(152);
    expect(result.recipe.totalDisplacement).toBe(20);
    expect(result.recipe.exactWater).toBeCloseTo(170, 9);
  });
});

const validInputs = { kcalPerScoop: 22.3, displacement: 3.33, targetVolume: 150, targetConcentration: 24 };

function withInput(field: RecipeField, value: RecipeInput) {
  return calculateRecipe({ ...validInputs, [field]: value });
}

describe("input validation", () => {
  it("marks typical inputs ok", () => {
    expect(calculateRecipe(validInputs).validation).toEqual({
      kcalPerScoop: "ok",
      displacement: "ok",
      targetVolume: "ok",
      targetConcentration: "ok",
    });
  });

  it("accepts numeric strings, as typed into a form field", () => {
    const result = calculateRecipe({ kcalPerScoop: " 22.3 ", displacement: "3.33", targetVolume: "150", targetConcentration: "24" });
    expect(result.kind).toBe("recipe");
    if (result.kind === "recipe") expect(result.recipe.scoops).toBe(6);
  });

  const typicalRanges: [RecipeField, number, number, number][] = [
    // field, min, max, a small step for "just inside/outside"
    ["kcalPerScoop", 10, 50, 0.1],
    ["displacement", 1, 10, 0.01],
    ["targetVolume", 20, 1000, 1],
    ["targetConcentration", 20, 36, 0.1],
  ];

  describe.each(typicalRanges)("%s typical range %d to %d", (field, min, max, step) => {
    it.each([
      [min - step, "unusual"],
      [min, "ok"],
      [min + step, "ok"],
      [max - step, "ok"],
      [max, "ok"],
      [max + step, "unusual"],
    ])("%d is %s", (value, status) => {
      const result = withInput(field, value);
      expect(result.validation[field]).toBe(status);
      expect(result.kind).toBe("recipe");
    });
  });

  describe.each(typicalRanges.map(([field]) => field))("%s impossible values", (field) => {
    it.each([
      ["blank", ""],
      ["whitespace", "   "],
      ["null", null],
      ["undefined", undefined],
      ["non-numeric text", "abc"],
      ["partly numeric text", "12abc"],
      ["NaN", Number.NaN],
      ["Infinity", Number.POSITIVE_INFINITY],
      ["zero", 0],
      ["negative", -5],
    ])("%s gives no Recipe", (_label, value) => {
      const result = withInput(field, value);
      expect(result.kind).toBe("impossible");
      expect(result.validation[field]).toBe("impossible");
    });
  });

  it("still reports the status of the other inputs when one is impossible", () => {
    const result = calculateRecipe({ ...validInputs, targetVolume: "", targetConcentration: 40 });
    expect(result.validation).toEqual({
      kcalPerScoop: "ok",
      displacement: "ok",
      targetVolume: "impossible",
      targetConcentration: "unusual",
    });
  });
});

describe("display values from the ticket's Recipe table", () => {
  const display = (r: Recipe | null) =>
    r &&
    `${formatScoops(r.scoops)} Scoops + ${formatWater(r.water)} mL → ${formatVolume(r.actualVolume)} mL at ${formatConcentration(r.actualConcentration)}`;

  it.each([
    [22.3, 3.33, 150, 24, "6 Scoops + 150 mL → 170.0 mL at 23.61", "5 Scoops + 125 mL → 141.7 mL at 23.61"],
    [38, 5, 150, 24, "4 Scoops + 170 mL → 190.0 mL at 24.00", "3 Scoops + 130 mL → 145.0 mL at 23.59"],
    [38, 5, 150, 20, "3 Scoops + 160 mL → 175.0 mL at 19.54", null],
    [22.3, 3.33, 60, 27, "3 Scoops + 65 mL → 75.0 mL at 26.76", "2 Scoops + 45 mL → 51.7 mL at 25.90"],
    [37.4, 5, 120, 24, "3 Scoops + 130 mL → 145.0 mL at 23.21", null],
  ])("%s / %s / %s / %s shows %s", (kcal, displacement, volume, concentration, expectedRecipe, expectedSuggestion) => {
    const { recipe, suggestion } = recipeFor(kcal, displacement, volume, concentration);
    expect(display(recipe)).toBe(expectedRecipe);
    expect(display(suggestion)).toBe(expectedSuggestion);
  });
});
