<script>
import { onMount } from 'svelte';
export let gl_container, gl_layout;

$: deps = Object.keys($__DIS__).sort();

onMount(() => {
    if (!deps['ioc-editing-tools/openDependency']) {
        __DIS__.replace('ioc-editing-tools/openDependency', async (layout, path, event) => {
            const newTab = event.ctrlKey;
            const content = await __DIS__.lookupSource(path);

            // initializing components should be hidden behind some kind of interface,
            // since layout-intercept employs a bridge component that instantiates the concrete component
            // through dependency injection via window.__DIS__
            const aceItem = __DIS__.get()['layout-intercept/makeCmp']('ioc-editing-tools/AceEditor', { content, path, lm_title: path });

            const baseRow = layout.root.contentItems[0];
            if (baseRow.contentItems.length < 3) {
                baseRow.addChild({
                    type: 'column',
                    content: [aceItem]
                }, 1)
            } else {
                if (newTab)
                    baseRow.contentItems[1].addChild(aceItem);
                else
                    baseRow.contentItems[1].replaceChild(baseRow.contentItems[1].contentItems[0], aceItem);
            }
        });
    }
});
</script>

<ul>
    {#each deps as path}
    <!-- file opening was dependent on GoldenLayout listening for known events on component registration -->
    <!-- with the new bridge, I can dynamically add listeners through componentState -->
    <li on:click={e => $__DIS__['ioc-editing-tools/openDependency'](gl_layout, path, e)}>{ path }</li>
    {/each}
</ul>