import Scanner from './scanner'
import type Token from './token'
import type { Error } from './scanner'

export default function (
  expr: string
): { result: string; tokens: Token[]; errors: Error[]; offset: number } {
  const [cmd] = expr.match(/^\/[a-z]+/) ?? []
  if (cmd) expr = expr.slice(cmd.length)

  const scanner = new Scanner(expr)
  const tokens = scanner.scan()
  const errors = scanner.errors

  console.log(tokens.join(' '))

  return { result: expr, tokens, errors, offset: cmd?.length ?? 0 }
}
