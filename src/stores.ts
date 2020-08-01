import { writable } from 'svelte/store'
import _parse from './parse'
import type Node from './utils/node'
import Line from './line'

export const lines = writable([new Line()])

export const tree = writable<Node>(null)
