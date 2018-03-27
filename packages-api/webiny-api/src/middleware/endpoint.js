// @flow
import debug from "debug";
import _ from "lodash";
import compose from "webiny-compose";
import semver from "semver";
import { app, ApiErrorResponse } from "./../index";

declare type EndpointMiddlewareOptions = {
    beforeApiMethod?: Array<Function>,
    afterApiMethod?: Array<Function>
};

export default (options: EndpointMiddlewareOptions = {}) => {
    // Endpoint hooks in form of a middleware
    const beforeApiMethodMiddleware = compose(_.get(options, "beforeApiMethod", []));
    const afterApiMethodMiddleware = compose(_.get(options, "afterApiMethod", []));

    return async (
        params: {
            req: express$Request,
            res: express$Response,
            versioning: Function,
            response: Object
        },
        next: Function
    ) => {
        const { req, res, versioning } = params;
        const log = debug("api:endpoint");
        log(`Trying to match an endpoint: %o`, req.method + " " + req.path);
        const reqVersion = versioning(req);

        const versionPrefix = reqVersion !== "latest" ? "/v" + reqVersion : "";
        const reqUrl = req.path
            .replace(versionPrefix, "")
            .split("?")
            .shift();

        const urls = Object.keys(app.endpoints);

        for (let i = 0; i < urls.length; i++) {
            const baseUrl = urls[i];
            const definition = app.endpoints[baseUrl];

            if (!reqUrl.startsWith(baseUrl)) {
                continue;
            }

            const url = reqUrl.replace(baseUrl, "") || "/";
            log(`Routing endpoint %o, with URL: %o`, definition.classId, url);

            let maxVersion = definition.latest;
            if (reqVersion !== "latest") {
                maxVersion = semver.maxSatisfying(Object.keys(definition.versions), reqVersion);
            }

            if (reqVersion !== "latest" && !semver.satisfies(maxVersion, reqVersion)) {
                log(`Requested API version could not be satisfied!`);
                break;
            }

            const instance = new definition.versions[maxVersion]();
            const matchedMethod = instance.getApi().matchMethod(req.method, url);
            if (!matchedMethod) {
                break;
            }

            log(
                "Matched %o with pattern %o",
                matchedMethod.getApiMethod().getName(),
                matchedMethod.getApiMethod().getPattern()
            );

            try {
                await beforeApiMethodMiddleware({ req, res, matchedApiMethod: matchedMethod });
            } catch (e) {
                params.response = new ApiErrorResponse(
                    {},
                    e.message,
                    e.type || "WBY_MATCHED_METHOD",
                    401
                );
                break;
            }

            const methodParams = matchedMethod.getParams();
            const response = await matchedMethod
                .getApiMethod()
                .exec(req, res, methodParams, instance);

            try {
                await afterApiMethodMiddleware({ matchedApiMethod: matchedMethod, response });
            } catch (e) {
                params.response = new ApiErrorResponse(
                    {},
                    e.message,
                    e.type || "WBY_MATCHED_METHOD",
                    401
                );
                break;
            }

            // Assign response to the params object so other middleware functions can access and modify it.
            params.response = response;
            log(`Successfully fetched response!`);
        }
        next();
    };
};
