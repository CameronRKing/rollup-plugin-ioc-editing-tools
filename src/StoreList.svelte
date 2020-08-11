<script>
import { onMount } from 'svelte';

$: deps = Object.keys($__DIS__).sort();
</script>

<ul style="overflow: auto; height: 100%;">
    {#each deps as path}
    <!-- file opening was dependent on GoldenLayout listening for known events on component registration -->
    <!-- with the new bridge, I can dynamically add listeners through componentState -->
    <li on:click={e => $__DIS__['ioc-editing-tools/openEditor'](path, { inNewTab: e.ctrlKey })}>{ path }</li>
    {/each}
</ul>