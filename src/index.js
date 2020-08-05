import fs from 'fs';
import path from 'path';

export default function iocEditingTools({ extraDependencies }={}) {
    return {
        name: 'ioc-editing-tools',
        buildStart() {
            const onShowHook = (baseRow, makeCmp) => {
                baseRow.addChild({
                    type: 'column',
                    content: [makeCmp('ioc-editing-tools/StoreList')]
                }, 0);
            }

            Object.assign(extraDependencies, {
                'ioc-editing-tools/AceEditor': { type: 'import', defaultOnly: true, path: 'ioc-editing-tools:AceEditor.svelte' },
                'ioc-editing-tools/StoreList': { type: 'import', defaultOnly: true, path: 'ioc-editing-tools:StoreList.svelte' },
                'ioc-editing-tools/Zephyr': { type: 'import', defaultOnly: true, path: 'ioc-editing-tools:Zephyr.svelte' },
                'layout-intercept/onShow/ioc-editing-tools': { type: 'code', code: onShowHook.toString() }
            });
        },
        resolveId(importee, importer) {
            if (importee.startsWith('ioc-editing-tools:')) return importee;
        },
        load(id) {
            if (!id.startsWith('ioc-editing-tools:')) return;

            return fs.readFileSync(path.resolve(__dirname, `./${id.replace('ioc-editing-tools:', '')}`), 'utf8');
        }
    };
}

// // for opening a file with AceEditor
// // findSourceCode is now window.__DIS__.lookupSource
// async function openFile({ detail: { path, newTab } }) {
//     const content = await findSourceCode(path);

//     // initializing components should be hidden behind some kind of interface,
//     // since layout-intercept employs a bridge component that instantiates the concrete component
//     // through dependency injection via window.__DIS__
//     const aceItem = {
//         type: 'component',
//         componentName: 'AceEditor',
//         componentState: { content, path, lm_title: path }
//     };

//     if (baseRow.contentItems.length < 3) {
//         baseRow.addChild({
//             type: 'column',
//             content: [aceItem]
//         }, 1)
//     } else {
//         if (newTab)
//             baseRow.contentItems[1].addChild(aceItem);
//         else
//             baseRow.contentItems[1].replaceChild(baseRow.contentItems[1].contentItems[0], aceItem);
//     }
// }

// async function startZephyr({ detail: { editor, path } }) {
//     const ast = new SvelteAstEditor(editor.getValue());
//     await ast.ready();

//     ast.addZephyrIds();

//     const newSrc = ast.toString();
//     editor.setValue(newSrc);
//     replaceComponent(path, newSrc);

//     baseRow.addChild(columnContaining('Zephyr'), 1);
// }

// function columnContaining(componentName, componentState={}) {
//     return {
//         type: 'column',
//         content: [{
//             type: 'component',
//             componentName,
//             componentState
//         }]
//     };
// }

// // this was inside layout-intercept.showLayout()
// baseRow.addChild(columnContaining('StoreList'), 0);