enum Precedence {
  expression = 1,
  equality = 2,
  comparison = 3,
  addition = 4,
  multiplication = 5,
  implicit = 6,
  unary = 7,
  primary = 8,
}

interface ParamsArray<T extends any, L extends number> extends Array<T> {
  0: T
  length: L
}

export abstract class Expression {
  abstract readonly precedence: Precedence
}

abstract class Operation<
  T extends number | boolean,
  L extends number
> extends Expression {
  abstract readonly associativity: 'left' | 'right'
  abstract evaluate(...args: ParamsArray<T, L>): T
}

export class Primitive extends Expression {
  readonly precedence = Precedence.primary
}

export class Group extends Expression {
  readonly precedence = Precedence.primary
}

export class Addition extends Operation<number, 2> {
  readonly precedence = Precedence.addition
  readonly associativity = 'left'

  evaluate(a: number, b: number): number {
    return a + b
  }
}

export class Substraction extends Operation<number, 2> {
  readonly precedence = Precedence.addition
  readonly associativity = 'left'

  evaluate(a: number, b: number): number {
    return a - b
  }
}

export class MultiplicationExplicit extends Operation<number, 2> {
  readonly precedence = Precedence.multiplication
  readonly associativity = 'left'

  evaluate(a: number, b: number): number {
    return a * b
  }
}

export class MultiplicationImplicit extends Operation<number, 2> {
  readonly precedence = Precedence.implicit
  readonly associativity = 'left'

  evaluate(a: number, b: number): number {
    return a * b
  }
}

export class Division extends Operation<number, 2> {
  readonly precedence = Precedence.multiplication
  readonly associativity = 'left'

  evaluate(a: number, b: number): number {
    return a / b
  }
}

export class UnaryPlus extends Operation<number, 1> {
  readonly precedence = Precedence.unary
  readonly associativity = 'right'

  evaluate(a: number): number {
    return a
  }
}

export class UnaryMinus extends Operation<number, 1> {
  readonly precedence = Precedence.unary
  readonly associativity = 'right'

  evaluate(a: number): number {
    return -a
  }
}
