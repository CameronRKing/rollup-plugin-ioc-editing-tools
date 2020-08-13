// remember to change the path references back before committing!
// unless I find some way to replace the names . . .
const production = !process.env.ROLLUP_WATCH;
const prefix = production ? 'ioc-editing-tools' : '/src';

function onShowHook(baseRow, makeCmp) {
    baseRow.addChild({
        type: 'column',
        content: [makeCmp('@PREFIX/HierarchyInspector.svelte')]
    }, 0);
}

async function openEditor(path, { inNewTab=false }={}) {
    const store = window.__DIS__.get();
    const layout = store['layout-intercept/gl_layout'];
    const makeCmp = store['layout-intercept/makeCmp'];

    const content = await window.__DIS__.lookupSource(path);
    const aceItem = makeCmp('@PREFIX/ComponentEditor.svelte', { content, path, lm_title: path });

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

function testPath(path) {
    return path.replace(/^\/src\//, '/test/')
        .replace(/\..+$/, '.spec.js');
}

export default {
    'ioc-editing-tools/testPath': { type: 'code', code: testPath.toString() },
    'ioc-editing-tools/openEditor': { type: 'code', code: openEditor.toString().replace(/@PREFIX/g, prefix) },
    'layout-intercept/onShow/ioc-editing-tools.js': { type: 'code', code: onShowHook.toString().replace(/@PREFIX/g, prefix) }
};