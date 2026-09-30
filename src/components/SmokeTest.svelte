<script lang="ts">
  // Proves Svelte islands hydrate. Remove once the calculator island exists.
  let count = $state(0);
</script>

<button type="button" onclick={() => count++}>
  Svelte island clicked {count} {count === 1 ? "time" : "times"}
</button>
