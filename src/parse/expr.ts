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

export class Binary extends Expr {
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

export class Literal extends Expr {
  constructor(readonly literal: Token) {
    super(literal)
  }
}

export class Grouping extends Expr {
  readonly children = [this.expression]

  constructor(readonly token: Token, readonly expression: Expr) {
    super(token)
  }

  toString() {
    return '()'
  }
}
