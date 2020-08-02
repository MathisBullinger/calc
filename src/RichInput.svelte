<script lang="ts">
  import { onMount } from 'svelte'

  export let value = ''
  export let errors = []
  export let off = 0
  export const focus = () => {
    textarea.focus()
  }

  let formatted = '<mark>test</mark>'

  type Part = { content: string; type: 'normal' | 'error'; ctx?: string }

  let parts: Part[] = []

  // function translate(i: number) {
  //   return i
  // }

  $: {
    // formatted = value
    // // console.log(errors)
    // let tags = formatted.matchAll(/\<[^>]*\>/g)
    // console.log({ formatted, tags })
    // for (let { start, end, msg } of errors) {
    //   console.log({ start, end, msg })
    // }
    parts = [{ type: 'normal', content: value }]

    const getPos = (index: number): { offset: number; part: Part } => {
      for (let part of parts) {
        if (part.content.length > index) return { part, offset: index }
        index -= part.content.length
      }
      throw Error('index out of bound')
    }

    for (let error of errors) {
      const start = getPos(error.start + off)
      const end = getPos(error.end + off)
      if (start.part === end.part) {
        console.log(start)
        if (end.offset === start.part.content.length - 1) {
          const i = parts.indexOf(start.part)
          const endOff = start.offset - start.part.content.length
          parts = [
            ...parts.slice(0, i),
            {
              type: start.part.type,
              content: start.part.content.slice(0, endOff),
            },
            {
              type: 'error',
              content: start.part.content.slice(endOff),
              ctx: error.msg,
            },
            ...parts.slice(i + 1),
          ]
        } else if (end.offset === 0) {
          console.warn('at start')
        } else {
          const i = parts.indexOf(start.part)
          const endOff = end.offset - start.part.content.length + 1
          console.log(
            'in middle',
            JSON.stringify(start.part.content.slice(0, start.offset)),
            JSON.stringify(
              start.part.content.slice(start.offset, end.offset + 1)
            ),
            JSON.stringify(start.part.content.slice(endOff))
          )
          parts = [
            ...parts.slice(0, i),
            {
              type: start.part.type,
              content: start.part.content.slice(0, start.offset),
            },
            {
              type: 'error',
              content: start.part.content.slice(start.offset, end.offset + 1),
              ctx: error.msg,
            },
            {
              type: start.part.type,
              content: start.part.content.slice(endOff),
            },
            ...parts.slice(i + 1),
          ]
        }
      } else console.warn('error lies in different parts')
    }
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
    display: flex;
    align-items: baseline;
  }

  .clone {
    height: 0;
    visibility: hidden;
    position: absolute;
  }

  .calc-error {
    text-decoration: underline var(--syntax-error);
    text-underline-position: under;
  }

  pre {
    display: inline;
    font-family: inherit;
    font-size: inherit;
    line-height: 0;
    margin: 0;
  }

  /* pre[data-ctx]:focus {
    outline: none;
  }

  pre[data-ctx]:focus::after {
    content: '';
    display: block;
    width: 10rem;
    height: 10rem;
    background: red;
  } */
</style>

<div class="rich-input">
  <textarea
    bind:value
    bind:this={textarea}
    spellcheck={false}
    autocapitalize="none"
    autocomplete="off"
    data-gramm_editor="false" />
  <textarea class="clone" readonly bind:value />
  <div class="highlight">
    {#each parts as { content, type, ctx }}
      <pre
        {...type !== 'normal' && { class: `calc-${type}` }}
        {...ctx && { 'data-ctx': ctx, tabindex: 0 }}>
        {content}
      </pre>
    {/each}
  </div>
</div>
