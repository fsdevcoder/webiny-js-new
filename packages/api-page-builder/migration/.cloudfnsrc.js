const aliases = require("@webiny/project-utils/aliases");
const packages = require("@webiny/project-utils/packages");

module.exports = {
    name: "pb-install",
    plugins: [
        [
            "@cloudfns/aws-lambda",
            {
                region: "us-east-1",
                consoleLog: true,
                mode: "diff"
            }
        ]
    ],
    entry: "./handler/handler.js",
    webpack: config => {
        config.module.rules[0].options.babelrc = true;
        config.module.rules[0].options.babelrcRoots = packages;
        config.module.rules[0].options.presets.push("@babel/preset-flow");
        config.module.rules[0].options.plugins.push(
            "@babel/plugin-proposal-export-default-from",
            "@babel/plugin-proposal-class-properties",
            ["babel-plugin-module-resolver", { alias: aliases }]
        );
    }
};
