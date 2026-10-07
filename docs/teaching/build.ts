/**
 * Builds the teaching sheets: a cheat sheet, a worksheet and its answer key,
 * as HTML and as A4 PDFs printed by headless Chrome.
 *
 *   pnpm teaching:pdf
 *
 * Every number comes from the site's recipe maths, so the answers agree with
 * the calculator. Set CHROME_PATH if Chrome isn't in the default macOS place.
 */
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { recipeWalkthrough, type Target } from "../../src/content/building-a-recipe";
import { readingLabelsWorking, type ReadingLabelsWorking } from "../../src/content/reading-labels";
import { describeLabel, nanOptipro1, type WorkedExample } from "../../src/content/worked-examples";
import {
  calculateRecipe,
  CONCENTRATION_WARNING_THRESHOLD,
  deriveFromLabel,
  formatConcentration,
  formatExactScoops,
  formatGrams,
  formatKcal,
  formatKcalNeeded,
  formatKcalPerMl,
  formatScoops,
  formatVolume,
  formatWater,
  scoopsNoun,
  TYPICAL_RANGES,
} from "../../src/lib";
import { roundHalfUp, roundUp } from "../../src/lib/rounding";
import { siteUrl } from "../../src/site.config";
import { exercises, type Exercise, type GivenFormula, type Label } from "./exercises";

const OUT_DIR = dirname(fileURLToPath(import.meta.url));
const CHROME_PATH = process.env.CHROME_PATH ?? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const SITE_HOST = new URL(siteUrl).host;
const displacementRange = `${TYPICAL_RANGES.displacement.min.toFixed(2)}–${TYPICAL_RANGES.displacement.max.toFixed(2)}`;

// ---------- Working ----------

type Step = { name: string; working: string; value: string; unit: string };

type RecipeSteps = {
  steps: Step[];
  /** "6 scoops + 150 mL water". */
  recipe: string;
  /** "170.0 mL at 23.61 kcal/30 mL". */
  makes: string;
  warning: boolean;
};

type Formula = { kcalPerScoop: number; gramsPerScoop: number; displacement: number };

/** The nine recipe steps, worded as /building-a-recipe words them. */
function recipeSteps(
  kcalPerScoop: string,
  gramsPerScoop: string,
  displacement: string,
  target: Target,
  unrounded?: Formula,
): RecipeSteps {
  const formula = {
    kcalPerScoop: Number(kcalPerScoop),
    gramsPerScoop: Number(gramsPerScoop),
    displacement: Number(displacement),
  };
  const result = calculateRecipe({
    ...formula,
    targetVolume: target.volume,
    targetConcentration: target.concentration,
  });
  if (result.kind !== "recipe") {
    throw new Error(`No recipe for ${kcalPerScoop} kcal, ${gramsPerScoop} g, ${displacement} mL per g`);
  }
  checkRobust(result.recipe, formula, target, unrounded);

  const { recipe } = result;
  const kcalPerMl = formatKcalPerMl(result.kcalPerMl);
  const kcalNeeded = formatKcalNeeded(result.kcalNeeded);
  const scoops = formatScoops(recipe.scoops);
  const actualKcal = formatKcal(recipe.actualKcal);
  const totalPowder = formatGrams(recipe.totalPowder);
  const totalDisplacement = formatVolume(recipe.totalDisplacement);
  const water = formatWater(recipe.water);
  const actualVolume = formatVolume(recipe.actualVolume);
  const actualConcentration = formatConcentration(recipe.actualConcentration);
  return {
    steps: [
      { name: "kcal/mL", working: `${target.concentration} ÷ 30`, value: kcalPerMl, unit: "" },
      { name: "kcal needed", working: `${target.volume} × ${kcalPerMl}`, value: kcalNeeded, unit: "kcal" },
      {
        name: "Scoops",
        working: `${kcalNeeded} ÷ ${kcalPerScoop} = ${formatExactScoops(result.exactScoops)}, round up`,
        value: scoops,
        unit: scoopsNoun(recipe.scoops),
      },
      { name: "Actual kcal", working: `${scoops} × ${kcalPerScoop}`, value: actualKcal, unit: "kcal" },
      { name: "Total powder", working: `${scoops} × ${gramsPerScoop}`, value: totalPowder, unit: "g" },
      { name: "Total displacement", working: `${totalPowder} × ${displacement}`, value: totalDisplacement, unit: "mL" },
      {
        name: "Water",
        working: `${actualKcal} ÷ ${kcalPerMl} − ${totalDisplacement} = ${formatVolume(recipe.exactWater)}, round up to 5 mL`,
        value: water,
        unit: "mL",
      },
      { name: "Actual volume", working: `${water} + ${totalDisplacement}`, value: actualVolume, unit: "mL" },
      {
        name: "Actual concentration",
        working: `${actualKcal} ÷ ${actualVolume} × 30`,
        value: actualConcentration,
        unit: "kcal/30 mL",
      },
    ],
    recipe: `${scoops} ${scoopsNoun(recipe.scoops)} + ${water} mL water`,
    makes: `${actualVolume} mL at ${actualConcentration} kcal/30 mL`,
    warning: recipe.concentrationWarning,
  };
}

