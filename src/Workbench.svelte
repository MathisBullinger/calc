<script lang="ts">
  import Input from "./InputArea.svelte";
  import Output from "./OutputArea.svelte";
  import Resizer from "./Resizer.svelte";
</script>

<style>
  div {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;

    --resize-offset: 0px;
  }
</style>

<div id="workbench">
  <Input />
  <Resizer />
  <Output />
</div>
