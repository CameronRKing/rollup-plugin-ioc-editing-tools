import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import componentIoc from 'rollup-plugin-svelte-component-ioc';
import path from 'path';

export default {
    input: 'tinker/index.js',
    external: ['path', 'fs'],
    plugins: [
        componentIoc({ root: __dirname, includeDependencies: false, exposeSource: true, ignore: ['/tinker', '/dist'] }),
        svelte({ dev: true }),
        resolve(),
        commonjs(),
        serve(),
        livereload('tinker'),
    ],
    output: [
        { format: 'esm', file: 'tinker/build.js' },
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