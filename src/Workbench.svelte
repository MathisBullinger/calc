<script lang="ts">
  import Input from './InputArea.svelte'
  import Output from './OutputArea.svelte'
  import Resizer from './Resizer.svelte'

  let lines = []
</script>

<style>
  div {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;

    --resize-offset: 0px;
    --padding: max(5vmin, 1rem);
    --line-dist: 1.5rem;
  }

  * {
    line-height: 1.5;
  }
</style>

<div id="workbench">
  <Input bind:lines />
  <Resizer />
  <Output {lines} />
</div>
