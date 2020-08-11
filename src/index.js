import fs from 'fs';
import path from 'path';
import findit from 'findit';

function onShowHook(baseRow, makeCmp) {
    baseRow.addChild({
        type: 'column',
        content: [makeCmp('ioc-editing-tools/HierarchyInspector.svelte')]
    }, 0);
}

async function openEditor(path, { inNewTab=false }) {
    const store = window.__DIS__.get();
    const layout = store['layout-intercept/gl_layout'];
    const makeCmp = store['layout-intercept/makeCmp'];

    const content = await window.__DIS__.lookupSource(path);
    const aceItem = makeCmp('ioc-editing-tools/AceEditor.svelte', { content, path, lm_title: path });

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

export default function iocEditingTools({ extraDependencies }={}) {
    return {
        name: 'ioc-editing-tools',
        buildStart() {
            const foundDependencies = {
                'ioc-editing-tools/openEditor': { type: 'code', code: openEditor.toString() },
                'layout-intercept/onShow/ioc-editing-tools.js': { type: 'code', code: onShowHook.toString() }
            };

            const finder = findit(__dirname);
            finder.on('file', file => {
                if (file == 'index.js') return;

                const path = 'ioc-editing-tools' + file.replace(__dirname, '').replace(/\\/g, '/');
                if (file.endsWith('.svelte')) {
                    foundDependencies[path] = { type: 'import', defaultOnly: true, path };
                } else {
                    foundDependencies[path] = { type: 'import', path };
                }
            });

            finder.on('end', () => Object.assign(extraDependencies, foundDependencies));
        },
        resolveId(importee, importer) {
            if (importee.startsWith('ioc-editing-tools/')) return importee;
            if (importer && importer.startsWith('ioc-editing-tools/') && importee.startsWith('.')) {
                return path.posix.resolve('/' + path.dirname(importer), importee).slice(1);
            }
        },
        load(id) {
            if (!id.startsWith('ioc-editing-tools/')) return;

            return fs.readFileSync(path.resolve(__dirname, `./${id.replace('ioc-editing-tools/', '')}`), 'utf8');
        }
    };
}