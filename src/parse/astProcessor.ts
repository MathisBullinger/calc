import type { Expr } from './expr'
import { Infix, Unary } from './expr'
import Token from './token'

export default class AstProcessor {
  constructor(private root: Expr) {}

  public process(): Expr {
    return this.walk(this.root)
  }

  private walk(node: Expr) {
    if (this.isComp(node) && this.isComp((node as Infix).right)) {
      return this.walk(
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
    if (node instanceof Infix)
      return new Infix(
        this.walk(node.left),
        node.operator,
        this.walk(node.right)
      )
    if (node instanceof Unary)
      return new Unary(node.operator, this.walk(node.right))
    return node
  }

  private isComp(node: Expr) {
    return (
      node instanceof Infix && Token.comparison.includes(node.token.type as any)
    )
  }
}
