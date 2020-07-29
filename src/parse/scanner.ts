import Token, { TokenType, Operator } from './token'

export default class Scanner {
  private tokens: Token[] = []
  public errors: Error[] = []

  private start = 0
  private current = 0

  constructor(readonly source: string) {}

  public scan(): Token[] {
    while (this.current < this.source.length) {
      this.start = this.current
      this.scanToken()
    }

    for (let i = 1; i < this.tokens.length; i++) {
      if (
        this.tokens[i - 1].type === 'UNKNOWN' &&
        this.tokens[i].type === 'UNKNOWN'
      ) {
        this.tokens[i - 1] = new Token(
          'UNKNOWN',
          this.tokens[i - 1].lexeme + this.tokens[i].lexeme,
          this.tokens[i - 1].index
        )
        this.tokens.splice(i, 1)
        i--
      }
    }

    this.errors.push(
      ...this.tokens
        .filter(({ type }) => type === 'UNKNOWN')
        .map(({ index, lexeme }) => ({
          start: index,
          end: index + lexeme.length - 1,
          reason: `unknown token ${lexeme}`,
        }))
    )

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
        if (
          !{ 2: /[0-1]/, 10: /[0-9]/, 16: /[0-9a-f]/ }[base].test(
            this.peek()?.toLowerCase()
          )
        )
          return this.addToken('UNKNOWN')
      }
      return this.number(base)
    }
    this.addToken('UNKNOWN')
  }

  private number(base: 2 | 10 | 16 = 10) {
    const valid: { [k in typeof base]: RegExp } = {
      2: /[0-1_,.]/,
      10: /[0-9_,.]/,
      16: /[0-9a-fA-F_,.]/,
    }
    while (valid[base].test(this.peek())) {
      this.advance()
    }
    return this.addToken('NUMBER')
  }

  private advance(steps = 1) {
    if (steps <= 0) return this.source[this.current - 1] ?? '\u0003'
    this.current++
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

export type Error = {
  start: number
  end: number
  reason?: string
}
