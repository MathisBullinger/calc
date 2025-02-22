import Node from '../utils/node'
import type Token from './token'

export class Expr extends Node {
  readonly children: Expr[] = []

  constructor(readonly token: Token) {
    super()
  }

  toString() {
    return this.token.lexeme
  }
}

export class Infix extends Expr {
  readonly children = [this.left, this.right]

  constructor(
    readonly left: Expr,
    readonly operator: Token,
    readonly right: Expr
  ) {
    super(operator)
  }
}

export class Unary extends Expr {
  readonly children = [this.right]

  constructor(readonly operator: Token, readonly right: Expr) {
    super(operator)
  }
}

export class Grouping extends Expr {
  readonly children = [this.expr]

  constructor(readonly token: Token, readonly expr: Expr) {
    super(token)
  }

  toString() {
    return '()'
  }
}

export class Literal extends Expr {
  constructor(readonly literal: Token) {
    super(literal)
  }
}
