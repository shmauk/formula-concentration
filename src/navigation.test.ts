import { describe, expect, it } from "vitest";
import { isCurrentPage } from "./navigation";

describe("isCurrentPage", () => {
  it("matches the page's own path", () => {
    expect(isCurrentPage("/calculator", "/calculator")).toBe(true);
  });

  it("ignores a trailing slash", () => {
    expect(isCurrentPage("/calculator/", "/calculator")).toBe(true);
  });

  it("doesn't match a different page", () => {
    expect(isCurrentPage("/reading-labels", "/calculator")).toBe(false);
  });
});
