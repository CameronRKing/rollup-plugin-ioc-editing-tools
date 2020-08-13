<script>
import { onMount, createEventDispatcher } from 'svelte';

export function loadScript(src) {
    return new Promise(resolve => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        document.head.appendChild(script);
    });
}

const dispatch = createEventDispatcher();

let editDiv, editor;
export let path, content;
$: if (editor) {
    editor.setValue(content);
}

const commands = [
    {
        name: 'Build component',
        bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
        exec: (editor) => window.__DIS__.replaceComponent(path, editor.getValue())
    },
    {
        name: 'Start Zephyr',
        bindKey: { win: 'Alt-Z', mac: 'Meta-Z' },
        exec: (editor) => dispatch('startZephyr', { editor, path })
    }
];

function addCommands(editor, commands) {
    commands.forEach(command => editor.commands.addCommand(command));
}

function getCursorIndex() {
    const posObj = editor.getCursorPosition();
    const doc = editor.getSession().doc;
    return doc.positionToIndex(posObj);
}

onMount(async () => {
    // should it be built in? It doesn't seem to be on npm. I'd have to manually install the folder
    if (!window.ace) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.11/ace.min.js');
    }

    ace.config.set('basePath', 'https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.11/');
    editor = ace.edit(editDiv);
    configure(editor);
    addCommands(editor, commands);
});

function configure(editor) {
    // interestingly, ctrl + , opens up an options pane
    // that lets you change all of this during runtime
    editor.setShowPrintMargin(false);
    editor.setTheme('ace/theme/cobalt');
    editor.session.setMode('ace/mode/html');
    editor.setKeyboardHandler('ace/keyboard/sublime');
}

</script>

<div bind:this={editDiv} style="width: 100%; height: 100%;"></div>