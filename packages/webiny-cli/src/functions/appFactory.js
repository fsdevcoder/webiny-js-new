/* eslint-disable */
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const listFunctions = require("./listFunctions");
const expressRequestToLambdaEvent = require("./expressRequestToLambdaEvent");

const handleRequest = async (req, res, handler) => {
    const event = expressRequestToLambdaEvent(req);
    const result = await handler(event, { req });
    res.set(result.headers);
    res.status(result.statusCode).send(result.body);
};

module.exports = () => {
    require("@babel/register")({
        configFile: path.resolve(process.cwd() + "/babel.config.js"),
        only: [/packages|independent/]
    });

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ limit: "25mb", extended: true }));
    app.all("*", async (req, res, next) => {
        if (req.method !== "OPTIONS") {
            return next();
        }

        res.set({
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        })
            .status(200)
            .send();
    });

    app.get("/files/:key", async (req, res) => {
        const { handler } = require("./fileHandlers/download");
        await handleRequest(req, res, handler);
    });

    app.post("/files", async (req, res) => {
        const { handler } = require("./fileHandlers/uploadRequest");
        await handleRequest(req, res, handler);
    });

    app.post("/files/upload", async (req, res) => {
        const { handler } = require("./fileHandlers/upload");
        await handleRequest(req, res, handler);
    });

    listFunctions().forEach(fn => {
        app[fn.method.toLowerCase()](fn.path, async (req, res) => {
            const { handler } = require(path.join(fn.root, fn.handler));
            await handleRequest(req, res, handler);
        });
    });

    return app;
};
