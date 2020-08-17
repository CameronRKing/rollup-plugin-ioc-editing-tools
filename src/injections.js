// remember to change the path references back before committing!
// unless I find some way to replace the names . . .
const production = !process.env.ROLLUP_WATCH;
const prefix = production ? 'ioc-editing-tools' : '/src';

function onShowHook(layout, makeCmp, widgets) {
    const dock = new widgets.DockPanel();
    dock.addWidget(makeCmp('@PREFIX/HierarchyInspector.svelte', {}, { label: 'Page Inspector' }));
    dock.addWidget(makeCmp('@PREFIX/StoreList.svelte', {}, { label: 'Store List' }));

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
    'layout-intercept/onShow/ioc-editing-tools.js': { type: 'code', code: onShowHook.toString().replace(/@PREFIX/g, prefix) }
};