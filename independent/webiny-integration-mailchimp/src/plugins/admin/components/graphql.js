// @flow
import gql from "graphql-tag";

const fields = /* GraphQL */ `
    {
        enabled
        apiKey
    }
`;

const graphql = {
    query: gql`
            query getSettings {
                settings {
                    mailchimp ${fields}
                }
            }
        `,
    mutation: gql`
            mutation updateSettings($data: MailchimpSettingsInput) {
                settings {
                    mailchimp(data: $data) ${fields}
                }
            }
        `
};

export default graphql;
