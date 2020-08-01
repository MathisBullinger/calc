import memoize from './utils/memoize'
import Scanner from './parse/scanner'
import Parser from './parse/parser2'
import { tree as treeStore } from './stores'
import type { Expr } from './parse/ast/Expr'

export default class Line {
  private static count = 0

  constructor(private readonly id = ++Line.count) {}

  private _input = ''
  private _output = ''

  public get input() {
    return this._input
  }
  public set input(v: string) {
    this._input = v

    const cmd = v.match(/^\/\w+(?=\s)/)?.[0]
    if (cmd) v = v.slice(cmd.length)

    this._output = v
    const { tree } = Line.eval(v.trim())

    if (cmd === '/tree') treeStore.set(tree)
  }

  public get output() {
    return this._output
  }

  static eval = memoize((v: string): { tree: Expr } => {
    const tokens = new Scanner(v).scan()
    const tree = new Parser(tokens).parse()
    return { tree }
  })

  public focus = () => {}
}
