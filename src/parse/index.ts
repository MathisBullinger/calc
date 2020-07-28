export type Token = {
  type: 'NUMBER' | 'OPERATION' | 'UNKNOWN'
  value: string
  index: number
}

export default function (expr: string): { result: string; tokens: Token[] } {
  const tokens: Token[] = []

  for (const match of expr.matchAll(/[+\-*/]/g)) {
    tokens.push({ type: 'OPERATION', value: match[0], index: match.index })
  }

  return { result: expr, tokens }
}