/**
 * Throws unless a student keeping kcal/mL to 3 dp, or using the unrounded
 * label values, lands on the same scoops and water as the answer key.
 */
function checkRobust(
  recipe: { scoops: number; water: number },
  formula: Formula,
  target: Target,
  unrounded?: Formula,
) {
  const variants = [formula, ...(unrounded ? [unrounded] : [])];
  for (const variant of variants) {
    for (const kcalPerMl of [target.concentration / 30, roundHalfUp(target.concentration / 30, 3)]) {
      const scoops = roundUp((target.volume * kcalPerMl) / variant.kcalPerScoop);
      const totalDisplacement = scoops * variant.gramsPerScoop * variant.displacement;
      const water = roundUp((scoops * variant.kcalPerScoop) / kcalPerMl - totalDisplacement, 5);
      if (scoops !== recipe.scoops || water !== recipe.water) {
        throw new Error(
          `${target.volume} mL at ${target.concentration}: rounding the working differently gives ${scoops} scoops + ${water} mL, not ${recipe.scoops} + ${recipe.water}`,
        );
      }
    }
  }
}

// readingLabelsWorking only reads the label values; id and labelAccessed don't apply to a made-up formula.
const asWorkedExample = (label: Label): WorkedExample => ({ ...label, id: label.name, labelAccessed: "" });

function labelSteps(working: ReadingLabelsWorking): Step[] {
  // The table shows the answer in its own column, so drop the "= value" ending.
  const strip = (working: string) => working.replace(/ = [^=]*$/, "");
  return [
    {
      name: "Scoops in the statement",
      working: working.scoops.working ? strip(working.scoops.working) : "Given on the label",
      value: working.scoops.value,
      unit: Number(working.scoops.value) === 1 ? "scoop" : "scoops",
    },
    { name: "Displacement", working: strip(working.displacement.working), value: working.displacement.value, unit: "mL per g" },
    { name: "kcal per scoop", working: strip(working.kcalPerScoop.working), value: working.kcalPerScoop.value, unit: "kcal" },
  ];
}

/** Label and recipe working for a formula read from its label. */
function fullWorking(example: WorkedExample, target: Target) {
  const label = readingLabelsWorking(example);
  const kcalPerScoop = label.kcalPerScoop.value;
  const displacement = label.displacement.value;
  const { kcalPer100Ml, gramsPerScoop, reconstitutionStatement: statement } = example;
  const unrounded = deriveFromLabel({ kcalPer100Ml, gramsPerScoop, ...statement });
  if (unrounded === null) throw new Error(`${example.name}: the label values don't give a result`);
  const recipe = recipeSteps(kcalPerScoop, String(gramsPerScoop), displacement, target, {
    kcalPerScoop: unrounded.kcalPerScoop,
    gramsPerScoop,
    displacement: unrounded.displacement,
  });
  return { label: labelSteps(label), recipe };
}

const givenRecipeSteps = (formula: GivenFormula, target: Target): RecipeSteps =>
  recipeSteps(String(formula.kcalPerScoop), String(formula.gramsPerScoop), String(formula.displacement), target);

