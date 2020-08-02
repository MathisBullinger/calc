import type { Expr } from './expr'
import { Literal, Unary, Infix, Grouping } from './expr'
import type Token from './token'

export default class Evalutator {
  constructor(private readonly root: Expr) {}

  public eval(node = this.root) {
    if (node instanceof Literal) {
      return this.literal(node)
    }
    if (node instanceof Grouping) {
      return this.grouping(node)
    }
    if (node instanceof Unary) {
      return this.unary(node)
    }
    if (node instanceof Infix) {
      return this.infix(node)
    }

    return ''
  }

  private literal(node: Literal) {
    if (node.token.type === 'BOOLEAN')
      return node.token.lexeme.toLowerCase().trim() === 'true' ? true : false
    return parseFloat(node.token.lexeme)
  }

  private grouping(node: Grouping) {
    return this.eval(node.expr)
  }

  private unary(node: Unary) {
    if (!node.right)
      throw new Evalutator.error(
        `unary "${node.operator.type}" requires right hand side`,
        node.operator
      )
    let right = this.eval(node.right)

    const check = (rule: Parameters<typeof Evalutator['typeCheck']>[0]) =>
      Evalutator.typeCheck(rule, node, right)

    switch (node.operator.type) {
      case '+':
        check('numeric')
        return right
      case '-':
        check('numeric')
        return -right
      case 'not':
        check('boolean')
        return !right
    }
  }

  private infix(node: Infix) {
    if (!node.left)
      throw new Evalutator.error(
        `infix "${node.operator.type}" requires left hand side`,
        node.operator
      )
    if (!node.right)
      throw new Evalutator.error(
        `infix "${node.operator.type}" requires right hand side`,
        node.operator
      )

    let left = this.eval(node.left)
    let right = this.eval(node.right)

    const check = (rule: Parameters<typeof Evalutator['typeCheck']>[0]) =>
      Evalutator.typeCheck(rule, node, left, right)

    switch (node.operator.type) {
      case '+':
        check('numeric')
        return left + right
      case '-':
        check('numeric')
        return left - right
      case '*':
        check('numeric')
        return left * right
      case '/':
        check('numeric')
        return left / right
      case '=':
        check('uniform')
        return left === right
      case '!=':
        check('uniform')
        return left !== right
      case '<':
        check('numeric')
        return left < right
      case '<=':
        check('numeric')
        return left <= right
      case '>':
        check('numeric')
        return left > right
      case '>=':
        check('numeric')
        return left >= right
      case 'or':
        check('boolean')
        return left || right
      case 'and':
        check('boolean')
        return left && right
    }
  }

  private static typeCheck(
    rule: 'numeric' | 'boolean' | 'uniform',
    { token }: Expr,
    ...children: unknown[]
  ) {
    switch (rule) {
      case 'numeric':
        if (children.some((v) => typeof v !== 'number'))
          throw new Evalutator.error(
            `operands of '${token.lexeme}' must be numeric`,
            token
          )
        break
      case 'boolean':
        if (children.some((v) => typeof v !== 'boolean'))
          throw new Evalutator.error(
            `operands of '${token.lexeme}' must be boolean`,
            token
          )
        break
      case 'uniform':
        if (new Set(children.map((v) => typeof v)).size > 1)
          throw new Evalutator.error(
            `operands of '${token.lexeme}' must be either numeric or boolean`,
            token
          )
        break
      default:
        throw Error(`unknown type check rule '${rule}'`)
    }
  }

  static error = class extends Error {
    constructor(msg: string, readonly token: Token) {
      super(msg)
      this.name = 'EvaluationError'
    }
  }
}
