import fs from 'fs';
import path from 'path';

export default function iocEditingTools({ extraDependencies }={}) {
    return {
        name: 'ioc-editing-tools',
        buildStart() {
            const onShowHook = (baseRow, makeCmp) => {
                baseRow.addChild({
                    type: 'column',
                    content: [makeCmp('ioc-editing-tools/StoreList.svelte')]
                }, 0);
            }

            Object.assign(extraDependencies, {
                'ioc-editing-tools/AceEditor.svelte': { type: 'import', defaultOnly: true, path: 'ioc-editing-tools/AceEditor.svelte' },
                'ioc-editing-tools/StoreList.svelte': { type: 'import', defaultOnly: true, path: 'ioc-editing-tools/StoreList.svelte' },
                'ioc-editing-tools/Zephyr.svelte': { type: 'import', defaultOnly: true, path: 'ioc-editing-tools/Zephyr.svelte' },
                'layout-intercept/onShow/ioc-editing-tools.js': { type: 'code', code: onShowHook.toString() }
            });
        },
        resolveId(importee, importer) {
            if (importee.startsWith('ioc-editing-tools/')) return importee;
        },
        load(id) {
            if (!id.startsWith('ioc-editing-tools/')) return;

            return fs.readFileSync(path.resolve(__dirname, `./${id.replace('ioc-editing-tools/', '')}`), 'utf8');
        }
    };
}