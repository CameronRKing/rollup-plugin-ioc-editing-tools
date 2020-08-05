import fs from 'fs';
import path from 'path';

import pkg from './package.json';

function copyFile(self, name) {
    self.emitFile({
        type: 'asset',
        fileName: name,
        source: fs.readFileSync(path.resolve(__dirname, `./src/${name}`), 'utf8')
    });
}

export default {
    input: 'src/index.js',
    plugins: [
        {
            buildStart() {
                copyFile(this, 'AceEditor.svelte');
                copyFile(this, 'StoreList.svelte');
                copyFile(this, 'Zephyr.svelte');
            }
        }
    ],
    external: ['path', 'fs'],
    output: [
        { format: 'cjs', file: pkg.main, exports: 'auto' },
        { format: 'esm', file: pkg.module }
    ]
};