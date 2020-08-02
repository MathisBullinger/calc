import Token, { TokenType, Operator, Grouping, Comparison } from './token'

export default class Scanner {
  private tokens: Token[] = []
  public errors: Error[] = []

  private start = 0
  private current = 0

  constructor(readonly source: string) {}

  public scan(): { tokens: Token[]; errors: Error[] } {
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

    return { tokens: this.tokens, errors: this.errors }
  }

  private scanToken() {
    const c = this.advance()

    if (/\s/.test(c) || c === '\u0003') return
    const isOp = this.readsWords('and', 'or')
    if (isOp) {
      this.advance(isOp.length)
      return this.addToken(isOp as Operator)
    }
    if (Token.operators.includes(c as any)) return this.addToken(c as Operator)
    if (Token.grouping.includes(c as any)) return this.addToken(c as Grouping)
    if (Token.comparison.includes((c + this.peek()) as any)) {
      const comp = c + this.peek()
      this.advance()
      return this.addToken(comp as Comparison)
    }
    if (Token.comparison.includes(c as any))
      return this.addToken(c as Comparison)
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
    if (this.reads(/true(?=[^a-z]|$)/i)) {
      this.advance(4)
      return this.addToken('BOOLEAN')
    }
    if (this.reads(/false(?=[^a-z]|$)/i)) {
      this.advance(5)
      return this.addToken('BOOLEAN')
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

  private reads(regex: RegExp) {
    return regex.test(this.source.slice(this.current - 1))
  }

  private readsWords(...words: string[]) {
    const remainder = this.source.slice(this.current - 1)
    return words.find(
      (word) =>
        remainder.startsWith(word) && /[^a-zA-Z]/.test(remainder[word.length])
    )
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
