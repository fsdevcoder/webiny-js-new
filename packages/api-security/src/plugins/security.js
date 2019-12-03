// @flow
import type { PluginType } from "@webiny/api/types";
import { shield } from "graphql-shield";
import authenticate from "./authentication/authenticate";

export default options => ([
    {
        type: "graphql-middleware",
        name: "graphql-middleware-shield",
        middleware: ({ plugins }) => {
            const middleware = [];
            plugins.byType("graphql-schema").forEach(plugin => {
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
                            allowExternalErrors: true
                        })
                    );
            });

            return middleware;
        }
    },
    {
        type: "graphql-context",
        name: "graphql-context-security",
        preApply: async context => {
            context.security = options;
            context.token = null;
            context.user = null;
            context.getUser = () => context.user;

            const securityPlugins: Array<PluginType> = context.plugins.byType("graphql-security");
            for (let i = 0; i < securityPlugins.length; i++) {
                await securityPlugins[i].authenticate(context);
            }
        }
    },
    { type: "graphql-security", name: "graphql-security", authenticate }
]: Array<PluginType>);
