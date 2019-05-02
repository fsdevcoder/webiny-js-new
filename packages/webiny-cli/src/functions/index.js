/* eslint-disable */
const path = require("path");
const nodemon = require("nodemon");
const chalk = require("chalk");
const tcpPortUsed = require("tcp-port-used");
const listFunctions = require("./listFunctions");
const logFunctions = require("./logFunctions");

module.exports = async ({ port, watch }) => {
    watch = Array.isArray(watch) ? watch : [watch];
    const command = [path.join(__dirname, "runFunctions.js")];

    // "--also-watch" argument:
    const functions = await listFunctions();
    let watchPaths = functions.map(fn => fn.root + "/**/*.js");
    if (watch) {
        watch.forEach(w => {
            watchPaths.push(path.resolve(w));
        });
    }

    watchPaths.forEach(item => command.unshift(`-w ${item}`));

    // "--port" argument:
    command.push(`--port=${port}`);

    // Check port:
    tcpPortUsed.check(port).then(async inUse => {
        if (inUse) {
            console.log(chalk.red(`Port ${port} already in use.`));
            process.exit(1);
        }

        logFunctions(functions);
        nodemon(command.join(" "))
            .on("quit", process.exit)
            .on("restart", function() {
                console.log(chalk.green("Restarting..."));
            });
    });
};
