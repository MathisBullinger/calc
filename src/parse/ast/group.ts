import Node from '../../utils/node'
import type { WithRule } from '../token'

export default class Group extends Node {
  constructor(readonly tokens: WithRule[]) {
    super()
  }

  toString(): string {
    return this.tokens.map(({ token }) => token.lexeme).join(' ')
  }
}
