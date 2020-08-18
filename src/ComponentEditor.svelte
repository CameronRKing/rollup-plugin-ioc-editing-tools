<script>
import SourceEditor from './editor/SourceEditor.svelte';
import TestEditor from './editor/TestEditor.svelte';
import DocEditor from './editor/DocEditor.svelte';
import { CommandRegistry } from '@lumino/commands';
import { CommandPalette, Widget } from '@lumino/widgets';

const commands = new CommandRegistry();
commands.addCommand('log-foo', {
    label: 'Log `foo`',
    caption: 'Logs `foo` to the console',
    execute: () => console.log('foo')
});
commands.addKeyBinding({
    command: 'log-foo',
    keys: ['Alt C'],
    selector: '.lm-Widget'
});


const palette = new CommandPalette({ commands });
// why the palette doesn't pick up items from the COMMAND REGISTRY IT IS GIVEN is beyond me
commands.listCommands().forEach(command => palette.addItem({ category: 'all', command }));

export let path;
// not sure how to use await efficiently with watch statements
let content = '';
$: window.__DIS__.lookupSource(path).then(src => content = src);

let show = 'source';

</script>

<div class="tabs">
    <div class="tab" class:selected={show == 'source'} on:click={() => show = 'source'}>Source</div>
    <div class="tab" class:selected={show == 'tests'} on:click={() => show = 'tests'}>Tests</div>
    <div class="tab" class:selected={show == 'docs'} on:click={() => show = 'docs'}>Docs</div>
</div>

<div class="tab-content" class:hide={show !== 'source'}>
    <SourceEditor {content} {path} />
</div>
<div class="tab-content" class:hide={show !== 'tests'}>
    <TestEditor {path} />
</div>
<div class="tab-content" class:hide={show !== 'docs'}>
    <DocEditor {path} />
</div>

<svelte:window on:keydown={e => commands.processKeydownEvent(e)} />

<style>
/* should definitely go in a tabs component */
:global(.tabs) {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: flex-start;
}

:global(.tab).selected {
    border-bottom: 2px solid green;
}

:global(.tab)-content {
    height: 100%;
    width: 100%;
}

:global(.hide) {
    display: none;
}
</style>