<script lang="ts">
  /**
   * One labelled number input with an optional hint and a message line.
   * Lays itself out on its parent's subgrid rows when the parent is a
   * `.field-pair`, so the inputs of a side-by-side pair line up even when
   * one label wraps.
   */
  type Props = {
    id: string;
    label: string;
    hint?: string;
    value: number | null;
    /** Colours the input and message. `null` means no message. */
    tone?: "unusual" | "impossible" | null;
    message?: string;
    onblur?: () => void;
    oninput?: () => void;
  };

  let {
    id,
    label,
    hint,
    value = $bindable(),
    tone = null,
    message = "",
    onblur,
    oninput,
  }: Props = $props();

  const describedBy = $derived(
    [hint ? `${id}-hint` : null, `${id}-message`].filter(Boolean).join(" "),
  );
</script>

<div class="field" class:unusual={tone === "unusual"} class:impossible={tone === "impossible"}>
  <label for={id}>{label}</label>
  {#if hint}
    <span class="hint" id="{id}-hint">{hint}</span>
  {:else}
    <span></span>
  {/if}
  <input
    {id}
    type="number"
    inputmode="decimal"
    step="any"
    bind:value
    aria-describedby={describedBy}
    aria-invalid={tone === "impossible" ? "true" : undefined}
    {onblur}
    {oninput}
  />
  <p class="message" id="{id}-message">{tone ? message : ""}</p>
</div>

<style>
  .field {
    display: grid;
    grid-row: span 4;
    grid-template-rows: subgrid;
    align-content: start;
    min-width: 0;
  }

  /* Sits on its hint, so a short label beside a wrapped one still reads as a unit. */
  label {
    align-self: end;
    font-weight: 600;
    line-height: 1.3;
  }

  .hint {
    font-size: 0.875rem;
    line-height: 1.3;
    color: var(--color-text-muted);
  }

  input {
    width: 100%;
    min-width: 0;
    margin-block-start: var(--space-1);
    padding: var(--space-2);
    border: 1px solid var(--color-input-border);
    border-radius: 6px;
    background: var(--color-background);
    font-size: 1.0625rem;
    font-variant-numeric: tabular-nums;
  }

  .unusual input {
    border-color: var(--color-warning);
    background: var(--color-warning-background);
  }

  .impossible input {
    border-color: var(--color-error);
  }

  .message {
    min-height: 0;
    margin: var(--space-1) 0 var(--space-3);
    font-size: 0.875rem;
    line-height: 1.3;
  }

  .message:empty {
    margin-block-start: 0;
  }

  .unusual .message {
    color: var(--color-warning);
  }

  .impossible .message {
    color: var(--color-error);
    font-weight: 600;
  }
</style>
