// @flow
import type { PluginType } from "webiny-plugins/types";
import authenticate from "./authentication/authenticate";
import { getPlugins } from "webiny-plugins";
import { shield } from "graphql-shield";
import { get } from "lodash";

export default ([
    {
        type: "graphql-middleware",
        name: "graphql-middleware-shield",
        middleware: ({ config }) => {
            // If "security.enabled" was set to false, only then we exit.
            if (get(config, "security.enabled") === false) {
                return [];
            }

            const middleware = [];
            getPlugins("graphql-schema").forEach(plugin => {
                let { security } = plugin;
                if (!security) {
                    return true;
                }

                if (typeof security === "function") {
                    security = security();
                }

                security.shield &&
                    middleware.push(
                        shield(security.shield, {
                            debug: true
                        })
                    );
            });

            return middleware;
        }
    },
    {
        type: "graphql-context",
        name: "graphql-context-security",
        apply: async (context) => {
            const securityPlugins: Array<PluginType> = getPlugins("graphql-security");
            for (let i = 0; i < securityPlugins.length; i++) {
                await securityPlugins[i].authenticate(context);
            }
        }
    },
    { type: "graphql-security", name: "graphql-security", authenticate }
]: Array<PluginType>);
