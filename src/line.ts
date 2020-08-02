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
  private _errors: InputError[] = []
  private offset = 0

  public get input() {
    return this._input
  }
  public set input(v: string) {
    this._input = v

    const cmd = v.match(/^\/\w+(?=\s)/)?.[0]
    if (cmd) v = v.slice(cmd.length)

    this._output = v
    const { tree, errors } = Line.eval(v.trim())
    this._errors = errors
    this.offset = (cmd?.length ?? -1) + 1

    if (cmd === '/tree') treeStore.set(tree)
  }

  public get output() {
    return this._output
  }
  public get errors() {
    return this._errors
  }
  public get off() {
    return this.offset
  }

  static eval = memoize((v: string): {
    tree: Expr
    errors: InputError[]
  } => {
    let errors: InputError[] = []
    const { tokens, errors: scannerErrors } = new Scanner(v).scan()
    errors.push(
      ...scannerErrors.map(({ reason, ...rest }) => ({
        msg: reason ?? '',
        type: 'ScannerError' as ErrorType,
        ...rest,
      }))
    )
    const tree = new Parser(tokens).parse()
    return { tree, errors }
  })

  public focus = () => {}
}

type ErrorType = 'ScannerError' | 'ParserError'
type InputError = {
  start: number
  end: number
  msg: string
  type: ErrorType
}
