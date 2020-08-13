<script>
import SourceEditor from './editor/SourceEditor.svelte';
import TestEditor from './editor/TestEditor.svelte';
import StoryEditor from './editor/StoryEditor.svelte';

export let path;
// should ComponentEditor fetch the source of the component?
// should it also fetch the test source? the stories?
// or should it delegate all of that to the nested components?
export let content;

let show = 'source';

</script>

<div>
    <div class="tabs">
        <div class="tab" class:selected={show == 'source'} on:click={() => show = 'source'}>Source</div>
        <div class="tab" class:selected={show == 'tests'} on:click={() => show = 'tests'}>Tests</div>
        <div class="tab" class:selected={show == 'stories'} on:click={() => show = 'stories'}>Stories</div>
    </div>
</div>

<div class="tab-content" class:hide={show !== 'source'}>
    <SourceEditor {content} {path} />
</div>
<div class="tab-content" class:hide={show !== 'tests'}>
    <TestEditor {path} />
</div>
<div class="tab-content" class:hide={show !== 'stories'}>
    <StoryEditor {path} />
</div>

<style>
.tabs {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: flex-start;
}

.tab.selected {
    border-bottom: 2px solid green;
}

.tab-content {
    height: 100%;
    width: 100%;
}

.hide {
    display: none;
}
</style>