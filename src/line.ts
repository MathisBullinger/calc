import memoize from './utils/memoize'
import Scanner from './parse/scanner'
import Parser from './parse/parser2'
import { tree as treeStore } from './stores'

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
    this._output = v
    Line.eval(v.trim())
  }

  public get output() {
    return this._output
  }

  static eval = memoize((v: string) => {
    const tokens = new Scanner(v).scan()
    console.log(tokens)
    const tree = new Parser(tokens).parse()
    console.log(tree)
    if (tree) treeStore.set(tree)
  })

  public focus = () => {}
}
