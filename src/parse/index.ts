import Scanner from './scanner'
import type Token from './token'

export default function (expr: string): { result: string; tokens: Token[] } {
  const tokens = new Scanner(expr).scan()
  console.log(tokens.join(' '))

  return { result: expr, tokens }
}
