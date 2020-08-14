<script>
import SourceEditor from './SourceEditor.svelte';
// the "browser" key in package.json and the actual file don't match
// to avoid "can't resolve dependency" errors from rollup,
// the import must target the actual file we need
import { mdsvex } from 'mdsvex/dist/mdsvex.js';

function dis(key) {
    return window.__DIS__.get()[key];
}

export let path;
let DocCmp;
$: docPath = dis('ioc-editing-tools/docPath')(path);
$: content = dis(docPath) || '';
$: content.length ? window.__DIS__.buildComponent(docPath, content, { preprocess: [mdsvex()] }).then(cmp => DocCmp = cmp) : null;

const commands = [
    {
        name: 'Rerender docs',
        bindKey: { win: 'Alt-R', mac: 'Meta-R' },
        exec: (editor) => content = editor.getValue()
    }
];

let show = 'source';
</script>

<div class="tabs">
    <div class="tab" class:selected={show == 'source'} on:click={() => show = 'source'}>Source</div>
    <div class="tab" class:selected={show == 'render'} on:click={() => show = 'render'}>Render</div>
</div>

<div class="tab-content" class:hide={show !== 'source'}>
    <SourceEditor {content} {path} {commands} />
</div>
<div class="tab-content" class:hide={show !== 'render'}>
    <svelte:component this={DocCmp} />
</div>
