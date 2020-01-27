import { resolveUpdateSettings, resolveGetSettings } from "@webiny/commodo-graphql";

export default {
    name: "graphql-schema-settings-page-builder",
    type: "graphql-schema",
    typeDefs: /* GraphQL */ `
        type PbSettingsError {
            code: String
            message: String
            data: JSON
        }

        type PbSocialMedia {
            facebook: String
            twitter: String
            instagram: String
            image: File
        }

        type PbSettings {
            name: String
            favicon: File
            logo: File
            domain: String
            social: PbSocialMedia
            pages: PbSettingsPages
        }

        type PbSettingsResponse {
            error: PbSettingsError
            id: ID
            data: PbSettings
        }

        type PbSettingsPages {
            home: ID
            notFound: ID
            error: ID
        }

        type PbDefaultPage {
            id: String
            parent: String
            title: String
        }

        input PbSocialMediaInput {
            facebook: String
            twitter: String
            instagram: String
            image: RefInput
        }

        input PbDefaultPageInput {
            id: String
            title: String
        }

        input PbSettingsInput {
            name: String
            domain: String
            favicon: RefInput
            logo: RefInput
            social: PbSocialMediaInput
            pages: PbSettingsPagesInput
        }

        input PbSettingsPagesInput {
            home: ID
            notFound: ID
            error: ID
        }

        extend type PbQuery {
            getSettings: PbSettingsResponse
        }

        extend type PbMutation {
            updateSettings(data: PbSettingsInput): PbSettingsResponse
        }
    `,
    resolvers: {
        PbQuery: {
            getSettings: resolveGetSettings(ctx => ctx.models.PbSettings)
        },
        PbMutation: {
            updateSettings: resolveUpdateSettings(ctx => ctx.models.PbSettings)
        },
        PbSocialMedia: {
            image({ image }) {
                return image ? { __typename: "File", id: image } : null;
            }
        },
        PbSettings: {
            favicon({ favicon }) {
                return favicon ? { __typename: "File", id: favicon } : null;
            },
            logo({ logo }) {
                return logo ? { __typename: "File", id: logo } : null;
            }
        }
    }
};
