<script lang="ts">
  export let lines = []
</script>

<style>
  ol {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    height: 100%;
    flex-grow: 1;
    min-width: 30ch;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    padding-top: var(--padding);
    padding-right: var(--padding);
    list-style: none;
    overflow-x: hidden;
  }

  li {
    margin-bottom: var(--line-dist);
  }
</style>

<ol>
  {#each lines as line}
    <li>{line}</li>
  {/each}
</ol>
