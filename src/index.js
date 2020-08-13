import fs from 'fs';
import path from 'path';
import findit from 'findit';
import injections from './injections.js';


export default function iocEditingTools({ extraDependencies }={}) {
    return {
        name: 'ioc-editing-tools',
        buildStart() {
            const foundDependencies = Object.assign({}, injections);

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