// ---------- Exercise checks ----------

for (const exercise of exercises) {
  if (exercise.kind === "recipe") {
    const { formula, target } = exercise;
    const { warning } = givenRecipeSteps(formula, target);
    if (warning !== exercise.expectWarning) {
      throw new Error(`${exercise.formula.name}: warning is ${warning}, expected ${exercise.expectWarning}`);
    }
  }
  if (exercise.kind === "full" && fullWorking(asWorkedExample(exercise.label), exercise.target).recipe.warning) {
    throw new Error(`${exercise.label.name}: a full exercise shouldn't trip the warning`);
  }
}

// ---------- HTML ----------

const esc = (text: string): string =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function labelBox(label: Label | WorkedExample): string {
  const text = describeLabel({ ...label, id: label.name, labelAccessed: "2000-01-01" });
  return `<div class="label">
    <p class="label-name">${esc(label.name)}: the label says</p>
    <ul>
      <li><span class="term">Energy:</span> ${esc(text.energy)}</li>
      <li><span class="term">Reconstitution statement:</span> ${esc(text.reconstitutionStatement)}</li>
      <li><span class="term">Grams per scoop:</span> ${esc(text.gramsPerScoop)}</li>
    </ul>
  </div>`;
}

const targetText = (target: Target): string =>
  `<strong>${target.volume} mL</strong> at <strong>${target.concentration} kcal/30 mL</strong>`;

