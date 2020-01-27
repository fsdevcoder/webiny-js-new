import gql from "graphql-tag";
import { emptyResolver, resolveUpdateSettings, resolveGetSettings } from "@webiny/commodo-graphql";
import { hasScope } from "@webiny/api-security";
import googleTagManagerSettings from "./googleTagManagerSettings.model";

export default () => [
    {
        type: "graphql-context",
        name: "graphql-context-models-google-tag-manager",
        apply({ models }) {
            models.GoogleTagManagerSettings = googleTagManagerSettings({
                createBase: models.createBase
            });
        }
    },
    {
        name: "graphql-schema-google-tag-manager",
        type: "graphql-schema",
        schema: {
            typeDefs: gql`
                type GtmError {
                    code: String
                    message: String
                    data: JSON
                }

                type GtmSettings {
                    enabled: Boolean
                    code: String
                }

                type GtmSettingsResponse {
                    data: GtmSettings
                    error: GtmError
                }

                input GtmSettingsInput {
                    enabled: Boolean
                    code: String
                }

                type GtmQuery {
                    getSettings: GtmSettingsResponse
                }

                type GtmMutation {
                    updateSettings(data: GtmSettingsInput): GtmSettingsResponse
                }

                extend type Query {
                    googleTagManager: GtmQuery
                }

                extend type Mutation {
                    googleTagManager: GtmMutation
                }
            `,
            resolvers: {
                Query: {
                    googleTagManager: emptyResolver
                },
                Mutation: {
                    googleTagManager: emptyResolver
                },
                GtmQuery: {
                    getSettings: resolveGetSettings(({ models }) => models.GoogleTagManagerSettings)
                },
                GtmMutation: {
                    updateSettings: resolveUpdateSettings(
                        ({ models }) => models.GoogleTagManagerSettings
                    )
                }
            }
        },
        security: {
            shield: {
                GtmMutation: {
                    updateSettings: hasScope("pb:settings")
                }
            }
        }
    }
];
