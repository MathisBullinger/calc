import EvalNode from './evalNode'
import type Token from '../token'

export default class BinaryOp extends EvalNode<number> {
  children: EvalNode<number>[]

  constructor(readonly op: Token) {
    super()
  }

  eval() {
    const op = {
      '+': (a, b) => a + b,
      '-': (a, b) => a - b,
      '*': (a, b) => a * b,
      '/': (a, b) => a / b,
    }
    return this.children
      .map((child) => child.eval())
      .reduce((a, c) => op[this.op.lexeme](a, c))
  }

  toString(): string {
    return this.op.lexeme
  }
}
