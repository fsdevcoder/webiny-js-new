// @flowIgnore
const paths = require("react-scripts/config/paths");
const { getBabelLoader } = require("react-app-rewired");

module.exports = ({ packages, aliases }) => {
    return function overrideBabel(rules) {
        const babelLoader = getBabelLoader(rules);
        babelLoader.include = [paths.appSrc, ...packages];
        babelLoader.options = {
            ...babelLoader.options,
            babelrc: true,
            babelrcRoots: packages,
            plugins: [["babel-plugin-module-resolver", { alias: aliases }]]
        };
    };
};
