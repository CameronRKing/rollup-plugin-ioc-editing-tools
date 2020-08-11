<script>
import { onMount } from 'svelte';
export let gl_container, gl_layout;

let ignoreWarning = gl_container;

$: deps = Object.keys($__DIS__).sort();

async function openEditor(layout, path, event) {
    const openInNewTab = event.ctrlKey;
    const content = await __DIS__.lookupSource(path);

    const aceItem = __DIS__.get()['layout-intercept/makeCmp']('ioc-editing-tools/AceEditor.svelte', { content, path, lm_title: path });

    const baseRow = layout.root.contentItems[0];
    if (baseRow.contentItems.length < 3) {
        baseRow.addChild({
            type: 'column',
            content: [aceItem]
        }, 1)
    } else {
        if (openInNewTab)
            baseRow.contentItems[1].addChild(aceItem);
        else
            baseRow.contentItems[1].replaceChild(baseRow.contentItems[1].contentItems[0], aceItem);
    }
}

const openEditorPath = 'ioc-editing-tools/openEditor';

onMount(() => {
    if (!deps[openEditorPath])
        __DIS__.replace(openEditorPath, openEditor);
});

</script>

<ul>
    {#each deps as path}
    <!-- file opening was dependent on GoldenLayout listening for known events on component registration -->
    <!-- with the new bridge, I can dynamically add listeners through componentState -->
    <li on:click={e => $__DIS__[openEditorPath](gl_layout, path, e)}>{ path }</li>
    {/each}
</ul>