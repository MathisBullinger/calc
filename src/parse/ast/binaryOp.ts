import EvalNode from './evalNode'
import type Token from '../token'

export default class BinaryOp extends EvalNode<number> {
  children: EvalNode<number>[]

  constructor(readonly op: Token) {
    super()
  }

  eval() {
    return this.children.map((child) => child.eval()).reduce((a, c) => a + c)
  }

  toString(): string {
    return this.op.lexeme
  }
}
