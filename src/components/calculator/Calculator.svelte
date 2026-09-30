<script lang="ts">
  /**
   * The calculator island: the input card, the Recipe card and the
   * Fewer-Scoops suggestion. Every number comes from `src/lib`; this
   * component only wires inputs to it and words the result.
   *
   * Inputs live in component state only. They are never saved or sent
   * anywhere, so leaving the page loses them (see the privacy policy).
   */
  import {
    calculateRecipe,
    formatConcentration,
    formatScoops,
    scoopsNoun,
    formatVolume,
    formatWater,
    type Recipe,
    type RecipeField,
    TYPICAL_RANGES,
  } from "../../lib";
  import LabelHelper from "./LabelHelper.svelte";
  import NumberField from "./NumberField.svelte";

  let values: Record<RecipeField, number | null> = $state({
    kcalPerScoop: null,
    displacement: null,
    targetVolume: null,
    targetConcentration: null,
  });

  const result = $derived(calculateRecipe(values));

  type FieldCopy = { id: string; label: string; hint: string; unit: string };

  const FIELDS: Record<RecipeField, FieldCopy> = {
    kcalPerScoop: {
      id: "kcal-per-scoop",
      label: "Kcal per scoop",
      hint: "Energy in one level Scoop",
      unit: "kcal",
    },
    displacement: {
      id: "displacement",
      label: "Displacement (mL per Scoop)",
      hint: "Volume one Scoop adds",
      unit: "mL per Scoop",
    },
    targetVolume: {
      id: "target-volume",
      label: "Target volume (mL)",
      hint: "How much to make",
      unit: "mL",
    },
    targetConcentration: {
      id: "target-concentration",
      label: "Target concentration (kcal/30 mL)",
      hint: "As prescribed",
      unit: "kcal/30 mL",
    },
  };

  // Blank fields stay quiet until they've been edited or left.
  let touched: Record<RecipeField, boolean> = $state({
    kcalPerScoop: false,
    displacement: false,
    targetVolume: false,
    targetConcentration: false,
  });

  function toneOf(field: RecipeField) {
    const status = result.validation[field];
    if (status === "ok") return null;
    if (status === "impossible" && !touched[field] && values[field] === null) return null;
    return status;
  }

  function messageFor(field: RecipeField) {
    if (result.validation[field] === "impossible") return "Enter a number greater than 0.";
    const { min, max } = TYPICAL_RANGES[field];
    return `Unusual value: typical range is ${min}–${max} ${FIELDS[field].unit}. Double-check.`;
  }

  const targetVolumeText = $derived(`${values.targetVolume} mL`);
  const targetConcentrationText = $derived(`${values.targetConcentration} kcal/30 mL`);

  const scoopsText = (scoops: number) =>
    `${formatScoops(scoops)} ${scoopsNoun(scoops)}`;
</script>

