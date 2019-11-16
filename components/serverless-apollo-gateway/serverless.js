const path = require("path");
const fs = require("fs-extra");
const prettier = require("prettier");
const execa = require("execa");
const isEqual = require("lodash.isequal");
const webpack = require("webpack");
const loadJson = require("load-json-file");
const camelCase = require("lodash.camelcase");
const writeJson = require("write-json-file");
const { transform } = require("@babel/core");
const { Component } = require("@serverless/core");

const defaultDependencies = ["babel-loader"];

const getDeps = async deps => {
    const { dependencies } = await loadJson(path.join(__dirname, "package.json"));
    return deps.reduce((acc, item) => {
        acc[item] = dependencies[item];
        return acc;
    }, {});
};

class ApolloGateway extends Component {
    async default(inputs = {}) {
        if (isEqual(this.state.inputs, inputs)) {
            this.context.instance.debug("Inputs were not changed, no action required.");
            return this.state.output;
        } else {
            this.state.inputs = inputs;
        }

        const {
            region,
            name = null,
            services = [],
            buildHeaders = __dirname + "/boilerplate/buildHeaders.js",
            env = {},
            memory = 128,
            timeout = 10,
            description,
            dependencies = {}
        } = inputs;

        if (!name) {
            throw Error(`"inputs.name" is a required parameter!`);
        }

        const boilerplateRoot = path.join(this.context.instance.root, ".webiny");
        const componentRoot = path.join(boilerplateRoot, camelCase(name));
        fs.ensureDirSync(componentRoot);

        await this.save();

        // Generate boilerplate code
        const source = fs.readFileSync(__dirname + "/boilerplate/handler.js", "utf8");
        const { code } = await transform(source, {
            plugins: [[__dirname + "/transform/services", { services }]]
        });

        fs.writeFileSync(
            path.join(componentRoot, "handler.js"),
            prettier.format(code, { parser: "babel" })
        );

        fs.copyFileSync(
            path.join(__dirname, "boilerplate", "webpack.config.js"),
            path.join(componentRoot, "/webpack.config.js")
        );

        fs.copyFileSync(path.resolve(buildHeaders), path.join(componentRoot, "/buildHeaders.js"));

        const pkgJsonPath = path.join(componentRoot, "package.json");
        fs.copyFileSync(path.join(__dirname, "boilerplate", "package.json"), pkgJsonPath);

        // Inject dependencies
        const pkgJson = await loadJson(pkgJsonPath);
        Object.assign(pkgJson.dependencies, await getDeps(defaultDependencies), dependencies);
        await writeJson(pkgJsonPath, pkgJson);

        if (!fs.existsSync(path.join(componentRoot, "yarn.lock"))) {
            await execa("yarn", ["--production"], { cwd: componentRoot });
        }

        // Bundle code (switch CWD before running webpack)
        const cwd = process.cwd();
        process.chdir(componentRoot);

        await new Promise((resolve, reject) => {
            this.context.status("Building");
            const config = require(componentRoot + "/webpack.config.js");
            webpack(config).run((err, stats) => {
                if (err) {
                    return reject(err);
                }

                if (stats.hasErrors()) {
                    this.context.log(
                        stats.toString({
                            colors: true
                        })
                    );
                    return reject("Build failed!");
                }

                resolve();
            });
        });

        // Restore initial CWD
        process.chdir(cwd);

        // Deploy lambda
        const lambda = await this.load("@webiny/serverless-function");

        const output = await lambda({
            region,
            description: `serverless-apollo-gateway: ${description || name}`,
            code: path.join(componentRoot, "build"),
            root: componentRoot,
            handler: "handler.handler",
            env,
            memory,
            timeout
        });

        this.state.output = output;
        await this.save();

        return output;
    }

    async remove(inputs = {}) {
        const lambda = await this.load("@webiny/serverless-function");
        await lambda.remove(inputs);

        this.state = {};
        await this.save();
    }
}

module.exports = ApolloGateway;
