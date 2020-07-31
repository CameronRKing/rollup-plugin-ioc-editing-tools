<script>
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

$: deps = Object.keys($__DIS__).sort();

</script>

<ul>
    {#each deps as path}
    <!-- file opening was dependent on GoldenLayout listening for known events on component registration -->
    <!-- with the new bridge, I can dynamically add listeners through componentState -->
    <li on:click={e => dispatch('open', { path, newTab: e.ctrlKey })}>{ path }</li>
    {/each}
</ul>