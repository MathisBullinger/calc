interface FixedArray<L extends number> extends Array<number> {
  0: number
  length: L
}

export class Vector<T extends number, K extends Vector<T> = undefined> {
  constructor(public readonly coords: FixedArray<T>) {}

  get magnitude() {
    return Math.sqrt(this.coords.map((v) => v ** 2).reduce((a, c) => a + c))
  }

  add(vec: Vector<T>): K extends undefined ? Vector<T> : K {
    return new Vector(
      this.coords.map((v, i) => v + vec.coords[i]) as FixedArray<T>
    ) as K extends undefined ? Vector<T> : K
  }

  minus(
    vec: K extends undefined ? Vector<T> : K
  ): K extends undefined ? Vector<T> : K {
    return new Vector(
      this.coords.map((v, i) => v - vec.coords[i]) as FixedArray<T>
    ) as K extends undefined ? Vector<T> : K
  }

  multiply(x: number): K extends undefined ? Vector<T> : K {
    return new Vector(
      this.coords.map((v) => v * x) as FixedArray<T>
    ) as K extends undefined ? Vector<T> : K
  }

  divide(x: number): K extends undefined ? Vector<T> : K {
    return new Vector(
      this.coords.map((v) => v / x) as FixedArray<T>
    ) as K extends undefined ? Vector<T> : K
  }

  round(): K extends undefined ? Vector<T> : K {
    return new Vector(
      this.coords.map((v) => Math.round(v)) as FixedArray<T>
    ) as K extends undefined ? Vector<T> : K
  }
}

export class Point extends Vector<2, Point> {
  constructor(...coords: FixedArray<2>) {
    super([...coords, 0, 0].slice(0, 2) as FixedArray<2>)
  }

  get x() {
    return this.coords[0]
  }
  get y() {
    return this.coords[1]
  }
}
