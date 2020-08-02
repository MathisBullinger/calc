<script lang="ts">
  import { onMount } from 'svelte'
  import { lines } from './stores'
  import { atPos } from './utils/dom'
  import _RichInput from './RichInput.svelte'
  const RichInput: any = _RichInput
</script>

<style>
  .input {
    display: block;
    font-family: inherit;
    margin: 0;
    height: 100%;
    width: calc(80% + var(--resize-offset));
    min-width: 30ch;
    padding-top: var(--padding);
    padding-left: var(--padding);
    cursor: text;
  }

  .input:focus {
    outline: none;
  }

  :global(.calc-op) {
    color: var(--syntax-op);
  }

  :global(.calc-op::before),
  :global(.calc-op::after) {
    content: '\2009';
  }

  :global(.calc-num) {
    color: var(--syntax-num);
  }

  :global(.calc-group) {
    color: var(--syntax-group);
  }

  :global(.calc-error) {
    text-decoration: underline solid var(--syntax-error);
  }
</style>

<div class="input" on:click={() => $lines.slice(-1)[0].focus()}>
  {#each $lines as { input, focus, errors, off }}
    <RichInput bind:focus bind:value={input} {errors} {off} />
  {/each}
</div>
