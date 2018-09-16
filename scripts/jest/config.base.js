// @flow
const packages = require("./../utils/listPackages")([
    // Append untested libraries to the blacklist - they are all work in progress.
    "webiny-api*",
    "webiny-app*",
    "webiny-ui",
    "webiny-form",
    "webiny-i18n-react",
    "webiny-react-router",
    "webiny-storybook-utils"
]);

module.exports = {
    setupTestFrameworkScriptFile: "jest-extended",
    rootDir: process.cwd(),
    testRegex: `packages/(${packages.join("|")})/.*test.js$`,
    collectCoverageFrom: [`packages/{${packages.join(",")}}/src/**/*.js`],
    coverageReporters: ["lcov", "html"],
    testEnvironment: "node"
};
