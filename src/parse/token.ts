import type { Expression } from './grammar'

export default class Token {
  public constructor(
    readonly type: TokenType,
    readonly lexeme: string,
    readonly index: number
  ) {}

  public get category() {
    return Token.operators.includes(this.type as any) ? 'OPERATOR' : this.type
  }

  public toString(): string {
    return `${this.category}<${this.lexeme}>`
  }

  static readonly operators = ['+', '-', '*', '/', '^'] as const
  static readonly grouping = ['(', ')'] as const

  static readonly basePrefix = {
    '0b': 2,
    '0x': 16,
  } as const
}

type Literal = 'NUMBER'
export type Operator = typeof Token.operators[number]
export type Grouping = typeof Token.grouping[number]
export type TokenType = Operator | Grouping | Literal | 'UNKNOWN'

export type WithRule = {
  token: Token
  rule?: InstanceType<new () => Expression>
}
