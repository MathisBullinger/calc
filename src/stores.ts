import { writable, derived } from 'svelte/store'
import _parse from './parse'
import memoize from './utils/memoize'
import type Token from './parse/token'
import type { Error } from './parse/scanner'
import type Node from './utils/node'

export const lines = writable([])
export const meta = writable([] as [Token[], Error[], number][])

const parse = memoize(_parse)

export const convert = (line: string, index: number): string => {
  const { result, tokens, errors, offset } = parse(line)
  meta.update((v) => [
    ...v.slice(0, index),
    [tokens, errors, offset],
    ...v.slice(index + 1),
  ])
  return result
}

export const output = derived(lines, ($lines) =>
  $lines.map((line, i) => convert(line, i))
)

export const tree = writable<Node>(null)
