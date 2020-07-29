import Scanner from './scanner'
import type Token from './token'
import type { Error } from './scanner'

export default function (
  expr: string
): { result: string; tokens: Token[]; errors: Error[] } {
  const scanner = new Scanner(expr)
  const tokens = scanner.scan()
  const errors = scanner.errors

  console.log(tokens.join(' '))

  return { result: expr, tokens, errors }
}