{#snippet field(name: RecipeField)}
  <NumberField
    id={FIELDS[name].id}
    label={FIELDS[name].label}
    hint={FIELDS[name].hint}
    bind:value={values[name]}
    tone={toneOf(name)}
    message={messageFor(name)}
    onblur={() => (touched[name] = true)}
    oninput={() => (touched[name] = true)}
  />
{/snippet}

{#snippet concentrationWarning(recipe: Recipe)}
  {#if recipe.concentrationWarning}
    <p class="warning">
      {formatConcentration(recipe.concentrationShortfall)} kcal/30 mL below target: check the prescription allows
      this.
    </p>
  {/if}
{/snippet}

<div class="calculator">
<section class="card inputs" aria-labelledby="formula-heading">
  <h2 id="formula-heading">Formula</h2>
  <div class="field-pair">
    {@render field("kcalPerScoop")}
    {@render field("displacement")}
  </div>

  <details class="helper">
    <summary>Don't know these? Work them out from the label</summary>
    <LabelHelper
      onuse={(derived) => {
        values.kcalPerScoop = derived.kcalPerScoop;
        values.displacement = derived.displacement;
      }}
    />
  </details>

  <h2>Bottle</h2>
  <div class="field-pair">
    {@render field("targetVolume")}
    {@render field("targetConcentration")}
  </div>
</section>

<section class="card recipe" aria-labelledby="recipe-heading" aria-live="polite">
  <h2 id="recipe-heading" class="eyebrow">Recipe</h2>
  {#if result.kind === "recipe"}
    {@const { recipe } = result}
    <p class="headline">
      <strong>{formatScoops(recipe.scoops)}</strong> level {scoopsNoun(recipe.scoops)} +
      <strong>{formatWater(recipe.water)} mL</strong> water
    </p>
    <dl class="actuals">
      <div>
        <dt>Actual volume</dt>
        <dd>
          {formatVolume(recipe.actualVolume)} mL
          <span class="target">target {targetVolumeText}</span>
        </dd>
      </div>
      <div>
        <dt>Actual concentration</dt>
        <dd>
          {formatConcentration(recipe.actualConcentration)} kcal/30 mL
          <span class="target">target {targetConcentrationText}</span>
        </dd>
      </div>
    </dl>
    {@render concentrationWarning(recipe)}
    <p class="reminder">Check against the prescription and the tin before making up.</p>
  {:else}
    <p class="empty">Fill in all four values to see a Recipe.</p>
  {/if}
</section>

{#if result.kind === "recipe" && result.suggestion}
  {@const suggestion = result.suggestion}
  <section class="card suggestion" aria-label="Fewer-Scoops suggestion">
    <p>
      <strong>Try one fewer Scoop:</strong>
      {scoopsText(suggestion.scoops)} + {formatWater(suggestion.water)} mL water makes
      {formatVolume(suggestion.actualVolume)} mL at {formatConcentration(suggestion.actualConcentration)} kcal/30 mL,
      closer to your {targetVolumeText}.
    </p>
    {@render concentrationWarning(suggestion)}
  </section>
{/if}
</div>

<style>
  .card {
    padding: var(--space-3) var(--space-4);
    border: 1px solid var(--color-border);
    border-radius: 10px;
  }

  .card + .card {
    margin-block-start: var(--space-4);
  }

  .card > :last-child {
    margin-block-end: 0;
  }

  h2 {
    margin-block-end: var(--space-2);
    font-size: 1.125rem;
  }

  /* Two fields side by side on every width. Each field spans four subgrid
     rows (label, hint, input, message) so the inputs line up. */
  .calculator :global(.field-pair) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: repeat(4, auto);
    grid-auto-flow: column;
    column-gap: var(--space-3);
  }

  .helper {
    margin-block-end: var(--space-4);
    padding: 0 var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: 8px;
  }

  .helper summary {
    padding-block: var(--space-2);
    color: var(--color-accent);
    font-weight: 600;
    cursor: pointer;
  }

  .recipe {
    border: 2px solid var(--color-accent);
  }

  .eyebrow {
    margin-block-end: var(--space-1);
    font-size: 0.75rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--color-accent);
  }

  .headline {
    font-size: 1.5rem;
    line-height: 1.3;
  }

  .actuals {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-3);
    margin-block-end: var(--space-3);
  }

  .actuals dt {
    font-size: 0.875rem;
    color: var(--color-text-muted);
  }

  .actuals dd {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }

  .target {
    display: block;
    font-size: 0.875rem;
    font-weight: 400;
    color: var(--color-text-muted);
  }

  .warning {
    margin-block: 0 var(--space-3);
    padding: var(--space-2) var(--space-3);
    border-inline-start: 4px solid var(--color-warning);
    border-radius: 0 6px 6px 0;
    background: var(--color-warning-background);
    color: var(--color-warning);
    font-size: 0.9375rem;
    font-weight: 600;
  }

  .reminder {
    font-size: 0.9375rem;
  }

  .empty {
    color: var(--color-text-muted);
    font-style: italic;
  }

  .suggestion {
    background: var(--color-background-subtle);
    font-size: 0.9375rem;
  }

  .suggestion p:not(:last-child) {
    margin-block-end: var(--space-2);
  }

  @media (max-width: 30rem) {
    .card {
      padding: var(--space-3);
    }
  }
</style>