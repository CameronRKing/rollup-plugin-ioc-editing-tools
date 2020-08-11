<script>
import { onMount } from 'svelte';

$: deps = Object.keys($__DIS__).sort();

async function openEditor(path, { inNewTab=false }) {
    const store = window.__DIS__.get();
    const layout = store['layout-intercept/gl_layout'];
    const makeCmp = store['layout-intercept/makeCmp'];

    const content = await window.__DIS__.lookupSource(path);
    const aceItem = makeCmp('ioc-editing-tools/AceEditor.svelte', { content, path, lm_title: path });

    const baseRow = layout.root.contentItems[0];
    if (baseRow.contentItems.length < 3) {
        baseRow.addChild({
            type: 'column',
            content: [aceItem]
        }, 1)
    } else {
        if (inNewTab)
            baseRow.contentItems[1].addChild(aceItem);
        else
            baseRow.contentItems[1].replaceChild(baseRow.contentItems[1].contentItems[0], aceItem);
    }
}

const openEditorPath = 'ioc-editing-tools/openEditor';

onMount(() => {
    if (!deps[openEditorPath])
        __DIS__.replace(openEditorPath,  (...args) => console.log('called with', ...args));// openEditor);
});


</script>

<ul>
    {#each deps as path}
    <!-- file opening was dependent on GoldenLayout listening for known events on component registration -->
    <!-- with the new bridge, I can dynamically add listeners through componentState -->
    <li on:click={e => $__DIS__[openEditorPath](path, { inNewTab: e.ctrlKey })}>{ path }</li>
    {/each}
</ul>