import Scanner from './scanner'
import Parser from './parser'
import type Token from './token'
import type { Error } from './scanner'
import { tree } from '../stores'

export default function (
  expr: string
): { result: string; tokens: Token[]; errors: Error[]; offset: number } {
  const [cmd] = expr.match(/^\/[a-z]+/) ?? []
  if (cmd) expr = expr.slice(cmd.length)

  const scanner = new Scanner(expr)
  const tokens = scanner.scan()
  const errors = scanner.errors

  const parser = new Parser(tokens)
  const ast = parser.parse()

  if (cmd === '/tree') tree.set(ast)
  else tree.set(null)

  return { result: expr, tokens, errors, offset: cmd?.length ?? 0 }
}
