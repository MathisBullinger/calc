import EvalNode from './evalNode'
import type Token from '../token'

export default class Number extends EvalNode<number> {
  constructor(readonly token: Token) {
    super()
  }

  toString(): string {
    return this.token.lexeme
  }

  eval() {
    return parseInt(this.token.lexeme)
  }
}
