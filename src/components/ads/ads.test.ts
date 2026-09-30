import { describe, expect, it } from "vitest";
import { adSizes, adsTxt, parseAdsenseClient, placeholderLabel } from "./ads";

describe("adsTxt", () => {
  it("authorises Google to sell the publisher's inventory", () => {
    expect(adsTxt("ca-pub-1234567890123456")).toBe(
      "google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n",
    );
  });
});

describe("parseAdsenseClient", () => {
  it("returns the publisher ID when it's set", () => {
    expect(parseAdsenseClient("ca-pub-1234567890123456")).toBe(
      "ca-pub-1234567890123456",
    );
  });

  it("ignores surrounding whitespace", () => {
    expect(parseAdsenseClient(" ca-pub-1234567890123456\n")).toBe(
      "ca-pub-1234567890123456",
    );
  });

  it("means placeholder mode when unset or blank", () => {
    expect(parseAdsenseClient(undefined)).toBeUndefined();
    expect(parseAdsenseClient("")).toBeUndefined();
    expect(parseAdsenseClient("  ")).toBeUndefined();
  });

  it("rejects a value that isn't a ca-pub- publisher ID", () => {
    expect(() => parseAdsenseClient("pub-1234567890123456")).toThrow(
      /PUBLIC_ADSENSE_CLIENT/,
    );
    expect(() => parseAdsenseClient("ca-pub-abc")).toThrow(
      /PUBLIC_ADSENSE_CLIENT/,
    );
  });
});

describe("adSizes", () => {
  it("uses a 728×90 leaderboard on desktop and 320×100 on phones", () => {
    expect(adSizes.leaderboard).toEqual({
      desktop: { width: 728, height: 90 },
      phone: { width: 320, height: 100 },
    });
  });

  it("uses a 336×280 rectangle on desktop and 300×250 on phones", () => {
    expect(adSizes.rectangle).toEqual({
      desktop: { width: 336, height: 280 },
      phone: { width: 300, height: 250 },
    });
  });

  it("uses a 300×600 skyscraper", () => {
    expect(adSizes.skyscraper.desktop).toEqual({ width: 300, height: 600 });
  });
});

describe("placeholderLabel", () => {
  it("shows the size and the slot's name", () => {
    expect(placeholderLabel({ width: 336, height: 280 }, "after-result")).toBe(
      "336×280 · after-result",
    );
  });
});
