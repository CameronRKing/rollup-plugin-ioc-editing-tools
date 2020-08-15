// remember to change the path references back before committing!
// unless I find some way to replace the names . . .
const production = !process.env.ROLLUP_WATCH;
const prefix = production ? 'ioc-editing-tools' : '/src';

function onShowHook(baseRow, makeCmp) {
    baseRow.addChild({
        type: 'column',
        content: [{
            type: 'stack',
            content: [
                makeCmp('@PREFIX/HierarchyInspector.svelte', { lm_title: 'Page Inspector' }),
                makeCmp('@PREFIX/StoreList.svelte', { lm_title: 'Store List' })
            ]
        }]
    }, 0);
}

async function openEditor(path, { inNewTab=false }={}) {
    const store = window.__DIS__.get();
    const layout = store['layout-intercept/gl_layout'];
    const makeCmp = store['layout-intercept/makeCmp'];

    const editorItem = makeCmp('@PREFIX/ComponentEditor.svelte', { path, lm_title: path });

    const baseRow = layout.root.contentItems[0];
    if (baseRow.contentItems.length < 3) {
        baseRow.addChild({
            type: 'column',
            content: [editorItem]
        }, 1)
    } else {
        if (inNewTab)
            baseRow.contentItems[1].addChild(editorItem);
        else
            baseRow.contentItems[1].replaceChild(baseRow.contentItems[1].contentItems[0], editorItem);
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