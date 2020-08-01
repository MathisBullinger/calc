import EvalNode from './evalNode'
import type Token from '../token'

export default class Number extends EvalNode<number> {
  private readonly radix: number = 10
  private readonly value: string

  constructor(readonly token: Token) {
    super()
    const prefix = token.lexeme.slice(0, 2).toLowerCase()
    if (/0[a-z]/.test(prefix)) {
      if (prefix[1] === 'x') this.radix = 16
      else if (prefix[1] === 'b') this.radix = 2
      this.value = this.token.lexeme.slice(2)
    } else this.value = this.token.lexeme
  }

  toString(): string {
    return this.token.lexeme
  }

  eval() {
    return parseInt(this.value, this.radix)
  }
}
