// @flow
import { dummyResolver } from "webiny-api/graphql";
import { hasScope } from "webiny-api-security";
import { FileType, FileInputType } from "webiny-api-files/graphql";

import form from "./graphql/Form";
import formSubmission from "./graphql/FormSubmissions";

export default {
    type: "graphql-schema",
    name: "graphql-forms",
    namespace: "forms",
    schema: {
        typeDefs: () => [
            FileType,
            FileInputType,
            `
            type FormsQuery {
                _empty: String
            }   
            
            type FormsMutation {
                _empty: String
            }
            
            type Query {
                forms: FormsQuery
            }
            
            type Mutation {
                forms: FormsMutation
            }
        `,
            form.typeDefs,
            formSubmission.typeDefs,
        ],
        resolvers: () => [
            {
                Query: {
                    forms: dummyResolver
                },
                Mutation: {
                    forms: dummyResolver
                }
            },
            form.resolvers,
            formSubmission.resolvers,
        ]
    },
    security: {
        shield: {
            FormsQuery: {
                listForms: hasScope("forms:form:crud")
            },
            FormsMutation: {
                createForm: hasScope("forms:form:crud"),
                deleteForm: hasScope("forms:form:crud"),

                createRevisionFrom: hasScope("forms:form:revision:create"),
                updateRevision: hasScope("forms:form:revision:update"),
                publishRevision: hasScope("forms:form:revision:publish"),
                deleteRevision: hasScope("forms:form:revision:delete")
            }
        }
    }
};
