<script>

function convertImportToRequire(src) {
    return src.replace(/import/g, 'const')
        .replace(/\* as /g, '')
        .replace(/from (.+)[;$]/g, '= require($1);');
}

function hydrateTest(src) {
    return (new Function('require', convertImportToRequire(src)))
        .bind(null, path => window.__DIS__.get()[path]);
}

function runMocha(testPaths) {
    const { Mocha, Suite } = window.__DIS__.get()['mocha'];

    const tester = new Mocha();
    const {
        EVENT_FILE_PRE_REQUIRE,
        EVENT_FILE_REQUIRE,
        EVENT_FILE_POST_REQUIRE
    } = Suite.constants;

    testPaths.forEach(path => {
        const src = window.__DIS__.get()[path];
        const testFn = hydrateTest(src);

        tester.suite.emit(EVENT_FILE_PRE_REQUIRE, window, path, tester);
        tester.suite.emit(EVENT_FILE_REQUIRE, testFn(), path, tester);
        tester.suite.emit(EVENT_FILE_POST_REQUIRE, window, path, tester);
    });

    return tester.run();
}

</script>