import Token, { TokenType, Operator } from './token'

export default class Scanner {
  private tokens: Token[] = []

  private start = 0
  private current = 0

  constructor(readonly source: string) {}

  public scan(): Token[] {
    while (this.current < this.source.length) {
      this.start = this.current
      this.scanToken()
    }

    return this.tokens
  }

  private scanToken() {
    const c = this.advance()

    if (/\s/.test(c) || c === '\u0003') return
    if (Token.operators.includes(c as any)) return this.addToken(c as Operator)
    if (/[0-9.]/.test(c)) {
      let base: 2 | 10 | 16 = 10
      if (c === '0' && '0' + this.peek()?.toLowerCase() in Token.basePrefix) {
        base = Token.basePrefix['0' + this.peek().toLowerCase()]
        this.advance()
        console.log({ base, peek: this.peek() })
        if (
          !{ 2: /[0-1]/, 10: /[0-9]/, 16: /[0-9a-f]/ }[base].test(
            this.peek()?.toLowerCase()
          )
        ) {
          console.log('skip')
          return this.addToken('UNKNOWN')
        } else console.log('go')
      }
      this.number(base)
      return this.addToken('NUMBER')
    }
    this.addToken('UNKNOWN')
  }

  private number(base: 2 | 10 | 16 = 10) {
    const valid: { [k in typeof base]: RegExp } = {
      2: /[0-1_,.]/,
      10: /[0-9_,.]/,
      16: /[0-9a-fA-F_,.]/,
    }
    while (valid[base].test(this.advance()));
  }

  private advance(steps = 1) {
    if (steps <= 0) return this.source[this.current - 1] ?? '\u0003'
    this.current++
    console.log('advance', steps)
    return this.advance(--steps)
  }

  private peek(steps = 1) {
    return this.source[this.current + (steps - 1)] ?? '\u0003'
  }

  private addToken(type: TokenType) {
    this.tokens.push(
      new Token(
        type,
        this.source.slice(this.start, this.current).trim(),
        this.start
      )
    )
  }
}
