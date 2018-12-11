// @flow
import { renderMiddleware } from "webiny-app/router";
import ApolloClient from "apollo-client";
import { ApolloLink } from "apollo-link";
import { BatchHttpLink } from "apollo-link-batch-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createOmitTypenameLink } from "webiny-app/graphql";

export default {
    router: {
        basename: "/",
        middleware: [renderMiddleware()]
    },
    apolloClient: new ApolloClient({
        link: ApolloLink.from([
            createOmitTypenameLink(),
            new BatchHttpLink({ uri: "http://localhost:9000/graphql" })
        ]),
        cache: new InMemoryCache({
            addTypename: true,
            dataIdFromObject: obj => obj.id || null
        }),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: "network-only",
                errorPolicy: "all"
            },
            query: {
                fetchPolicy: "network-only",
                errorPolicy: "all"
            }
        }
    })
    /*components: {
        Image: {
            presets: {
                avatar: { width: 128 }
            },
            plugin: "image-component"
        },
        withFileUpload: {
            plugin: ["with-file-upload", { uri: "http://localhost:9000/files" }]
        }
    }*/
};
