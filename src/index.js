// but this isn't published yet!
// I'm also not yet convinced that this method will work.
// once everything is effectively split out and the unit tests pass,
// I should local npm install them into the test directory
// and confirm that the communication works as designed
import { registerDependency } from 'rollup-plugin-svelte-component-ioc';

// for opening a file with AceEditor
// findSourceCode is now window.__DIS__.lookupSource
async function openFile({ detail: { path, newTab } }) {
    const content = await findSourceCode(path);

    // initializing components should be hidden behind some kind of interface,
    // since layout-intercept employs a bridge component that instantiates the concrete component
    // through dependency injection via window.__DIS__
    const aceItem = {
        type: 'component',
        componentName: 'AceEditor',
        componentState: { content, path, lm_title: path }
    };

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
}

async function startZephyr({ detail: { editor, path } }) {
    const ast = new SvelteAstEditor(editor.getValue());
    await ast.ready();

    ast.addZephyrIds();

    const newSrc = ast.toString();
    editor.setValue(newSrc);
    replaceComponent(path, newSrc);

    baseRow.addChild(columnContaining('Zephyr'), 1);
}

function columnContaining(componentName, componentState={}) {
    return {
        type: 'column',
        content: [{
            type: 'component',
            componentName,
            componentState
        }]
    };
}

// this was inside layout-intercept.showLayout()
baseRow.addChild(columnContaining('StoreList'), 0);

export default function iocEditingTools() {
    name: 'ioc-editing-tools',
    resolveId(importee, importer) {

    },
    load(id) {

    }
}