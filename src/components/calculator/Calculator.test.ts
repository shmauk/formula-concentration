// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import Calculator from "./Calculator.svelte";

type Values = {
  kcalPerScoop: string;
  displacement: string;
  targetVolume: string;
  targetConcentration: string;
};

async function fillIn(values: Partial<Values>) {
  const user = userEvent.setup();
  const labels: Record<keyof Values, RegExp> = {
    kcalPerScoop: /^Kcal per scoop/,
    displacement: /^Displacement/,
    targetVolume: /^Target volume/,
    targetConcentration: /^Target concentration/,
  };
  for (const [field, value] of Object.entries(values) as [keyof Values, string][]) {
    const input = screen.getByLabelText(labels[field]);
    await user.clear(input);
    await user.type(input, value);
  }
  return user;
}

const recipeCard = () => screen.getByRole("region", { name: "Recipe" });
const suggestionCard = () => screen.queryByRole("region", { name: "Fewer-Scoops suggestion" });

describe("Calculator", () => {
  it("shows the Recipe and the Fewer-Scoops suggestion for NAN, 150 mL at 24 kcal/30 mL", async () => {
    render(Calculator);
    await fillIn({ kcalPerScoop: "22.3", displacement: "3.33", targetVolume: "150", targetConcentration: "24" });

    expect(recipeCard()).toHaveTextContent("6 level Scoops + 150 mL water");
    expect(suggestionCard()).toHaveTextContent(
      "Try one fewer Scoop: 5 Scoops + 125 mL water makes 141.7 mL at 23.61 kcal/30 mL, closer to your 150 mL.",
    );
  });

  it("shows the concentration warning in the Recipe card for Karicare, 120 mL at 24 kcal/30 mL", async () => {
    render(Calculator);
    await fillIn({ kcalPerScoop: "37.4", displacement: "5", targetVolume: "120", targetConcentration: "24" });

    expect(recipeCard()).toHaveTextContent("3 level Scoops + 130 mL water");
    expect(recipeCard()).toHaveTextContent("0.79 kcal/30 mL below target: check the prescription allows this.");
  });

  it("warns under an out-of-range Target concentration and still shows a Recipe", async () => {
    render(Calculator);
    await fillIn({ kcalPerScoop: "22.3", displacement: "3.33", targetVolume: "150", targetConcentration: "40" });

    const input = screen.getByLabelText(/^Target concentration/);
    expect(input).toHaveAccessibleDescription(
      expect.stringContaining("Unusual value: typical range is 20–36 kcal/30 mL. Double-check."),
    );
    expect(input.closest(".field")).toHaveClass("unusual");
    expect(recipeCard()).toHaveTextContent(/\d+ level Scoops \+ \d+ mL water/);
  });

  it("asks for all four values while an input is blank", async () => {
    render(Calculator);
    expect(recipeCard()).toHaveTextContent("Fill in all four values to see a Recipe.");
    expect(screen.queryByText("Enter a number greater than 0.")).not.toBeInTheDocument();

    const user = await fillIn({ kcalPerScoop: "22.3", displacement: "3.33", targetVolume: "150", targetConcentration: "24" });
    await user.clear(screen.getByLabelText(/^Target volume/));

    expect(recipeCard()).toHaveTextContent("Fill in all four values to see a Recipe.");
    expect(recipeCard()).not.toHaveTextContent("level Scoop");
    expect(suggestionCard()).not.toBeInTheDocument();
    expect(screen.getByLabelText(/^Target volume/)).toHaveAccessibleDescription(
      expect.stringContaining("Enter a number greater than 0."),
    );
  });

  it("fills Kcal per scoop and Displacement from the NAN label with the label helper", async () => {
    render(Calculator);
    const user = userEvent.setup();

    await user.click(screen.getByText("Don't know these? Work them out from the label"));
    await user.click(screen.getByRole("radio", { name: "grams" }));
    await user.type(screen.getByLabelText(/^Energy per 100 mL/), "67");
    await user.type(screen.getByLabelText(/^Powder/), "129");
    await user.type(screen.getByLabelText(/^Grams per scoop/), "4.3");
    await user.type(screen.getByLabelText(/^Water/), "900");
    await user.type(screen.getByLabelText(/^Prepared volume/), "1000");
    await user.click(screen.getByRole("button", { name: "Use these values" }));

    expect(screen.getByLabelText(/^Kcal per scoop/)).toHaveValue(22.3);
    expect(screen.getByLabelText(/^Displacement/)).toHaveValue(3.33);
  });

  describe("never saves or sends inputs", () => {
    it("leaves storage, cookies and the URL alone and makes no requests while in use", async () => {
      const setItem = vi.spyOn(Storage.prototype, "setItem");
      const fetchSpy = vi.fn();
      vi.stubGlobal("fetch", fetchSpy);
      const pushState = vi.spyOn(history, "pushState");
      const replaceState = vi.spyOn(history, "replaceState");
      const urlBefore = location.href;

      render(Calculator);
      await fillIn({ kcalPerScoop: "22.3", displacement: "3.33", targetVolume: "150", targetConcentration: "24" });

      expect(setItem).not.toHaveBeenCalled();
      expect(fetchSpy).not.toHaveBeenCalled();
      expect(pushState).not.toHaveBeenCalled();
      expect(replaceState).not.toHaveBeenCalled();
      expect(location.href).toBe(urlBefore);
      expect(document.cookie).toBe("");
      vi.unstubAllGlobals();
      vi.restoreAllMocks();
    });

    it("has no storage, cookie, URL or network code in the calculator's source", () => {
      const dir = join(process.cwd(), "src/components/calculator");
      const sources = readdirSync(dir)
        .filter((file) => file.endsWith(".svelte"))
        .map((file) => readFileSync(join(dir, file), "utf8"));
      expect(sources.length).toBeGreaterThan(0);
      for (const source of sources) {
        expect(source).not.toMatch(
          /localStorage|sessionStorage|indexedDB|document\.cookie|location|history\.|URLSearchParams|fetch\(|XMLHttpRequest|sendBeacon|WebSocket/,
        );
      }
    });
  });
});
