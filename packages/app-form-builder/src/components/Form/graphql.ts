import gql from "graphql-tag";

export const FIELDS_FIELDS = `
        _id
        fieldId
        type
        label {
            value
        }
        placeholderText {
            value
        }
        helpText {
            value
        }
        options {
            label {
                value
            }
            value
        }
        validation {
            name
            settings
            message {
                value
            }
        }
        settings
`;

export const DATA_FIELDS = `
    id
    parent
    fields {
        ${FIELDS_FIELDS}
    }
    layout
    triggers
    settings {
        reCaptcha {
            enabled
            errorMessage {
                value
            }
            settings {
                enabled
                siteKey
                secretKey
            }
        }
        layout {
            renderer
        }
        successMessage {
            value
        }
        submitButtonLabel {
            value
        } 
        termsOfServiceMessage {
            enabled
            message {
                value
            }
            errorMessage {
                value
            }
        }
    }
`;

export const GET_PUBLISHED_FORM = gql`
    query GetPublishedForm($id: ID, $parent: ID, $version: Int, $slug: String) {
        forms {
            getPublishedForm(id: $id, parent: $parent, version: $version, slug: $slug) {
                data {
                    ${DATA_FIELDS}
                }
                error {
                    message
                }
            }
        }
    }
`;
