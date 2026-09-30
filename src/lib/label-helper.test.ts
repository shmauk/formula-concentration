import { describe, expect, it } from "vitest";
import { deriveFromLabel, type LabelInputs } from "./label-helper";

describe("deriveFromLabel", () => {
  it("NAN OPTIPRO 1 (grams route) gives 22.3 Kcal per scoop and 3.33 mL Displacement", () => {
    const result = deriveFromLabel({
      kcalPer100Ml: 67,
      water: 900,
      preparedVolume: 1000,
      powder: { route: "grams", grams: 129, gramsPerScoop: 4.3 },
    });
    expect(result?.scoops).toBeCloseTo(30, 9);
    expect(result?.kcalPerScoop).toBeCloseTo(22.3333, 4);
    expect(result?.displacement).toBeCloseTo(3.3333, 4);
    expect(result?.display).toEqual({ kcalPerScoop: "22.3", displacement: "3.33" });
  });

  it("Aptamil Gold+ 1 (Scoops route) gives 38.0 Kcal per scoop, rounding 37.95 half up", () => {
    const result = deriveFromLabel({
      kcalPer100Ml: 69,
      water: 50,
      preparedVolume: 55,
      powder: { route: "scoops", scoops: 1 },
    });
    expect(result?.kcalPerScoop).toBeCloseTo(37.95, 9);
    expect(result?.displacement).toBe(5);
    expect(result?.display).toEqual({ kcalPerScoop: "38.0", displacement: "5.00" });
  });

  it("does not round fractional Scoops on the grams route", () => {
    const result = deriveFromLabel({
      kcalPer100Ml: 67,
      water: 90,
      preparedVolume: 100,
      powder: { route: "grams", grams: 13.6, gramsPerScoop: 4.5 },
    });
    expect(result?.scoops).toBeCloseTo(3.0222, 4);
    expect(result?.displacement).toBeCloseTo(10 / (13.6 / 4.5), 9);
  });

  it("accepts numeric strings, as typed into a form field", () => {
    const result = deriveFromLabel({
      kcalPer100Ml: "69",
      water: "50",
      preparedVolume: "55",
      powder: { route: "scoops", scoops: "1" },
    });
    expect(result?.display).toEqual({ kcalPerScoop: "38.0", displacement: "5.00" });
  });

  const valid: LabelInputs = {
    kcalPer100Ml: 67,
    water: 900,
    preparedVolume: 1000,
    powder: { route: "grams", grams: 129, gramsPerScoop: 4.3 },
  };

  it.each([
    ["blank kcal per 100 mL", { ...valid, kcalPer100Ml: "" }],
    ["non-numeric water", { ...valid, water: "abc" }],
    ["zero prepared volume", { ...valid, preparedVolume: 0 }],
    ["negative grams", { ...valid, powder: { route: "grams", grams: -1, gramsPerScoop: 4.3 } }],
    ["blank Grams per scoop", { ...valid, powder: { route: "grams", grams: 129, gramsPerScoop: null } }],
    ["zero Scoops", { ...valid, powder: { route: "scoops", scoops: 0 } }],
    ["prepared volume equal to water", { ...valid, preparedVolume: 900 }],
    ["prepared volume below water", { ...valid, preparedVolume: 850 }],
  ] satisfies [string, LabelInputs][])("%s gives no result", (_label, inputs) => {
    expect(deriveFromLabel(inputs)).toBeNull();
  });
});
