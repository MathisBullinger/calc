<script lang="ts">
  import { lines as lineStore, meta } from './stores'
  import { atPos } from './utils/dom'

  const decodeHTML = (text) => {
    const e = document.createElement('div')
    e.innerHTML = text
    return e.childNodes.length ? e.childNodes[0].nodeValue : ''
  }

  const removeTags = (text) => text.replace(/\<[^>]+>/g, '')

  function handleInput({ target }) {
    const content = target.innerHTML

    const lines = content
      .split(/<\/?(div|br)\/?>/)
      .filter((v, i) => !(i % 2) && v)
      .map((v) => decodeHTML(removeTags(v)))

    lineStore.update(() => lines)
  }

  $: {
    const input = document.querySelector('.input')

    if (input) {
      // @ts-ignore
      for (const node of input.querySelectorAll('[class^=calc]')) {
        const parent = node.parentNode
        for (const child of node.childNodes) {
          if (child.textContent.length) parent.insertBefore(child, node)
        }
        parent.removeChild(node)
      }

      let off = 0
      for (let i = 0; i < Math.min($meta.length, $lineStore.length); i++) {
        for (const token of $meta[i]) {
          const start = atPos(token.index + off, input)
          if (!start.node) continue
          const end = atPos(token.index + off + token.value.length, input)
          if (!end.node) continue
          const range = document.createRange()
          range.setStart(start.node, start.offset)
          range.setEnd(end.node, end.offset)
          const node = document.createElement('span')
          node.setAttribute('class', 'calc-op')
          range.surroundContents(node)
        }
        off += $lineStore[i].length
      }
    }
  }
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

  :global(.calc-op) {
    background-color: red;
  }
</style>

<div contenteditable="true" class={'input'} on:input={handleInput} />
