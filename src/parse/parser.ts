import type Token from './token'
import Group from './ast/group'

export default class Parser {
  constructor(private readonly tokens: Token[]) {}

  public parse() {
    console.log('parse', this.tokens)
    return new Group(this.tokens)
  }
}
