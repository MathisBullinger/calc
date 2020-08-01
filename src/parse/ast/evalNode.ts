import Node from '../../utils/node'

export default abstract class EvalNode<T extends any> extends Node {
  abstract eval(): T
}
