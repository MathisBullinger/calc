<script lang="ts">
  let offset = 0

  function dragStart() {
    function onMouseMove(event) {
      event.preventDefault()
      offset += event.movementX
      ;(document.querySelector('#workbench') as HTMLElement).style.setProperty(
        '--resize-offset',
        offset + 'px'
      )
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener(
      'mouseup',
      () => {
        window.removeEventListener('mousemove', onMouseMove)
      },
      { once: true }
    )
  }
</script>

<style>
  div {
    width: 1px;
    height: 100%;
    flex-shrink: 0;
    background-color: #888;
    cursor: ew-resize;
    position: relative;
    opacity: 0.15;
    transition: opacity 0.15s ease;
  }

  div::before {
    content: '';
    display: block;
    position: absolute;
    height: 100%;
    width: 21px;
    left: -10px;
  }

  div:hover {
    opacity: 1;
  }
</style>

<div on:mousedown={dragStart} />
