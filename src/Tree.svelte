<script>
import { createEventDispatcher } from 'svelte';
const dispatch = createEventDispatcher();

export let depth = 0;
export let tree;
let visible;

$: visible = Object.keys(tree).reduce((acc, key) => ({...acc, [key]: false }), {});

function toggleOrOpen(event, key) {
    if (typeof tree[key] == 'object') {
        visible[key] = !visible[key];
    } else {
        dispatch('open', { event, path: tree[key] });
    }
}
</script>

<ul>
    {#each Object.keys(tree) as key}
    <li>
        <span on:click={event => toggleOrOpen(event, key)}>{key}</span>
        {#if typeof tree[key] == 'object' && visible[key]}
        <svelte:self on:open tree={tree[key]} depth={depth + 1}/>
        {/if}
    </li>
    {/each}
</ul>