import { describe, expect, it } from "vitest";
import {
  formatConcentration,
  formatDisplacement,
  formatExactScoops,
  formatKcal,
  formatKcalNeeded,
  formatKcalPerMl,
  formatScoops,
  scoopsNoun,
  formatVolume,
  formatVolumeDifference,
  formatWater,
} from "./format";

describe("formatting", () => {
  it("shows kcal to 1 dp", () => {
    expect(formatKcal(133.8)).toBe("133.8");
    expect(formatKcal(152)).toBe("152.0");
    expect(formatKcal(22.333333)).toBe("22.3");
  });

  it("shows volumes to 1 dp", () => {
    expect(formatVolume(169.98)).toBe("170.0");
    expect(formatVolume(141.65)).toBe("141.7");
    expect(formatVolume(51.66)).toBe("51.7");
  });

  it("shows Concentration to 2 dp", () => {
    expect(formatConcentration(24)).toBe("24.00");
    expect(formatConcentration(23.6112)).toBe("23.61");
    expect(formatConcentration(19.542857)).toBe("19.54");
  });

  it("shows displacement to 2 dp", () => {
    expect(formatDisplacement(3.333333)).toBe("3.33");
    expect(formatDisplacement(5)).toBe("5.00");
  });

  it("shows water and scoops as whole numbers", () => {
    expect(formatWater(170)).toBe("170");
    expect(formatScoops(6)).toBe("6");
  });

  it("names one scoop in the singular and any other count in the plural", () => {
    expect(scoopsNoun(1)).toBe("scoop");
    expect(scoopsNoun(2)).toBe("scoops");
    expect(scoopsNoun(6)).toBe("scoops");
  });

  it("rounds halves up even where floating point stores them just below", () => {
    // Plain toFixed gives 0.1, 1.4, 1.00 and 2.67 for these.
    expect(formatKcal(0.15)).toBe("0.2");
    expect(formatVolume(1.45)).toBe("1.5");
    expect(formatConcentration(1.005)).toBe("1.01");
    expect(formatDisplacement(2.675)).toBe("2.68");
    expect(formatKcal(37.95)).toBe("38.0");
  });

  it("does not round up values that are genuinely below the half", () => {
    expect(formatConcentration(1.0049)).toBe("1.00");
    expect(formatKcal(37.9499)).toBe("37.9");
  });

  it("shows kcal/mL to at most 3 dp, without trailing zeros", () => {
    expect(formatKcalPerMl(24 / 30)).toBe("0.8");
    expect(formatKcalPerMl(20 / 30)).toBe("0.667");
    expect(formatKcalPerMl(30 / 30)).toBe("1");
  });

  it("shows kcal needed to 1 dp, dropping a trailing .0", () => {
    expect(formatKcalNeeded(150 * (24 / 30))).toBe("120");
    expect(formatKcalNeeded(100 * (20 / 30))).toBe("66.7");
  });

  it("shows scoops before rounding up to 2 dp", () => {
    expect(formatExactScoops(120 / 22.3)).toBe("5.38");
    expect(formatExactScoops(120 / 38)).toBe("3.16");
    expect(formatExactScoops(4)).toBe("4.00");
  });

  it("shows a volume difference to 1 dp, dropping a trailing .0", () => {
    expect(formatVolumeDifference(150 - 141.7)).toBe("8.3");
    expect(formatVolumeDifference(170 - 150)).toBe("20");
    expect(formatVolumeDifference(40)).toBe("40");
  });
});
