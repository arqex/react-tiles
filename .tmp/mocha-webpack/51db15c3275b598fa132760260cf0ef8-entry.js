
    var testsContext = require.context("../../tests", false);

    var runnable = testsContext.keys();

    runnable.forEach(testsContext);
    