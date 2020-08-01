import type Token from './token'
import type { WithRule } from './token'
import Group from './ast/group'
import BinaryOp from './ast/binaryOp'
import Number from './ast/number'
import * as rule from './grammar'
import type EvalNode from './ast/evalNode'

export default class Parser {
  constructor(private readonly tokens: Token[]) {}

  public parse() {
    const tokens: WithRule[] = this.tokens.map((token) => ({
      token,
      rule: token.category === 'NUMBER' ? new rule.Primitive() : undefined,
    }))
    for (let i = 1; i < tokens.length - 1; i++) {
      if (
        tokens[i].token.category === 'OPERATOR' &&
        tokens[i - 1].token.category === 'NUMBER' &&
        tokens[i + 1].token.category === 'NUMBER'
      )
        tokens[i].rule =
          tokens[i].token.type === '+'
            ? new rule.Addition()
            : tokens[i].token.type === '-'
            ? new rule.Substraction()
            : tokens[i].token.type === '*'
            ? new rule.MultiplicationExplicit()
            : new rule.Division()
    }
    const ast = this.parseGroup(new Group(tokens))

    let result: number
    try {
      result = ast.eval()
    } catch (e) {}

    return { ast, result }
  }

  private parseGroup(group: Group): InstanceType<new () => EvalNode<number>> {
    const tokens = group.tokens

    if (tokens.length === 1 && tokens[0].token.category === 'NUMBER')
      return new Number(tokens[0].token)

    const lowestOp = tokens
      .filter((token) => token.token.category === 'OPERATOR')
      .sort((a, b) => a.rule?.precedence - b.rule?.precedence)[0]

    if (lowestOp) {
      const op = new BinaryOp(lowestOp.token)
      op.children.push(
        this.parseGroup(new Group(tokens.slice(0, tokens.indexOf(lowestOp))))
      )
      op.children.push(
        this.parseGroup(new Group(tokens.slice(tokens.indexOf(lowestOp) + 1)))
      )
      console.log(group, op)
      return op
    }
  }
}
