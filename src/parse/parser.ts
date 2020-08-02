import type Token from './token'
import type { TokenType } from './token'
import { Expr, Infix, Unary, Literal } from './expr'

export default class Parser {
  private current = 0

  constructor(private readonly tokens: Token[]) {}

  public parse(): Expr {
    return this.expression()
  }

  private expression(): Expr {
    return this.booleanAddition()
  }

  private booleanAddition(): Expr {
    let expr = this.booleanMultiplication()

    while (this.match('or')) {
      const operator = this.previous()
      const right = this.booleanMultiplication()
      expr = new Infix(expr, operator, right)
    }

    return expr
  }

  private booleanMultiplication(): Expr {
    let expr = this.comparison()

    while (this.match('and')) {
      const operator = this.previous()
      const right = this.comparison()
      expr = new Infix(expr, operator, right)
    }

    return expr
  }

  private comparison(): Expr {
    let expr = this.addition()

    while (this.match('=', '!=', '<', '<=', '>', '>=')) {
      const operator = this.previous()
      const right = this.comparison()
      expr = new Infix(expr, operator, right)
    }

    return expr
  }

  private addition(): Expr {
    let expr = this.multiplication()

    while (this.match('+', '-')) {
      const operator = this.previous()
      const right = this.multiplication()
      expr = new Infix(expr, operator, right)
    }

    return expr
  }

  private multiplication(): Expr {
    let expr = this.unary()

    while (this.match('*', '/')) {
      const operator = this.previous()
      const right = this.unary()
      expr = new Infix(expr, operator, right)
    }

    return expr
  }

  private unary(): Expr {
    if (this.match('!', '-', '+')) {
      const operator = this.previous()
      const right = this.unary()
      return new Unary(operator, right)
    }
    return this.primary()
  }

  private primary(): Expr {
    if (this.match('NUMBER')) return new Literal(this.previous())
    if (this.match('BOOLEAN')) return new Literal(this.previous())

    if (this.match('(')) {
      const token = this.previous()
      let expr = this.expression()
      if (this.check(')')) this.advance()
      else throw new Parser.error('Missing closing parenthesis', token)
      return expr
    }
  }

  private match(...types: TokenType[]) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance()
        return true
      }
    }
    return false
  }

  private check(type: TokenType) {
    if (this.isAtEnd()) return false
    return this.peek().type === type
  }

  private advance(): Token {
    if (!this.isAtEnd()) this.current++
    return this.previous()
  }

  private isAtEnd(): boolean {
    return this.current >= this.tokens.length
  }

  private peek(): Token {
    return this.tokens[this.current]
  }

  private previous(): Token {
    return this.tokens[this.current - 1]
  }

  static error = class extends Error {
    constructor(msg: string, readonly token: Token) {
      super(msg)
      this.name = 'ParserError'
    }
  }
}
