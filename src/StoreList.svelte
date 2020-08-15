<script>
import Tree from './Tree.svelte';
import { onMount } from 'svelte';

let view = 'List';
$: deps = Object.keys($__DIS__).sort();
$: depTree = parseHierarchy(deps);

let searchVal;
$: matchedDeps = searchVal ? deps.filter(name => name.match(searchVal)) : deps;

function parseHierarchy(names) {
    const tree = {};

    names.forEach(name => {
        let branch = tree;
        const [tail, ...head] = name.split('/').filter(str => str != '').reverse()
        head.reverse().forEach(chunk => {
            if (!branch[chunk]) branch[chunk] = {};
            if (typeof branch[chunk] == 'string') {
                const val = branch[chunk];
                branch[chunk] = {'.self': val};
            }
            branch = branch[chunk];
        });

        branch[tail] = name;
    });
    return tree;
}

function open(event, path) {
    $__DIS__['ioc-editing-tools/openEditor'](path, { inNewTab: event.ctrlKey });
}

</script>

<label><input type="radio" bind:group={view} value="List">List</label>
<label><input type="radio" bind:group={view} value="Tree">Tree</label>

{#if view == 'List'}
<input type="text" placeholder="Search" bind:value={searchVal} />
<ul style="overflow: auto; height: 100%;">
    {#each matchedDeps as path}
    <!-- file opening was dependent on GoldenLayout listening for known events on component registration -->
    <!-- with the new bridge, I can dynamically add listeners through componentState -->
    <li on:click={e => open(e, path)}>{ path }</li>
    {/each}
</ul>
{:else}
<Tree on:open={({ detail: { event, path } }) => open(event, path)} tree={depTree} />
{/if}