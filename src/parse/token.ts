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

  static readonly operators = [
    '+',
    '-',
    '*',
    '/',
    '^',
    '!',
    'and',
    'or',
    'not',
  ] as const
  static readonly comparison = ['=', '!=', '<', '<=', '>', '>='] as const
  static readonly grouping = ['(', ')'] as const

  static readonly basePrefix = {
    '0b': 2,
    '0x': 16,
  } as const

  static readonly type = [
    ...Token.operators,
    ...Token.grouping,
    ...Token.comparison,
    'NUMBER',
    'BOOLEAN',
    'UNKNOWN',
  ] as const
}

export type Operator = typeof Token.operators[number]
export type Comparison = typeof Token.comparison[number]
export type Grouping = typeof Token.grouping[number]
export type TokenType = typeof Token.type[number]