/** A table of steps; blank leaves the working and answers for students to fill. */
function stepTable(steps: Step[], firstNumber: string | number, blank: boolean): string {
  const numberAt = (i: number) =>
    typeof firstNumber === "number" ? String(firstNumber + i) : `${firstNumber}${i + 1}`;
  const rows = steps
    .map(
      (step, i) => `<tr>
        <td class="num">${numberAt(i)}</td>
        <td class="name">${esc(step.name)}</td>
        <td class="working">${blank ? "" : esc(step.working)}</td>
        <td class="value">${blank ? "" : `<strong>${esc(step.value)}</strong>`} <span class="unit">${esc(step.unit)}</span></td>
      </tr>`,
    )
    .join("");
  return `<table class="steps${blank ? " blank" : ""}">
    <thead><tr><th></th><th>Step</th><th>Working</th><th>Answer</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function recipeResult(recipe: RecipeSteps | null): string {
  if (recipe === null) {
    return `<div class="result blank">
      <p><span class="term">Recipe:</span> ______ scoops + ______ mL water</p>
      <p><span class="term">Makes:</span> ______ mL at ______ kcal/30 mL</p>
      <p><span class="term">${CONCENTRATION_WARNING_THRESHOLD} kcal/30 mL or more under target?</span> Yes / No</p>
    </div>`;
  }
  return `<div class="result">
    <p><span class="term">Recipe:</span> <strong>${esc(recipe.recipe)}</strong></p>
    <p><span class="term">Makes:</span> ${esc(recipe.makes)}</p>
    <p><span class="term">${CONCENTRATION_WARNING_THRESHOLD} kcal/30 mL or more under target?</span> <strong>${recipe.warning ? "Yes: double-check before using" : "No"}</strong></p>
  </div>`;
}

function exerciseHtml(exercise: Exercise, index: number, answers: boolean): string {
  const number = index + 1;
  switch (exercise.kind) {
    case "label": {
      const working = labelSteps(readingLabelsWorking(asWorkedExample(exercise.label)));
      return section(
        number,
        "Reading a label",
        `<p>Work out the displacement and kcal per scoop of ${esc(exercise.label.name)}.</p>
        ${labelBox(exercise.label)}
        ${stepTable(working, "A", !answers)}`,
      );
    }
    case "recipe": {
      const { formula, target } = exercise;
      const recipe = givenRecipeSteps(formula, target);
      return section(
        number,
        "Building a recipe",
        `<p>${esc(formula.name)} has <strong>${formula.kcalPerScoop} kcal per scoop</strong>, <strong>${formula.gramsPerScoop} g per scoop</strong> and a displacement of <strong>${formula.displacement} mL per g</strong>. Make ${targetText(target)}.</p>
        ${stepTable(recipe.steps, 1, !answers)}
        ${recipeResult(answers ? recipe : null)}`,
      );
    }
    case "full": {
      const working = fullWorking(asWorkedExample(exercise.label), exercise.target);
      return section(
        number,
        "From label to bottle",
        `<p>Make ${targetText(exercise.target)} of ${esc(exercise.label.name)}.</p>
        ${labelBox(exercise.label)}
        <h3>Part A · Reading the label</h3>
        ${stepTable(working.label, "A", !answers)}
        <h3>Part B · Building the recipe</h3>
        ${stepTable(working.recipe.steps, 1, !answers)}
        ${recipeResult(answers ? working.recipe : null)}`,
      );
    }
    case "concept":
      return section(
        number,
        "Explain",
        `<ol class="parts">${exercise.parts
          .map(
            (part) =>
              `<li><p>${esc(part.question)}</p>${answers ? `<p class="answer">${esc(part.answer)}</p>` : `<div class="lines">${"<span></span>".repeat(4)}</div>`}</li>`,
          )
          .join("")}</ol>`,
      );
  }
}

const section = (number: number, kind: string, body: string): string =>
  `<section class="exercise"><h2><span class="ex-num">${number}</span> ${esc(kind)}</h2>${body}</section>`;

function cheatSheet(): string {
  const example = nanOptipro1;
  const target = { volume: 150, concentration: 24 };
  const working = fullWorking(example, target);
  // The cheat sheet's example must read exactly as /building-a-recipe does.
  const site = recipeWalkthrough(example, target);
  if (site.recipe !== working.recipe.recipe || site.makes !== working.recipe.makes) {
    throw new Error(`Cheat sheet example (${working.recipe.recipe}) disagrees with the site (${site.recipe})`);
  }

  return `
  <header class="sheet-header">
    <p class="kicker">Cheat sheet</p>
    <h1>Making up infant formula at a Target concentration</h1>
    <p class="lede">From an Australian or New Zealand formula label to a recipe of whole scoops and water to the nearest 5&nbsp;mL.</p>
  </header>

  <section class="terms">
    <h2>Key terms</h2>
    <dl>
      <dt>Concentration</dt><dd>Energy density of prepared formula, always in <strong>kcal per 30 mL</strong>.</dd>
      <dt>Target volume / Target concentration</dt><dd>The bottle you want to make.</dd>
      <dt>Reconstitution statement</dt><dd>The label's "powder + water makes this much" line, e.g. "1 scoop + 50 mL water makes approximately 55 mL".</dd>
      <dt>kcal per scoop</dt><dd>Energy in one level scoop of powder.</dd>
      <dt>Displacement</dt><dd>The volume (mL) one gram of powder adds beyond its water, in mL per g.</dd>
      <dt>Recipe</dt><dd>A whole number of scoops plus water rounded to 5 mL.</dd>
      <dt>Actual volume / Actual concentration</dt><dd>What the recipe really makes, after rounding.</dd>
    </dl>
  </section>

  <section class="method">
    <h2>Part A · Reading the label</h2>
    <p>Find: <strong>energy per 100 mL</strong> of prepared formula, the <strong>Reconstitution statement</strong>, and <strong>grams per scoop</strong>.</p>
    <ol class="formulas">
      <li><span class="step">A1</span> Scoops in the statement = grams of powder ÷ grams per scoop <em>(skip if it counts scoops)</em></li>
      <li><span class="step">A2</span> Displacement = (prepared volume − water) ÷ grams of powder <em>(3 dp; scoops × grams per scoop if it counts scoops)</em>. Usually <strong>${displacementRange} mL per g</strong> however big the scoop; if not, re-read the label.</li>
      <li><span class="step">A3</span> kcal per scoop = energy per 100 mL × (prepared volume ÷ scoops) ÷ 100 <em>(1 dp)</em></li>
    </ol>

    <h2>Part B · Building the recipe</h2>
    <ol class="formulas">
      <li><span class="step">1</span> kcal/mL = Target concentration ÷ 30</li>
      <li><span class="step">2</span> kcal needed = Target volume × kcal/mL</li>
      <li><span class="step">3</span> Scoops = kcal needed ÷ kcal per scoop, <strong>rounded up</strong> to a whole scoop</li>
      <li><span class="step">4</span> Actual kcal = scoops × kcal per scoop</li>
      <li><span class="step">5</span> Total powder = scoops × grams per scoop</li>
      <li><span class="step">6</span> Total displacement = total powder × displacement</li>
      <li><span class="step">7</span> Water = Actual kcal ÷ kcal/mL − total displacement, <strong>rounded up to the nearest 5 mL</strong></li>
      <li><span class="step">8</span> Actual volume = water + total displacement</li>
      <li><span class="step">9</span> Actual concentration = Actual kcal ÷ Actual volume × 30</li>
    </ol>
    <p class="check"><strong>Check:</strong> if the Actual concentration is <strong>${CONCENTRATION_WARNING_THRESHOLD} kcal/30 mL or more below</strong> the Target concentration, double-check your inputs and working before using the recipe.</p>
  </section>

  <section class="rules">
    <h2>Rounding</h2>
    <ul>
      <li>Scoops: always round <strong>up</strong>, unless the answer is already exactly whole.</li>
      <li>Water: round <strong>up</strong> to a 5 mL mark, the smallest amount you can measure reliably on a bottle, unless it's already on one.</li>
      <li>Show kcal, grams and volumes to 1 dp, displacement to 3 dp, Concentration to 2 dp. Keep the unrounded numbers in your calculator between steps.</li>
      <li>So the recipe always comes out at or just <strong>below</strong> the Target concentration, and at or just <strong>above</strong> the Target volume.</li>
    </ul>
  </section>

  <section class="example page-break">
    <h2>Worked example: ${esc(example.name)}, ${targetText(target)}</h2>
    ${labelBox(example)}
    <h3>Part A · Reading the label</h3>
    ${stepTable(working.label, "A", false)}
    <h3>Part B · Building the recipe</h3>
    ${stepTable(working.recipe.steps, 1, false)}
    ${recipeResult(working.recipe)}
  </section>

  <section class="mistakes">
    <h2>Common mistakes</h2>
    <ul>
      <li>Making the water equal to the Target volume. The powder takes up room too: subtract the total displacement.</li>
      <li>Rounding scoops to the nearest whole scoop instead of up.</li>
      <li>Forgetting to round the water up to a 5 mL mark.</li>
      <li>Dividing by scoops instead of grams of powder when working out displacement.</li>
      <li>Dividing by grams per scoop when the Reconstitution statement already counts scoops.</li>
      <li>Mixing up per 100 mL (on the label) with per 30 mL (Concentration).</li>
      <li>Leaving out the check in step 9 when the bottle is small and the scoop is large.</li>
    </ul>
  </section>`;
}

function worksheet(answers: boolean): string {
  const intro = answers
    ? `<p class="lede">Full working for every exercise. Numbers may differ in the last decimal place if you rounded at a different point, but the recipe should match.</p>`
    : `<p class="name-line">Name ____________________________ &nbsp; Date ______________</p>
       <p class="lede">Use a basic calculator and the cheat sheet. Show your working. Round as the cheat sheet says: scoops up to a whole scoop, water up to the nearest 5 mL.</p>`;
  return `
  <header class="sheet-header">
    <p class="kicker">${answers ? "Answer key" : "Worksheet"}</p>
    <h1>Making up infant formula at a Target concentration</h1>
    ${intro}
  </header>
  ${exercises.map((exercise, i) => exerciseHtml(exercise, i, answers)).join("")}`;
}

const STYLES = `
@page {
  size: A4;
  margin: 14mm 14mm 18mm;
  @bottom-left { content: "For teaching only. Always check the current label and your local feeding policy."; font: 7.5pt system-ui, sans-serif; color: #57606a; }
  @bottom-right { content: "Based on ${SITE_HOST} · page " counter(page) " of " counter(pages); font: 7.5pt system-ui, sans-serif; color: #57606a; }
}
* { box-sizing: border-box; margin: 0; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
  font-size: 9.5pt; line-height: 1.45; color: #1b1f24;
  font-variant-numeric: tabular-nums;
}
h1 { font-size: 17pt; line-height: 1.2; margin-block-end: 2mm; }
h2 { font-size: 11.5pt; color: #1f5f8b; margin-block: 4mm 2mm; }
h3 { font-size: 10pt; margin-block: 3mm 1.5mm; }
p, ul, ol, dl { margin-block-end: 1.5mm; }
ul, ol { padding-inline-start: 5mm; }
strong { font-weight: 650; }
.kicker { text-transform: uppercase; letter-spacing: 0.08em; font-size: 8pt; font-weight: 650; color: #1f5f8b; }
.lede { color: #57606a; }
.sheet-header { border-block-end: 2px solid #1f5f8b; padding-block-end: 2mm; margin-block-end: 3mm; }
.term { font-weight: 650; }
.terms dl { display: grid; grid-template-columns: 48mm 1fr; gap: 1mm 3mm; }
.terms dt { font-weight: 650; }
.formulas { list-style: none; padding: 2.5mm 3mm; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 2mm; }
.formulas li { padding-block: 0.4mm; }
.formulas em { color: #57606a; }
.step { display: inline-block; min-width: 7mm; font-weight: 650; color: #1f5f8b; }
.check { padding: 2mm 3mm; background: #fff4e5; border-inline-start: 3px solid #8a4b00; }
.page-break { break-before: page; }
.label { border: 1px dashed #6e7781; border-radius: 2mm; padding: 2mm 3mm; margin-block: 2mm; }
.label ul { list-style: none; padding: 0; margin: 0; }
.label-name { font-weight: 650; margin-block-end: 1mm; }
table.steps { width: 100%; border-collapse: collapse; margin-block: 2mm; }
.steps th { text-align: start; font-size: 8pt; color: #57606a; font-weight: 600; border-block-end: 1px solid #d0d7de; padding: 1mm 2mm; }
.steps td { border-block-end: 1px solid #d0d7de; padding: 1.2mm 2mm; vertical-align: top; }
.steps .num { width: 7mm; font-weight: 650; color: #1f5f8b; }
.steps .name { width: 44mm; }
.steps .value { width: 36mm; white-space: nowrap; }
.steps.blank td { height: 9mm; }
.unit { color: #57606a; }
.result { padding: 2mm 3mm; background: #f6f8fa; border: 1px solid #d0d7de; border-radius: 2mm; margin-block: 2mm; }
.result p { margin: 0; }
.result.blank p { padding-block: 1.5mm; }
.exercise { break-inside: avoid; margin-block-end: 5mm; }
.exercise h2 { display: flex; align-items: center; gap: 2mm; }
.ex-num { display: inline-grid; place-items: center; width: 6mm; height: 6mm; border-radius: 50%; background: #1f5f8b; color: #fff; font-size: 9pt; }
.parts li { margin-block-end: 3mm; }
.lines span { display: block; height: 8mm; border-block-end: 1px solid #d0d7de; }
.answer { color: #1b1f24; padding: 1.5mm 3mm; background: #f6f8fa; border-inline-start: 3px solid #1f5f8b; }
.name-line { margin-block: 2mm; }
`;

function page(title: string, body: string): string {
  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<style>${STYLES}</style>
</head>
<body>
${body}
</body>
</html>
`;
}

// ---------- Output ----------

const sheets = [
  { file: "cheat-sheet", title: "Cheat sheet: making up infant formula", body: cheatSheet() },
  { file: "worksheet", title: "Worksheet: making up infant formula", body: worksheet(false) },
  { file: "answer-key", title: "Answer key: making up infant formula", body: worksheet(true) },
];

for (const sheet of sheets) {
  const html = join(OUT_DIR, `${sheet.file}.html`);
  const pdf = join(OUT_DIR, `${sheet.file}.pdf`);
  writeFileSync(html, page(sheet.title, sheet.body));
  execFileSync(CHROME_PATH, [
    "--headless",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${pdf}`,
    pathToFileURL(html).href,
  ], { stdio: "ignore" });
  console.log(`Wrote ${sheet.file}.html and ${sheet.file}.pdf`);
}
