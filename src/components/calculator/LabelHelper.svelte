<script lang="ts">
  /**
   * Works out kcal per scoop and displacement from a label's energy per
   * 100 mL and Reconstitution statement, using `deriveFromLabel`.
   */
  import { deriveFromLabel, type LabelPowder } from "../../lib";
  import NumberField from "./NumberField.svelte";

  type Props = {
    /** Called with the rounded values shown in the readout. */
    onuse: (values: { kcalPerScoop: number; displacement: number }) => void;
  };

  let { onuse }: Props = $props();

  let kcalPer100Ml: number | null = $state(null);
  let route: LabelPowder["route"] = $state("scoops");
  let scoops: number | null = $state(null);
  let grams: number | null = $state(null);
  let gramsPerScoop: number | null = $state(null);
  let water: number | null = $state(null);
  let preparedVolume: number | null = $state(null);

  const derived = $derived(
    deriveFromLabel({
      kcalPer100Ml,
      water,
      preparedVolume,
      powder: route === "scoops" ? { route, scoops } : { route, grams, gramsPerScoop },
    }),
  );

  function use() {
    if (!derived) return;
    onuse({
      kcalPerScoop: Number(derived.display.kcalPerScoop),
      displacement: Number(derived.display.displacement),
    });
  }
</script>

<div class="label-helper">
  <NumberField
    id="label-energy"
    label="Energy per 100 mL (kcal)"
    hint="Only kJ on the label? Divide by 4.184."
    bind:value={kcalPer100Ml}
  />

  <fieldset class="switch">
    <legend>The label gives powder as:</legend>
    <div class="options">
      <label><input type="radio" name="label-powder-route" value="scoops" bind:group={route} /><span>Scoops</span></label>
      <label><input type="radio" name="label-powder-route" value="grams" bind:group={route} /><span>grams</span></label>
    </div>
  </fieldset>

  <div class="field-pair">
    {#if route === "scoops"}
      <NumberField id="label-scoops" label="Scoops" bind:value={scoops} />
    {:else}
      <NumberField id="label-grams" label="Powder (g)" bind:value={grams} />
      <NumberField id="label-grams-per-scoop" label="Grams per scoop (g)" bind:value={gramsPerScoop} />
    {/if}
  </div>

  <div class="field-pair">
    <NumberField id="label-water" label="Water (mL)" bind:value={water} />
    <NumberField id="label-prepared-volume" label="Prepared volume (mL)" bind:value={preparedVolume} />
  </div>

  <p class="readout" aria-live="polite">
    {#if derived}
      kcal per scoop <strong>{derived.display.kcalPerScoop}</strong> · displacement
      <strong>{derived.display.displacement} mL per scoop</strong>
    {:else if water != null && preparedVolume != null && water > 0 && preparedVolume > 0 && preparedVolume <= water}
      The prepared volume must be more than the water.
    {:else}
      Fill in the label values to work these out.
    {/if}
  </p>

  <button type="button" onclick={use} disabled={!derived}>Use these values</button>
</div>

<style>
  .label-helper {
    padding-block-end: var(--space-3);
  }

  .switch {
    margin: 0 0 var(--space-3);
    padding: 0;
    border: 0;
  }

  legend {
    padding: 0;
    font-weight: 600;
  }

  .options {
    display: inline-flex;
    margin-block-start: var(--space-1);
    border: 1px solid var(--color-accent);
    border-radius: 6px;
    overflow: hidden;
  }

  .options label {
    position: relative;
    cursor: pointer;
  }

  .options input {
    position: absolute;
    opacity: 0;
    inset: 0;
    margin: 0;
    cursor: pointer;
  }

  .options span {
    display: block;
    padding: var(--space-1) var(--space-3);
    color: var(--color-accent);
  }

  .options input:checked + span {
    background: var(--color-accent);
    color: var(--color-background);
  }

  .options input:focus-visible + span {
    outline: 2px solid currentColor;
    outline-offset: -4px;
  }

  .readout {
    margin-block-end: var(--space-3);
    padding: var(--space-2) var(--space-3);
    border-radius: 6px;
    background: var(--color-background-subtle);
    font-size: 0.9375rem;
    font-variant-numeric: tabular-nums;
  }

  button {
    padding: var(--space-2) var(--space-3);
    border: 1px solid var(--color-accent);
    border-radius: 6px;
    background: var(--color-accent);
    color: var(--color-background);
    cursor: pointer;
  }

  button:disabled {
    border-color: var(--color-border);
    background: var(--color-background-subtle);
    color: var(--color-text-muted);
    cursor: not-allowed;
  }
</style>
