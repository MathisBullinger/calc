import type Token from './token'
import Group from './ast/group'

export default class Parser {
  constructor(private readonly tokens: Token[]) {}

  public parse() {
    // return new Group(this.tokens)
    const root = new Group([])
    root.children.push(new Group([]))
    root.children.push(new Group([]))
    root.children.push(new Group([]))
    return root
  }
}
