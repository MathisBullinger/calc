<script lang="ts">
  import { onMount } from 'svelte'

  export let value = ''
  export const focus = () => {
    textarea.focus()
  }

  let textarea: HTMLElement
</script>

<style>
  .rich-input {
    position: relative;
    width: 100%;
  }

  .rich-input * {
    font: inherit;
  }

  textarea {
    background-color: inherit;
    border: none;
    resize: none;
    width: 100%;
    padding: 0;
    display: block;
    color: transparent;
    caret-color: #fffd;
  }

  textarea:focus {
    outline: none;
  }

  textarea,
  .highlight {
    position: absolute;
    left: 0;
    top: 0;
  }

  .highlight {
    pointer-events: none;
    user-select: none;
    max-width: 100%;
    overflow-wrap: break-word;
  }

  .clone {
    height: 0;
    visibility: hidden;
    position: absolute;
  }
</style>

<div class="rich-input">
  <textarea bind:value bind:this={textarea} />
  <textarea class="clone" readonly bind:value />
  <span class="highlight">{value}</span>
</div>
