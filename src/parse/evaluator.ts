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
      return this.binary(node)
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

    switch (node.operator.type) {
      case '+':
        return right
      case '-':
        return -right
      case 'not':
        return !right
    }
  }

  private binary(node: Infix) {
    if (!node.left)
      throw new Evalutator.error(
        `binary "${node.operator.type}" requires left hand side`,
        node.operator
      )
    if (!node.right)
      throw new Evalutator.error(
        `binary "${node.operator.type}" requires right hand side`,
        node.operator
      )

    let left = this.eval(node.left)
    let right = this.eval(node.right)

    switch (node.operator.type) {
      case '+':
        return left + right
      case '-':
        return left - right
      case '*':
        return left * right
      case '/':
        return left / right
      case '=':
        return left === right
      case '<':
        return left < right
      case '<=':
        return left <= right
      case '>':
        return left > right
      case '>=':
        return left >= right
      case 'or':
        return left || right
      case 'and':
        return left && right
    }
  }

  static error = class extends Error {
    constructor(msg: string, readonly token: Token) {
      super(msg)
      this.name = 'EvaluationError'
    }
  }
}
