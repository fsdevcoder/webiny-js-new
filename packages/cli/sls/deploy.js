const { join, resolve } = require("path");
const fs = require("fs");
const { green, red, blue } = require("chalk");
const notifier = require("node-notifier");
const execute = require("./execute");
const { isApiEnvDeployed, isAppsEnvDeployed } = require("./utils");

const perks = ["🍪", "☕️", "🍎", "🍺", "🥤"];

const notify = ({ message }) => {
    notifier.notify({
        title: "Webiny CLI",
        message,
        icon: join(__dirname, "logo.png"),
        sound: false,
        wait: true
    });
};

module.exports = async inputs => {
    const { what, env } = inputs;

    const webinyJs = resolve("webiny.js");
    const config = require(webinyJs);

    if (what === "apps") {
        if (typeof env === "undefined") {
            console.log(
                `🚨 You must specify the ${green("--env")} to deploy when running ${green(
                    "deploy-apps"
                )} command.`
            );
            process.exit(1);
        }

        if (env === "local") {
            console.log(
                `🚨 You can't deploy "local" apps environment as it is reserved for local development.`
            );
            process.exit(1);
        }

        // Check if all apps have the requested environment in .env.json
        for (let i = 0; i < config.apps.length; i++) {
            const app = config.apps[i];
            const appLocation = resolve(app.location);
            const envJson = require(join(appLocation, ".env.json"));
            if (!envJson[env]) {
                console.log(
                    [
                        `🚨 Environment ${green(env)} is missing in ${green(
                            app.location + "/.env.json"
                        )} file.`,
                        "Have you deployed the corresponding API environment?",
                        `To deploy the API, run ${blue(`webiny deploy-api --env=${env}`)}.`
                    ].join("\n")
                );
                process.exit(1);
            }
        }

        const isFirstDeploy = !(await isAppsEnvDeployed(env));

        const { output, duration } = await execute(inputs);

        console.log(`\n🎉 Done! Deploy finished in ${green(duration + "s")}.`);

        notify({ message: `Apps deploy completed in ${duration}s.` });

        if (output.cdn) {
            console.log(`🚀 Your website URL: ${green(output.cdn.url)}`);
            if (isFirstDeploy) {
                console.log(
                    `⏳ Please note that CDN distribution takes some time to propagate, so expect this URL to become accessible in ~10 minutes.`
                );
            }
        }

        return;
    }

    if (what === "api") {
        const isFirstDeploy = !(await isApiEnvDeployed(env));
        if (isFirstDeploy) {
            const perk = perks[Math.floor(Math.random() * perks.length)];
            console.log(
                `This is the first deploy of ${green(
                    env
                )} environment, so it may take a few minutes.\nHere's ${perk} to make the time pass faster :)`
            );
        }

        const { output, duration } = await execute(inputs);

        // Run app state hooks
        if (!fs.existsSync(webinyJs)) {
            console.log(
                `⚠️ ${green("webiny.js")} was not found at ${green(
                    webinyJs
                )}, skipping processing of hooks.`
            );

            console.log(`\n🎉 Done! Deploy finished in ${green(duration + "s")}.`);

            return;
        }

        for (let i = 0; i < config.apps.length; i++) {
            const app = config.apps[i];
            const appLocation = resolve(app.location);
            try {
                const { hooks } = require(join(appLocation, "webiny"));
                if (hooks && hooks.stateChanged) {
                    console.log(
                        `🎣 Processing ${green("stateChanged")} hook in ${green(app.name)} app`
                    );

                    await hooks.stateChanged({ env, state: output });
                }
            } catch (err) {
                console.log(
                    `⚠️ ${red(err.message)}, while processing hooks at ${green(appLocation)}.`
                );
            }
        }

        console.log(`\n🎉 Done! Deploy finished in ${green(duration + "s")}.`);

        notify({ message: `API deploy completed in ${duration}s.` });

        if (output.cdn) {
            console.log(`🚀 GraphQL API URL: ${green(output.cdn.url + "/graphql")}`);
            if (isFirstDeploy) {
                console.log(
                    `⏳ Please note that CDN distribution takes some time to propagate, so expect this URL to become accessible in ~10 minutes.`
                );
            }
        }
    }
};
