import fs from 'fs';
import path from 'path';
import findit from 'findit';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

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
                const finder = findit('./src');
                finder.on('file', file => {
                    if (file == 'src\\index.js') return;

                    copyFile(this, file.slice(4));
                });
                return new Promise(resolve => finder.on('end', resolve));
            }
        },
        resolve(),
        commonjs(),
    ],
    external: ['path', 'fs', 'events'],
    output: [
        { format: 'cjs', file: pkg.main, exports: 'auto' },
        { format: 'esm', file: pkg.module }
    ]
};