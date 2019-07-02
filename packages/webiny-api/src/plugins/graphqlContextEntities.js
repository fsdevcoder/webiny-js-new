// @flow
import type { GraphQLContextPluginType, EntityPluginType } from "webiny-api/types";
import { getPlugins } from "webiny-plugins";
import { EntityPool } from "webiny-entity";

const registerEntityClass = ({ context, entityClass }) => {
    if (context.entities[entityClass.classId]) {
        throw Error(`Entity with the class ID "${entityClass.classId}" already registered.`);
    }

    context.entities[entityClass.classId] = entityClass;
};

const graphqlContextEntities: GraphQLContextPluginType = {
    name: "graphql-context-entities",
    type: "graphql-context",
    apply(context) {
        context.entities = {};
        context.getEntities = () => {
            return context.entities;
        };

        context.getEntity = name => {
            return context.getEntities()[name];
        };

        getPlugins("entity").forEach((plugin: EntityPluginType) => {
            if (!context[plugin.namespace]) {
                context[plugin.namespace] = {
                    entities: {}
                };
            }

            if (typeof plugin.entity === "function") {
                const entityClass = plugin.entity(context);
                entityClass.pool = new EntityPool();
                registerEntityClass({ context, entityClass });
            } else {
                const { name, factory } = plugin.entity;
                context[plugin.namespace].entities[name] = factory(context);
                context[plugin.namespace].entities[name].pool = new EntityPool();

                // We add to entities list, later we'll just do the cleanup - this won't exist.
                registerEntityClass({
                    context,
                    entityClass: context[plugin.namespace].entities[name]
                });
            }
        });
    }
};

export default graphqlContextEntities;
