import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import componentIoc from 'rollup-plugin-svelte-component-ioc';
import layoutIntercept from 'rollup-plugin-layout-intercept';
import nodePolyfills from 'rollup-plugin-node-polyfills';
import json from '@rollup/plugin-json';
import styles from 'rollup-plugin-styles';
import fs from 'fs';
import path from 'path';

import injections from './src/injections.js';

const extraDependencies = {
    'mocha': { type: 'import', path: 'mocha' },
    'chai': { type: 'import', path: 'chai' },
    ...injections
}

export default {
    input: 'tinker/main.js',
    plugins: [
        styles({
            import: {
                // @lumino's file extension is CSS
                // but it relies on ~ import syntax
                // which is apparently a SASS thing
                // so we have to shim it manually here
                resolve(url, basedir, exts) {
                    let from;
                    if (url.startsWith('~')) {
                        from = path.resolve(path.resolve(__dirname, 'node_modules'), url.slice(1));
                    } else {
                        from = path.resolve(basedir, url);
                    }
                    return {
                        from,
                        source: fs.readFileSync(from)
                    };
                }
            }
        }),
        commonjs(),
        json(),
        nodePolyfills(),
        layoutIntercept(),
        componentIoc({ extraDependencies, root: __dirname, includeDependencies: false, exposeSource: true, ignore: ['/tinker', '/dist'] }),
        svelte({
            dev: true,
            css: css => {
                css.write('tinker/build/bundle.css');
            }
         }),
        resolve({ browser: true, dedupe: ['svelte'] }),
        serve(),
        livereload('tinker'),
    ],
    output: [
        { format: 'esm', file: 'tinker/build/build.js' },
    ]
};

function serve() {
    let started = false;

    return {
        writeBundle() {
            if (!started) {
                started = true;

                require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
                    stdio: ['ignore', 'inherit', 'inherit'],
                    shell: true
                });
            }
        }
    };
}