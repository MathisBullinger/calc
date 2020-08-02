import type { Expr } from './expr'
import { Infix, Unary, Grouping } from './expr'
import Token from './token'

export default class AstProcessor {
  constructor(private root: Expr) {}

  public process(): Expr {
    return AstProcessor.groups(AstProcessor.chainedComp(this.root))
  }

  private static chainedComp(node: Expr): Expr {
    if (
      AstProcessor.isComp(node) &&
      AstProcessor.isComp((node as Infix).right)
    ) {
      return AstProcessor.chainedComp(
        new Infix(
          new Infix(
            (node as Infix).left,
            (node as Infix).operator,
            ((node as Infix).right as Infix).left
          ),
          new Token('and'),
          (node as Infix).right
        )
      )
    }
    return AstProcessor.rebuild(node, AstProcessor.chainedComp)
  }

  private static groups(node: Expr) {
    if (node instanceof Grouping) return AstProcessor.groups(node.expr)
    return AstProcessor.rebuild(node, AstProcessor.groups)
  }

  private static rebuild(node: Expr, method: (expr: Expr) => Expr): Expr {
    if (node instanceof Infix)
      return new Infix(method(node.left), node.operator, method(node.right))
    if (node instanceof Unary)
      return new Unary(node.operator, method(node.right))
    return node
  }

  private static isComp(node: Expr) {
    return (
      node instanceof Infix && Token.comparison.includes(node.token.type as any)
    )
  }
}
