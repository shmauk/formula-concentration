import { describe, expect, it } from "vitest";
import { deriveFromLabel, type LabelInputs } from "./label-helper";

describe("deriveFromLabel", () => {
  it("NAN OPTIPRO 1 (grams route) gives 22.3 kcal per scoop and 0.775 mL per g displacement", () => {
    const result = deriveFromLabel({
      kcalPer100Ml: 67,
      water: 900,
      preparedVolume: 1000,
      gramsPerScoop: 4.3,
      powder: { route: "grams", grams: 129 },
    });
    expect(result?.scoops).toBeCloseTo(30, 9);
    expect(result?.grams).toBe(129);
    expect(result?.kcalPerScoop).toBeCloseTo(22.3333, 4);
    expect(result?.displacement).toBeCloseTo(100 / 129, 9);
    expect(result?.display).toEqual({ kcalPerScoop: "22.3", displacement: "0.775" });
  });

  it("Aptamil Gold+ 1 (scoops route) gives 38.0 kcal per scoop, rounding 37.95 half up", () => {
    const result = deriveFromLabel({
      kcalPer100Ml: 69,
      water: 50,
      preparedVolume: 55,
      gramsPerScoop: 7.5,
      powder: { route: "scoops", scoops: 1 },
    });
    expect(result?.grams).toBe(7.5);
    expect(result?.kcalPerScoop).toBeCloseTo(37.95, 9);
    expect(result?.displacement).toBeCloseTo(5 / 7.5, 9);
    expect(result?.display).toEqual({ kcalPerScoop: "38.0", displacement: "0.667" });
  });

  it("divides by the grams of powder on the scoops route", () => {
    const result = deriveFromLabel({
      kcalPer100Ml: 70,
      water: 60,
      preparedVolume: 67,
      gramsPerScoop: 4.6,
      powder: { route: "scoops", scoops: 2 },
    });
    expect(result?.grams).toBeCloseTo(9.2, 9);
    expect(result?.displacement).toBeCloseTo(7 / 9.2, 9);
  });

  it("does not round fractional scoops on the grams route", () => {
    const result = deriveFromLabel({
      kcalPer100Ml: 67,
      water: 90,
      preparedVolume: 100,
      gramsPerScoop: 4.5,
      powder: { route: "grams", grams: 13.6 },
    });
    expect(result?.scoops).toBeCloseTo(3.0222, 4);
    expect(result?.displacement).toBeCloseTo(10 / 13.6, 9);
  });

  it("accepts numeric strings, as typed into a form field", () => {
    const result = deriveFromLabel({
      kcalPer100Ml: "69",
      water: "50",
      preparedVolume: "55",
      gramsPerScoop: "7.5",
      powder: { route: "scoops", scoops: "1" },
    });
    expect(result?.display).toEqual({ kcalPerScoop: "38.0", displacement: "0.667" });
  });

  const valid: LabelInputs = {
    kcalPer100Ml: 67,
    water: 900,
    preparedVolume: 1000,
    gramsPerScoop: 4.3,
    powder: { route: "grams", grams: 129 },
  };

  it.each([
    ["blank kcal per 100 mL", { ...valid, kcalPer100Ml: "" }],
    ["non-numeric water", { ...valid, water: "abc" }],
    ["zero prepared volume", { ...valid, preparedVolume: 0 }],
    ["negative grams", { ...valid, powder: { route: "grams", grams: -1 } }],
    ["blank grams per scoop on the grams route", { ...valid, gramsPerScoop: null }],
    ["blank grams per scoop on the scoops route", { ...valid, gramsPerScoop: "", powder: { route: "scoops", scoops: 1 } }],
    ["zero scoops", { ...valid, powder: { route: "scoops", scoops: 0 } }],
    ["prepared volume equal to water", { ...valid, preparedVolume: 900 }],
    ["prepared volume below water", { ...valid, preparedVolume: 850 }],
  ] satisfies [string, LabelInputs][])("%s gives no result", (_label, inputs) => {
    expect(deriveFromLabel(inputs)).toBeNull();
  });
});
