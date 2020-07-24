<script lang="ts">
  export let lines = []

  let html = ''

  const decodeHTML = (text) => {
    const e = document.createElement('div')
    e.innerHTML = text
    return e.childNodes.length ? e.childNodes[0].nodeValue : ''
  }

  $: lines = html
    .split(/<\/?(div|br)\/?>/)
    .filter((v, i) => !(i % 2) && v)
    .map((v) => decodeHTML(v.replace(/\<\/?\w+\/?\>/g, '')))
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
  }

  .input:focus {
    outline: none;
  }

  .input > :global(div) {
    margin-top: var(--line-dist);
  }
</style>

<div contenteditable="true" bind:innerHTML={html} class={'input'} />
