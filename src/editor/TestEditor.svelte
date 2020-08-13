<script>
import SourceEditor from './SourceEditor.svelte';

export let path;

$: testPath = $__DIS__['ioc-editing-tools/testPath'](path);
$: content = $__DIS__[testPath] || '';

const commands = [
    {
        name: 'Run tests',
        bindKey: { win: 'Alt-R', mac: 'Meta-R' },
        exec: (editor) => runMocha([editor.getValue()])
    }
];

function convertImportToRequire(src) {
    return src.replace(/import/g, 'const')
        .replace(/\* as /g, '')
        .replace(/from (.+)[;$]/g, '= require($1);');
}

function hydrateTest(src) {
    return (new Function('require', convertImportToRequire(src)))
        .bind(null, path => window.__DIS__.get()[path]);
}

// needs reporter interface
function runMocha(tests) {
    const { Mocha } = window.__DIS__.get()['mocha'];
    const { Suite } = Mocha;

    const tester = new Mocha();
    const {
        EVENT_FILE_PRE_REQUIRE,
        EVENT_FILE_REQUIRE,
        EVENT_FILE_POST_REQUIRE
    } = Suite.constants;

    tests.forEach(src => {
        const testFn = hydrateTest(src);

        tester.suite.emit(EVENT_FILE_PRE_REQUIRE, window, path, tester);
        tester.suite.emit(EVENT_FILE_REQUIRE, testFn(), path, tester);
        tester.suite.emit(EVENT_FILE_POST_REQUIRE, window, path, tester);
    });

    return tester.run();
}

</script>

<SourceEditor {content} path={testPath} {commands} mode={'javascript'} />