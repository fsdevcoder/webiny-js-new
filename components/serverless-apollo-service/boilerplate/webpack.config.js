const path = require("path");

module.exports = {
    entry: path.join(__dirname, "handler.js"),
    target: "node",
    output: {
        libraryTarget: "commonjs",
        path: path.join(__dirname, "build"),
        filename: "handler.js"
    },
    // Generate sourcemaps for proper error messages
    devtool: false,
    externals: ["aws-sdk"],
    mode: "production",
    optimization: {
        // We no not want to minimize our code.
        minimize: false
    },
    performance: {
        // Turn off size warnings for entry points
        hints: false
    },
    // Run babel on all .js files and skip those in node_modules
    module: {
        exprContextCritical: false,
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /node_modules/,
                include: [__dirname],
                options: {
                    presets: [
                        [
                            "@babel/preset-env",
                            {
                                targets: {
                                    node: "10.16"
                                }
                            }
                        ]
                    ],
                    plugins: ["@babel/plugin-proposal-class-properties"]
                }
            }
        ]
    },
    resolve: {
        modules: [path.resolve(__dirname, "node_modules"), "node_modules"]
    }
};
