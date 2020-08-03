<script lang="ts">
  import { onMount } from 'svelte'
  import { lines } from './stores'
  import type App from './App.svelte'
  import Line from './line'

  export let value = ''
  export let errors = []
  export let off = 0
  export const focus = () => {
    textarea.focus()
  }

  let formatted = '<mark>test</mark>'

  type Part = { content: string; type: 'normal' | 'error'; ctx?: string }

  let parts: Part[] = []

  function onClick(e: MouseEvent) {
    const hit = [
      ...(e.target as HTMLDivElement).parentNode.querySelector('.highlight')
        .children,
    ].find((v) => {
      const { left, right, top, bottom } = v.getBoundingClientRect()
      return (
        left <= e.clientX &&
        right >= e.clientX &&
        top <= e.clientY &&
        bottom >= e.clientY
      )
    })
    if (hit) setTimeout(() => (hit as any).focus())
    else if (
      document.activeElement?.parentElement?.className?.includes('highlight')
    )
      (document.activeElement as any).blur()
  }

  $: {
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
        const i = parts.indexOf(start.part)
        if (end.offset === start.part.content.length - 1) {
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
          parts = [
            ...parts.slice(0, i),
            {
              type: 'error',
              content: start.part.content.slice(0, start.offset + 1),
            },
            {
              type: start.part.type,
              content: start.part.content.slice(start.offset + 1),
            },
            ...parts.slice(i + 1),
          ]
        } else {
          const endOff = end.offset - start.part.content.length + 1
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

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      lines.update((lines) => [...lines, new Line()])
      setTimeout(() => $lines.slice(-1)[0].focus())
    }
  }

  function onInput({
    target,
  }: Event & { target: EventTarget & HTMLTextAreaElement }) {
    const clone: HTMLTextAreaElement = (target as HTMLTextAreaElement).parentElement.querySelector(
      '.clone'
    )
    if (!clone) return
    requestAnimationFrame(() => {
      const lines = (clone.scrollHeight / 21) | 0
    })
  }

  let textarea: HTMLElement
</script>

<style>
  .rich-input {
    position: relative;
    width: 100%;
    height: 1.5rem;
    margin-bottom: 1.5rem;
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
    display: flex;
    align-items: baseline;
    overflow-x: hidden;
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
    margin: 0;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  pre[data-ctx]:focus {
    outline: none;
  }

  pre[data-ctx]:focus::after {
    content: attr(data-ctx);
    border: 1px solid #fffa;
    position: absolute;
    top: 120%;
    transform: translateX(-20%);
    text-align: center;
    display: inline-block;
    width: 1000px;
    max-width: 15rem;
    white-space: normal;
  }
</style>

<div class="rich-input" on:click={(e) => e.stopPropagation()}>
  <textarea
    bind:value
    bind:this={textarea}
    spellcheck={false}
    autocapitalize="none"
    autocomplete="off"
    data-gramm_editor="false"
    on:mousemove={onClick}
    on:mouseleave={onClick}
    on:keydown={onKey}
    on:input={onInput} />
  <textarea class="clone" readonly bind:value />
  <div class="highlight">
    {#each parts as { content, type, ctx }}
      {#if type === 'normal'}
        <pre>{content}</pre>
      {:else}
        <pre class={`calc-${type}`} data-ctx={ctx} tabindex={0}>{content}</pre>
      {/if}
    {/each}
  </div>
</div>
