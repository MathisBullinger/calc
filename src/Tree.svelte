<script lang="ts">
  import { tree } from './stores'
  import type Node from './utils/node'
  import { Point } from './utils/math'

  let _canvas: HTMLElement

  function render() {
    const canvas: HTMLCanvasElement = _canvas as any
    canvas.width = canvas.clientWidth * devicePixelRatio
    canvas.height = canvas.clientHeight * devicePixelRatio

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#fff'
    ctx.fillStyle = '#fff'
    ctx.font = `${devicePixelRatio}rem sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    let totalDepth = 0
    let layers = { 1: 1 }
    function walkTree(node: Node, depth = 1) {
      if (depth > totalDepth) totalDepth = depth
      if (node.children.length)
        layers[depth + 1] = (layers[depth + 1] ?? 0) + node.children.length
      node.children.forEach((child) => walkTree(child, depth + 1))
    }
    walkTree($tree)

    const maxSiblings = Math.max(...Object.values(layers))

    const nodeSize =
      Math.min(canvas.width, canvas.height) /
      (Math.max(totalDepth, ...Object.values(layers)) + 1) /
      2

    function renderNode(
      xRoot: number,
      layer: number,
      node: Node,
      siblings?: Node[]
    ) {
      let x = xRoot
      if (siblings)
        x += (siblings.indexOf(node) - siblings.length / 2 + 0.5) * nodeSize * 2
      const y = nodeSize * (layer + 1) * 2

      if (siblings) {
        const startAnchor = new Point(x, y)
        const endAnchor = new Point(xRoot, y - nodeSize * 2)
        const dir = endAnchor.minus(startAnchor)
        const start = startAnchor.add(
          dir.multiply(nodeSize / 4 / dir.magnitude)
        )
        const end = endAnchor.minus(dir.multiply(nodeSize / 4 / dir.magnitude))
        ctx.moveTo(...(start.round().coords as [number, number]))
        ctx.lineTo(...(end.round().coords as [number, number]))
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.ellipse(x, y, nodeSize / 4, nodeSize / 4, 0, 0, 2 * Math.PI)
      ctx.stroke()

      ctx.fillText(node.toString(), x, y)

      node.children?.forEach((child) =>
        renderNode(x, layer + 1, child, node.children)
      )
    }

    renderNode(canvas.width / 2, 0, $tree)
  }

  $: if (_canvas && $tree) {
    render()
  }
</script>

<style>
  canvas {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 40rem;
    height: 40rem;
    max-width: 100vmin;
    max-height: 100vmin;

    border: 1px solid red;
  }
</style>

{#if $tree}
  <canvas bind:this={_canvas} on:resize={render} />
{/if}
