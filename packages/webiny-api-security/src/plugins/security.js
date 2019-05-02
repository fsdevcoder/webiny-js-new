// @flow
import type { PluginType } from "webiny-plugins/types";
import authenticate from "./authentication/authenticate";
import { getPlugins } from "webiny-plugins";
import { shield } from "graphql-shield";
import { get, flowRight } from "lodash";
import { withFields, string } from "@commodo/fields";
import { withHooks } from "@commodo/hooks";
import { withProps } from "repropose";

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
            getPlugins("graphql").forEach(plugin => {
                const { security } = plugin;
                if (!security) {
                    return true;
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
        apply: async (...args) => {
            const securityPlugins: Array<PluginType> = getPlugins("graphql-security");
            for (let i = 0; i < securityPlugins.length; i++) {
                await securityPlugins[i].authenticate(...args);
            }
        }
    },
    { type: "graphql-security", name: "graphql-security", authenticate },
    {
        type: "graphql-context",
        name: "graphql-context-security-model-fields",
        apply: async ({ models, user }) => {
            for (let name in models) {
                models[name] = flowRight(
                    withFields({
                        createdBy: string(),
                        updatedBy: string(),
                        deletedBy: string()
                    }),
                    withHooks({
                        beforeCreate() {
                            this.createdBy = this.getUser().id;
                        },
                        beforeUpdate() {
                            this.updatedBy = this.getUser().id;
                        },
                        beforeDelete() {
                            this.deletedBy = this.getUser().id;
                        }
                    }),
                    withProps({
                        getUser() {
                            return user;
                        }
                    }),
                )(models[name]);
            }
        }
    }
]: Array<PluginType>);
