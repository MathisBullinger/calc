import Node from '../../utils/node'
import type Token from '../token'

export default class Group extends Node {
  constructor(readonly tokens: Token[]) {
    super()
  }

  toString(): string {
    return 'group'
  }
}
