<script lang="ts">
  import { tree } from './stores'

  let _canvas: HTMLElement

  $: if (_canvas && $tree) {
    const canvas: HTMLCanvasElement = _canvas as any
    canvas.width = canvas.clientWidth * devicePixelRatio
    canvas.height = canvas.clientHeight * devicePixelRatio

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#fff'
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

<canvas hidden={!$tree} bind:this={_canvas} />
