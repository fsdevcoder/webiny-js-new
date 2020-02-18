const fs = require("fs");
const path = require("path");
const { Component } = require("@serverless/core");
const { loadEnv } = require("../utils");
const uniqueId = require("uniqid");
const { trackActivity, trackError } = require("@webiny/tracking");
const { version } = require(require.resolve("@webiny/cli/package.json"));

const {
    getTemplate,
    getAllComponents,
    setDependencies,
    createGraph,
    executeGraph,
    syncState,
    resolveTemplate,
    getOutputs
} = require("./utils");

const findFile = () => {
    if (fs.existsSync(`serverless.yml`)) {
        return path.resolve(`serverless.yml`);
    }

    if (fs.existsSync(`serverless.yaml`)) {
        return path.resolve(`serverless.yaml`);
    }

    throw Error(
        `Template file was not found! Make sure your serverless file has either ".yml" or ".yaml" extension.`
    );
};

const validateInputs = ({ env }) => {
    if (typeof env !== "string" || env.length === 0) {
        throw Error("An `--env` parameter must be specified!");
    }
};

class Template extends Component {
    async default(inputs = {}) {
        validateInputs(inputs);

        // Load .env.json from cwd (this will change depending on command you ran)
        await loadEnv(path.resolve(".env.json"), inputs.env, { debug: inputs.debug });

        const template = findFile();

        if (inputs.alias) {
            return await this.deployAlias(inputs.alias, { ...inputs, template });
        }

        // Run template
        return await this.deploy({ ...inputs, template });
    }

    async deploy(inputs = {}) {
        const activityId = uniqueId();
        const { what } = inputs;

        await trackActivity({
            activityId,
            type: `${what}_deploy_start`,
            cliVersion: version,
            context: this.context
        });

        try {
            this.context.status("Deploying");

            const template = await getTemplate(inputs);

            const resolvedTemplate = resolveTemplate(inputs, template);

            this.context.debug("Collecting components from the template.");

            const allComponents = getAllComponents(resolvedTemplate);

            const allComponentsWithDependencies = setDependencies(allComponents);

            const graph = createGraph(allComponentsWithDependencies);

            await syncState(allComponentsWithDependencies, this);

            this.context.debug(`Executing the template's components graph.`);

            const allComponentsWithOutputs = await executeGraph(
                allComponentsWithDependencies,
                graph,
                this,
                inputs
            );

            const outputs = getOutputs(allComponentsWithOutputs);

            this.state.outputs = outputs;
            await this.save();

            await trackActivity({
                activityId,
                type: `${what}_deploy_end`,
                cliVersion: version,
                context: this.context
            });

            return outputs;
        } catch (e) {
            await trackError({
                context: this.context,
                activityId,
                type: `${what}_deploy`,
                cliVersion: version,
                errorMessage: e.message,
                errorStack: e.stack
            });

            throw e;
        }
    }

    async deployAlias(alias, inputs) {
        alias = Array.isArray(alias) ? alias : [alias];

        const template = await getTemplate(inputs);

        if (!this.state.outputs) {
            throw Error(`You must deploy the entire API before you can deploy single components.`);
        }

        Object.keys(this.state.outputs).forEach(key => {
            if (!alias.includes(key)) {
                template[key] = this.state.outputs[key];
            }
        });

        const resolvedTemplate = resolveTemplate(inputs, template);

        const allComponents = getAllComponents(resolvedTemplate);

        const allComponentsWithDependencies = setDependencies(allComponents);

        const graph = createGraph(allComponentsWithDependencies);

        const allComponentsWithOutputs = await executeGraph(
            allComponentsWithDependencies,
            graph,
            this,
            inputs
        );

        Object.assign(this.state.outputs, getOutputs(allComponentsWithOutputs));
        await this.save();

        return this.state.outputs;
    }

    async remove(inputs = {}) {
        validateInputs(inputs);

        this.context.status(`Removing`);

        this.context.debug("Flushing template state and removing all components.");
        await syncState({}, this);

        this.state = {};
        await this.save();

        return {};
    }
}

module.exports = Template;
