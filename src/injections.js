// remember to change the path references back before committing!
// unless I find some way to replace the names . . .
const production = !process.env.ROLLUP_WATCH;
const prefix = production ? 'ioc-editing-tools' : '/src';

function onInitHook(layout, makeCmp, widgets, commands) {
    const dock = new widgets.DockPanel();
    dock.addWidget(makeCmp('@PREFIX/HierarchyInspector.svelte', {}, { label: 'Page Inspector' }));
    const listWidget = makeCmp('@PREFIX/StoreList.svelte', {}, { label: 'Store List' });
    dock.addWidget(listWidget);

    const palette = new widgets.CommandPalette({ commands });
    palette.title.label = 'Commands';
    palette.title.closable = false;
    commands.addCommand('focus-command-palette', {
        label: 'Focus command palette',
        caption: 'Focuses the cursor in the global command palette',
        execute: () => {
            dock.selectWidget(palette);
            palette.inputNode.focus();
        }
    });
    commands.addKeyBinding({
        command: 'focus-command-palette',
        keys: ['Alt P'],
        selector: 'body'
    });
    commands.listCommands().forEach(command => palette.addItem({ category: 'all', command }));

    // I have no idea why it was happening, but by default the palette was being rendered before the Store List
    dock.addWidget(palette, { ref: listWidget });

    layout.widgets[0].insertWidget(0, dock);
}

async function openEditor(path, { inNewTab=false }={}) {
    const store = window.__DIS__.get();
    const layout = store['layout-intercept/layout'];
    const makeCmp = store['layout-intercept/makeCmp'];
    const widgets = store['layout-intercept/widgets'];

    const editorItem = makeCmp('@PREFIX/ComponentEditor.svelte', { path }, { label: path });

    // not a fan of this order-based logic
    const splitPanel = layout.widgets[0];
    if (splitPanel.widgets.length < 3) {
        const dock = new widgets.DockPanel();
        dock.addWidget(editorItem);
        splitPanel.insertWidget(1, dock);
    } else {
        splitPanel.widgets[1].addWidget(editorItem);
    }
}

function testPath(path) {
    return path.replace(/^\/src\//, '/test/')
        .replace(/\..+$/, '.spec.js');
}

function docPath(path) {
    return path.replace(/^\/src\//, '/doc/')
        .replace(/\..+$/, '.svx');
}

export default {
    'ioc-editing-tools/testPath': { type: 'code', code: testPath.toString() },
    'ioc-editing-tools/docPath': { type: 'code', code: docPath.toString() },
    'ioc-editing-tools/openEditor': { type: 'code', code: openEditor.toString().replace(/@PREFIX/g, prefix) },
    'layout-intercept/onInit/ioc-editing-tools.js': { type: 'code', code: onInitHook.toString().replace(/@PREFIX/g, prefix) }
};